# MicroTask Pro - Micro-Task and Earning Platform

## Overview
MicroTask Pro is a comprehensive micro-task marketplace where workers can complete small tasks to earn coins and buyers can post tasks to get work done quickly.

## Site Details
- **Site Name**: MicroTask Pro
- **Admin Email**: admin@microtaskpro.com
- **Admin Password**: admin123456
- **Live Site URL**: https://microtask-pro.netlify.app

## Key Features
1. **Role-Based Authentication**: Workers, Buyers, and Admin roles with specific permissions
2. **Task Marketplace**: Browse and complete tasks or post tasks for others
3. **Real-Time Notifications**: Get notified for task approvals, rejections, and payments
4. **Coin System**: 20 coins = $1 withdrawal rate
5. **Secure Payments**: Multiple payment options (Stripe, Bkash, Rocket, Nagad)
6. **Profile Management**: Upload profile pictures and manage personal information
7. **Task Submissions**: Submit work with proof and get approved/rejected
8. **Withdrawal System**: Cash out earnings when minimum threshold is met
9. **Dashboard Analytics**: Track earnings, submissions, and task performance
10. **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
11. **Google Sign-In**: Quick authentication with Google
12. **Dark Mode Support**: Toggle between light and dark themes

## Role Descriptions

### Worker
- **Start Bonus**: 10 coins upon registration
- **Earning**: Complete tasks and earn coins
- **Withdrawal**: Cash out when you have 200+ coins ($10 minimum)
- **Dashboard Features**: View submissions, track earnings, browse tasks

### Buyer
- **Start Bonus**: 50 coins upon registration
- **Task Creation**: Post tasks with specific requirements and payment amounts
- **Review System**: Approve or reject worker submissions
- **Payment History**: Track all transactions and task payments

### Admin
- **User Management**: Add, remove, and manage user roles
- **Task Oversight**: Monitor and manage all platform tasks
- **Withdrawal Processing**: Approve withdrawal requests
- **Platform Analytics**: View comprehensive platform statistics

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Google OAuth credentials (for Google Sign-In)
- ImgBB API key (for image uploads)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run development server: `npm run dev`

### Environment Variables
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/microtask-pro
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret-here
IMGBB_API_KEY=your-imgbb-api-key
```

## Business Logic
- **Workers** earn 10 coins on registration
- **Buyers** get 50 coins on registration  
- **20 coins = $1** for withdrawals (platform keeps 50% profit)
- **Minimum withdrawal**: 200 coins ($10)
- **Task payment**: Deducted from buyer's coins upfront

## Technologies Used
- **Frontend**: Next.js 16, React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **Notifications**: React Hot Toast
- **Image Upload**: ImgBB API
- **Payments**: Stripe integration (optional)

## Deployment
This application is optimized for Netlify deployment with serverless functions.

## Support
For issues or questions, please visit our GitHub repository or contact support@microtaskpro.com
