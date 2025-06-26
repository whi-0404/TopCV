import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/outline';
import { companyApi } from '../../services/api/companyApi';
import { CompanyReviewResponse, CompanyReviewStatsResponse } from '../../types';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ReviewSectionProps {
  companyId: number;
  reviewStats?: CompanyReviewStatsResponse;
  currentUserId?: string;
  onReviewUpdate?: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  companyId,
  reviewStats,
  currentUserId,
  onReviewUpdate
}) => {
  const [reviews, setReviews] = useState<CompanyReviewResponse[]>([]);
  const [userReview, setUserReview] = useState<CompanyReviewResponse | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async (page: number = 1) => {
    try {
      setReviewsLoading(true);
      const response = await companyApi.getCompanyReviews(companyId, page, 10);
      if (response.code === 1000 && response.result) {
        setReviews(response.result.data);
        setTotalPages(response.result.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUserReview = async () => {
    if (!currentUserId) return;
    
    try {
      const response = await companyApi.getUserReviewForCompany(companyId);
      if (response.code === 1000 && response.result) {
        setUserReview(response.result);
      }
    } catch (error) {
      // User hasn't reviewed yet or error occurred
      console.log('User review not found or error:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
    if (currentUserId) {
      fetchUserReview();
    }
  }, [companyId, currentUserId]);

  const handleSubmitReview = async (data: { rateStar: number; reviewText: string }) => {
    try {
      setLoading(true);
      
      if (isEditing && userReview) {
        // Update existing review
        const response = await companyApi.updateCompanyReview(companyId, data);
        if (response.code === 1000 && response.result) {
          setUserReview(response.result);
          // Update in reviews list if it exists there
          setReviews(prev => prev.map(review => 
            review.userId === currentUserId ? response.result : review
          ));
        }
      } else {
        // Add new review
        const response = await companyApi.addCompanyReview(companyId, data);
        if (response.code === 1000 && response.result) {
          setUserReview(response.result);
          // Add to reviews list
          setReviews(prev => [response.result, ...prev]);
        }
      }
      
      setShowReviewForm(false);
      setIsEditing(false);
      onReviewUpdate?.();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review: CompanyReviewResponse) => {
    setUserReview(review);
    setIsEditing(true);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (review: CompanyReviewResponse) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return;
    }

    try {
      setLoading(true);
      await companyApi.deleteCompanyReview(companyId, review.userId);
      setUserReview(null);
      // Remove from reviews list
      setReviews(prev => prev.filter(r => r.userId !== review.userId));
      onReviewUpdate?.();
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setIsEditing(false);
    if (isEditing) {
      setUserReview(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <StarIconOutline className="w-5 h-5 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      {reviewStats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Đánh giá công ty</h3>
            {currentUserId && !userReview && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Viết đánh giá
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(reviewStats.averageRating))}
              </div>
              <p className="text-sm text-gray-600">Đánh giá trung bình</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {reviewStats.totalReviews}
              </div>
              <p className="text-sm text-gray-600">Tổng số đánh giá</p>
            </div>
            
            {reviewStats.recommendationRate && (
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {reviewStats.recommendationRate}%
                </div>
                <p className="text-sm text-gray-600">Tỷ lệ giới thiệu</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          companyId={companyId}
          existingReview={isEditing ? userReview : undefined}
          onSubmit={handleSubmitReview}
          onCancel={handleCancelReview}
          isLoading={loading}
        />
      )}

      {/* User's Review (if exists and not editing) */}
      {userReview && !showReviewForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-blue-900">Đánh giá của bạn</h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditReview(userReview)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => handleDeleteReview(userReview)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Xóa
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(userReview.rateStar)}
            <span className="text-sm text-gray-600">
              {new Date(userReview.reviewDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <p className="text-gray-700">{userReview.reviewText}</p>
        </div>
      )}

      {/* Review List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-4">Tất cả đánh giá</h3>
        
        <ReviewList
          reviews={reviews}
          currentUserId={currentUserId}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
          isLoading={reviewsLoading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchReviews(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              
              <span className="px-3 py-2 text-gray-600">
                Trang {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={() => fetchReviews(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection; 