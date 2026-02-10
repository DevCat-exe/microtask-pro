import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import User from '@/models/User';
import { auth } from '@/auth';

// GET /api/tasks/[id] - Get a single task
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const task = await Task.findById(id);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a task and refund coins
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'buyer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id: taskId } = await params;
    const task = await Task.findById(taskId);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.buyerEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Calculate refund: remaining spots
    const refundAmount = task.remainingWorkers * task.payableAmount;

    // Delete task
    await Task.findByIdAndDelete(taskId);

    // Refund coins to buyer
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $inc: { coins: refundAmount } }
    );

    return NextResponse.json({ message: 'Task deleted and coins refunded', refundAmount });
  } catch (error) {
    console.error('Task deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
