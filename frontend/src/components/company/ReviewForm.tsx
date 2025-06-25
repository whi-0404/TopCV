import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { CompanyReviewResponse } from '../../types';

interface ReviewFormProps {
  companyId: number;
  existingReview?: CompanyReviewResponse | null;
  onSubmit: (data: { rateStar: number; reviewText: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  companyId,
  existingReview,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [rating, setRating] = useState(existingReview?.rateStar || 0);
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || '');
  const [errors, setErrors] = useState<{ rating?: string; reviewText?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { rating?: string; reviewText?: string } = {};
    
    if (rating === 0) {
      newErrors.rating = 'Vui lòng chọn số sao đánh giá';
    }
    
    if (!reviewText.trim()) {
      newErrors.reviewText = 'Vui lòng nhập nội dung đánh giá';
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = 'Nội dung đánh giá phải có ít nhất 10 ký tự';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onSubmit({ rateStar: rating, reviewText: reviewText.trim() });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
    if (errors.reviewText) {
      setErrors(prev => ({ ...prev, reviewText: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">
        {existingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="text-2xl transition-colors hover:scale-110"
              >
                {star <= rating ? (
                  <StarIcon className="w-8 h-8 text-yellow-400" />
                ) : (
                  <StarIconOutline className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                )}
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 1 && 'Rất không hài lòng'}
              {rating === 2 && 'Không hài lòng'}
              {rating === 3 && 'Bình thường'}
              {rating === 4 && 'Hài lòng'}
              {rating === 5 && 'Rất hài lòng'}
            </p>
          )}
          {errors.rating && (
            <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung đánh giá *
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={handleReviewTextChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              errors.reviewText ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Chia sẻ trải nghiệm của bạn về công ty này..."
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.reviewText && (
              <p className="text-sm text-red-600">{errors.reviewText}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {reviewText.length}/500
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang gửi...
              </div>
            ) : (
              existingReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm; 