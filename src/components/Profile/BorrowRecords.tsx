import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Package } from 'lucide-react';
import { BorrowRecord } from '../../types';

interface BorrowRecordsProps {
  records: BorrowRecord[];
  isOwnProfile: boolean;
}

export function BorrowRecords({ records, isOwnProfile }: BorrowRecordsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'returned':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Borrow Records</h3>
        <p className="text-gray-600">
          {isOwnProfile 
            ? "You haven't borrowed or lent any items yet." 
            : "This user hasn't borrowed or lent any items yet."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{record.item_title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Borrowed: {formatDate(record.borrowed_at)}</span>
                </div>
                {record.due_date && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Due: {formatDate(record.due_date)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(record.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            </div>
          </div>

          {record.status === 'active' && record.due_date && (
            <div className="mb-4">
              {(() => {
                const daysRemaining = calculateDaysRemaining(record.due_date);
                if (daysRemaining < 0) {
                  return (
                    <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                      <div className="text-red-800 font-medium">
                        Overdue by {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                } else if (daysRemaining <= 2) {
                  return (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <div className="text-yellow-800 font-medium">
                        Due in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                      <div className="text-blue-800 font-medium">
                        {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          )}

          {record.returned_at && (
            <div className="mb-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                <div className="text-green-800 font-medium">
                  Returned on {formatDate(record.returned_at)}
                </div>
              </div>
            </div>
          )}

          {record.notes && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Notes:</span> {record.notes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}