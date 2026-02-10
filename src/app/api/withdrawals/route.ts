import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';
import { auth } from '@/auth';

// GET /api/withdrawals - Get withdrawals (worker's own OR all if admin)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    let query: any = {};
    if (session.user.role !== 'admin') {
      query = { workerEmail: session.user.email };
    }
    
    const withdrawals = await Withdrawal.find(query)
      .sort({ withdrawDate: -1 });
    
    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

// PATCH /api/withdrawals - Approve or reject withdrawal (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const { id, status } = await req.json();
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }
    
    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'Can only update pending requests' }, { status: 400 });
    }
    
    withdrawal.status = status;
    await withdrawal.save();
    
    // If rejected, refund coins to worker
    if (status === 'rejected') {
      await User.findByIdAndUpdate(withdrawal.workerId, {
        $inc: { coins: withdrawal.withdrawalCoin }
      });
    }
    
    // Create notification
    const Notification = (await import('@/models/Notification')).default;
    await Notification.create({
      userId: withdrawal.workerId,
      message: `Your withdrawal request for $${withdrawal.withdrawalAmount} has been ${status}.`,
      type: status === 'approved' ? 'success' : 'error',
      actionUrl: '/dashboard/worker/withdrawals'
    });

    return NextResponse.json(withdrawal);
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
  }
}

// POST /api/withdrawals - Create a new withdrawal request
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'worker') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const body = await req.json();
    const { withdrawalCoin, paymentSystem, accountNumber } = body;
    
    // Validate minimum withdrawal
    if (withdrawalCoin < 200) {
      return NextResponse.json(
        { error: 'Minimum withdrawal is 200 coins' },
        { status: 400 }
      );
    }
    
    // Check if user has enough coins
    const user = await User.findById(session.user.id);
    if (!user || user.coins < withdrawalCoin) {
      return NextResponse.json(
        { error: 'Insufficient coins' },
        { status: 400 }
      );
    }
    
    // Create withdrawal
    const withdrawal = await Withdrawal.create({
      workerId: session.user.id,
      workerName: session.user.name,
      workerEmail: session.user.email,
      withdrawalCoin,
      paymentSystem,
      accountNumber,
    });
    
    // Deduct coins immediately (or you can wait for admin approval)
    user.coins -= withdrawalCoin;
    await user.save();
    
    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json(
      { error: 'Failed to create withdrawal' },
      { status: 500 }
    );
  }
}