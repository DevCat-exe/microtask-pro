import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { auth } from '@/auth';

// GET /api/tasks - Get all available tasks
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (email) {
      query.buyerEmail = email;
    } else {
      // Default for worker view: only show active tasks with remaining spots
      query.status = 'active';
      query.remainingWorkers = { $gt: 0 };
    }
    
    const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .limit(50);
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
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
    const { 
      title, 
      detail, 
      requiredWorkers, 
      payableAmount, 
      completionDate, 
      submissionInfo,
      taskImageUrl 
    } = body;
    
    // Validate required fields
    if (!title || !detail || !requiredWorkers || !payableAmount || !completionDate || !submissionInfo) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }
    
    // Check if buyer has enough coins
    const User = (await import('@/models/User')).default;
    const buyer = await User.findById(session.user.id);
    
    const totalCost = requiredWorkers * payableAmount;
    
    if (!buyer || buyer.coins < totalCost) {
      return NextResponse.json(
        { error: 'Insufficient coins. Please purchase more coins.' },
        { status: 400 }
      );
    }
    
    // Create task
    const task = await Task.create({
      title,
      detail,
      requiredWorkers,
      payableAmount,
      completionDate: new Date(completionDate),
      submissionInfo,
      taskImageUrl: taskImageUrl || '',
      buyerId: session.user.id,
      buyerName: session.user.name,
      buyerEmail: session.user.email,
      remainingWorkers: requiredWorkers,
    });
    
    // Deduct coins from buyer
    buyer.coins -= totalCost;
    await buyer.save();
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}