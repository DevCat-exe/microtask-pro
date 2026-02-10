import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Task from '@/models/Task';
import Payment from '@/models/Payment';
import Submission from '@/models/Submission';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalCoins = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$coins' } } }
    ]);
    const totalPayments = await Payment.countDocuments({ status: 'completed' });
    const totalRevenue = await Payment.aggregate([
       { $match: { status: 'completed' } },
       { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalSubmissions = await Submission.countDocuments();
    const activeTasks = await Task.countDocuments({ status: 'active' });

    return NextResponse.json({
      totalUsers,
      totalCoins: totalCoins[0]?.total || 0,
      totalPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalSubmissions,
      activeTasks
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
