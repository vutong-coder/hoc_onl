import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trang không tìm thấy
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Về trang chủ
          </Link>
          
          <div className="text-sm text-gray-500">
            Hoặc{' '}
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              khám phá khóa học
            </Link>
            {' '}để bắt đầu học tập
          </div>
        </div>
        
        <div className="mt-12">
          <div className="text-xs text-gray-400">
            Mã lỗi: 404 | Thời gian: {new Date().toLocaleString('vi-VN')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
