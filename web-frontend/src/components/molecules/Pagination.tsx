import React from 'react';
import { PaginationProps } from '../../types/leaderboard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '2px solid var(--border)',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Page Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '10px 14px',
            background: currentPage === 1 ? 'var(--muted)' : 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: currentPage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: currentPage === 1 ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary-foreground)';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = 'var(--card)';
              e.currentTarget.style.color = 'var(--foreground)';
              e.currentTarget.style.transform = 'translateX(0)';
            }
          }}
        >
          <ChevronLeft style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span style={{
                padding: '10px 14px',
                color: 'var(--muted-foreground)',
                fontSize: '14px',
                fontWeight: 600
              }}>
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(page as number)}
                style={{
                  padding: '10px 14px',
                  background: currentPage === page
                    ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                    : 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: currentPage === page ? 'var(--primary-foreground)' : 'var(--foreground)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: currentPage === page ? 700 : 500,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: '44px',
                  boxShadow: currentPage === page
                    ? '0 4px 6px rgba(0,0,0,0.1)'
                    : '0 1px 3px rgba(0,0,0,0.1)',
                  transform: currentPage === page ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = 'var(--muted)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = 'var(--card)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
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
          style={{
            padding: '10px 14px',
            background: currentPage === totalPages ? 'var(--muted)' : 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: currentPage === totalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: currentPage === totalPages ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary-foreground)';
              e.currentTarget.style.transform = 'translateX(2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = 'var(--card)';
              e.currentTarget.style.color = 'var(--foreground)';
              e.currentTarget.style.transform = 'translateX(0)';
            }
          }}
        >
          <ChevronRight style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Items per page selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        color: 'var(--muted-foreground)'
      }}>
        <span style={{ fontWeight: 500 }}>Hiển thị:</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          style={{
            padding: '8px 16px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--foreground)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span style={{ color: 'var(--muted-foreground)', fontSize: '13px' }}>
          / {totalItems} tổng
        </span>
      </div>
    </div>
  );
}
