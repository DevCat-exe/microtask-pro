'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ITEMS_PER_PAGE = 10;

export default function MySubmissionsPage() {
  const { data: submissions, error, isLoading } = useSWR('/api/submissions?type=worker', fetcher);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = submissions ? Math.ceil(submissions.length / ITEMS_PER_PAGE) : 0;
  const paginatedSubmissions = submissions?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load submissions. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">My Submissions</h1>
        <p className="text-text-secondary">Track your task submissions and their status</p>
      </div>

      {submissions?.length > 0 ? (
        <>
          <div className="rounded-xl border border-border bg-white overflow-hidden dark:bg-bg-card-dark">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-bg-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">Task</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">Coins</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text">Buyer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedSubmissions.map((submission: any) => (
                    <tr 
                      key={submission._id}
                      className="hover:bg-gray-50 dark:hover:bg-bg-dark transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-text">{submission.taskTitle}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(submission.submissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-primary">
                          {submission.payableAmount} coins
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {submission.buyerName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, submissions.length)} of{' '}
                {submissions.length} submissions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-text-secondary">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 rounded-xl border border-border bg-white dark:bg-bg-card-dark">
          <FileCheck className="h-16 w-16 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No submissions yet</h3>
          <p className="text-text-secondary">Start completing tasks to see your submissions here</p>
        </div>
      )}
    </div>
  );
}