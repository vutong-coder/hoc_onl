import React from 'react';
import { PaginationProps } from '../../types/leaderboard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../assets/css/Pagination.module.css';

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  totalItems
}: PaginationProps): JSX.Element {

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    onItemsPerPageChange(newItemsPerPage);
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first few pages
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
      // Show middle pages
      else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      }
      // Show current page in middle
      else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={styles.paginationContainer}>
      {/* Page Navigation */}
      <div className={styles.paginationControls}>
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.paginationButton} ${styles.navButton}`}
        >
          <ChevronLeft style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(page as number)}
                className={`${styles.paginationButton} ${currentPage === page ? styles.active : ''}`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${styles.paginationButton} ${styles.navButton}`}
        >
          <ChevronRight style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Items per page selector */}
      <div className={styles.itemsPerPageContainer}>
        <span className={styles.itemsPerPageLabel}>Hiển thị:</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className={styles.itemsPerPageSelect}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className={styles.totalItemsText}>
          / {totalItems} tổng
        </span>
      </div>
    </div>
  );
}
