import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
import Task from '@/models/Task';
import User from '@/models/User';
import { auth } from '@/auth';

// GET /api/submissions - Get submissions for current user
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
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'worker' or 'buyer'
    
    let query = {};
    if (type === 'worker') {
      query = { workerEmail: session.user.email };
    } else if (type === 'buyer') {
      query = { buyerEmail: session.user.email };
    }
    
    const submissions = await Submission.find(query)
      .sort({ submissionDate: -1 })
      .limit(50);
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// POST /api/submissions - Create a new submission
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
    const { taskId, submissionDetails } = body;
    
    // Get task details
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    if (task.remainingWorkers <= 0) {
      return NextResponse.json(
        { error: 'No more workers needed for this task' },
        { status: 400 }
      );
    }
    
    // Check if worker already submitted
    const existingSubmission = await Submission.findOne({
      taskId,
      workerEmail: session.user.email,
    });
    
    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted for this task' },
        { status: 400 }
      );
    }
    
    // Create submission
    const submission = await Submission.create({
      taskId,
      taskTitle: task.title,
      payableAmount: task.payableAmount,
      workerId: session.user.id,
      workerName: session.user.name,
      workerEmail: session.user.email,
      buyerId: task.buyerId,
      buyerName: task.buyerName,
      buyerEmail: task.buyerEmail,
      submissionDetails,
    });
    
    // Create notification for buyer
    const Notification = (await import('@/models/Notification')).default;
    await Notification.create({
      userId: task.buyerId,
      message: `New submission for task: ${task.title}`,
      type: 'info',
      actionUrl: '/dashboard/buyer/submissions'
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

// PATCH /api/submissions/:id - Approve or reject submission
export async function PATCH(req: NextRequest) {
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
    const { submissionId, status, reviewNotes } = body;
    
    const submission = await Submission.findById(submissionId);
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Verify buyer owns this submission
    if (submission.buyerEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Update submission
    submission.status = status;
    submission.reviewedDate = new Date();
    submission.reviewNotes = reviewNotes;
    await submission.save();
    
    // If approved, add coins to worker
    if (status === 'approved') {
      const worker = await User.findById(submission.workerId);
      if (worker) {
        worker.coins += submission.payableAmount;
        await worker.save();
      }
      
      // Decrease remaining workers
      const task = await Task.findById(submission.taskId);
      if (task) {
        task.remainingWorkers -= 1;
        if (task.remainingWorkers <= 0) {
          task.status = 'completed';
        }
        await task.save();
      }
    } else if (status === 'rejected') {
      // Increase remaining workers back
      const task = await Task.findById(submission.taskId);
      if (task) {
        task.remainingWorkers += 1;
        await task.save();
      }
    }
    
    // Create notification for worker
    const Notification = (await import('@/models/Notification')).default;
    await Notification.create({
      userId: submission.workerId,
      message: `Your submission for "${submission.taskTitle}" has been ${status}.`,
      type: status === 'approved' ? 'success' : 'error',
      actionUrl: '/dashboard/worker/submissions'
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}