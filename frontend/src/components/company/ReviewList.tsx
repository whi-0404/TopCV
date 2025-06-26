import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CompanyReviewResponse } from '../../types';

interface ReviewListProps {
  reviews: CompanyReviewResponse[];
  currentUserId?: string;
  onEditReview?: (review: CompanyReviewResponse) => void;
  onDeleteReview?: (review: CompanyReviewResponse) => void;
  isLoading?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentUserId,
  onEditReview,
  onDeleteReview,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Ngày không xác định';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIcon className="w-4 h-4 text-yellow-400" />
            ) : (
              <StarIconOutline className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Rất không hài lòng';
      case 2: return 'Không hài lòng';
      case 3: return 'Bình thường';
      case 4: return 'Hài lòng';
      case 5: return 'Rất hài lòng';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">
          <StarIconOutline className="w-12 h-12 mx-auto text-gray-300" />
        </div>
        <p className="text-gray-600">Chưa có đánh giá nào cho công ty này</p>
        <p className="text-sm text-gray-500">Hãy là người đầu tiên đánh giá!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={`${review.userId}-${review.reviewDate}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {review.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{review.fullName}</h4>
                <div className="flex items-center gap-2">
                  {renderStars(review.rateStar)}
                  <span className="text-sm text-gray-600">
                    {getRatingText(review.rateStar)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action buttons for current user's review */}
            {currentUserId === review.userId && (
              <div className="flex items-center gap-2">
                {onEditReview && (
                  <button
                    onClick={() => onEditReview(review)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Chỉnh sửa đánh giá"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )}
                {onDeleteReview && (
                  <button
                    onClick={() => onDeleteReview(review)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Xóa đánh giá"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {review.reviewText}
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            Đánh giá vào {formatDate(review.reviewDate)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 