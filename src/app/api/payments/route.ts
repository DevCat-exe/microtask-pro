import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Payment from '@/models/Payment';
import User from '@/models/User';
import { auth } from '@/auth';

// GET /api/payments - Get payment history
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const payments = await Payment.find({ buyerEmail: session.user.email })
      .sort({ paymentDate: -1 });
    
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create a new payment
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'buyer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const body = await req.json();
    const { amount, coins, paymentMethod } = body;
    
    // Create payment record
    const payment = await Payment.create({
      buyerId: session.user.id,
      buyerName: session.user.name,
      buyerEmail: session.user.email,
      amount,
      coins,
      paymentMethod,
      transactionId: `TXN${Date.now()}`,
      status: 'completed',
    });
    
    // Add coins to buyer
    const user = await User.findById(session.user.id);
    if (user) {
      user.coins += coins;
      await user.save();
    }
    
    // Create notification
    const Notification = (await import('@/models/Notification')).default;
    await Notification.create({
      userId: session.user.id,
      message: `Payment successful! ${coins} coins added to your balance.`,
      type: 'success',
      actionUrl: '/dashboard/buyer/payment-history'
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}