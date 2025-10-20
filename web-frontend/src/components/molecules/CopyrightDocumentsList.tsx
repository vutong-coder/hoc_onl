import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Clock, 
  User, 
  Tag, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  Calendar,
  Hash,
  ExternalLink
} from 'lucide-react';
import { useCopyright } from '../../hooks/useCopyright';
import { DocumentCopyright, DocumentCategory, COPYRIGHT_CATEGORY_LABELS } from '../../types/copyright';
import styles from '../../assets/css/CopyrightDocumentsList.module.css';

interface CopyrightDocumentsListProps {
  address?: string;
  category?: DocumentCategory;
  showFilters?: boolean;
  onDocumentSelect?: (document: DocumentCopyright) => void;
}

export default function CopyrightDocumentsList({ 
  address, 
  category, 
  showFilters = true,
  onDocumentSelect 
}: CopyrightDocumentsListProps): JSX.Element {
  const { 
    isConnected, 
    currentAddress, 
    getUserDocuments, 
    getCategoryDocuments, 
    getDocument,
    getStatistics,
    isLoading 
  } = useCopyright();

  const [documents, setDocuments] = useState<DocumentCopyright[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentCopyright[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | ''>('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'title' | 'category'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState<{
    totalDocuments: number;
    totalVerified: number;
    totalOwners: number;
  } | null>(null);

  // Load documents when component mounts or dependencies change
  useEffect(() => {
    loadDocuments();
  }, [address, category, isConnected, currentAddress]);

  // Filter and sort documents when documents or filters change
  useEffect(() => {
    filterAndSortDocuments();
  }, [documents, searchTerm, selectedCategory, sortBy, sortOrder]);

  const loadDocuments = async () => {
    if (!isConnected) return;

    setLoading(true);
    setError(null);

    try {
      let documentHashes: string[] = [];

      if (address) {
        // Load documents for specific address
        documentHashes = await getUserDocuments(address);
      } else if (category) {
        // Load documents for specific category
        documentHashes = await getCategoryDocuments(category);
      } else if (currentAddress) {
        // Load current user's documents
        documentHashes = await getUserDocuments(currentAddress);
      }

      // Fetch document details
      const documentPromises = documentHashes.map(async (hash) => {
        try {
          const doc = await getDocument(hash);
          return doc;
        } catch (err) {
          console.error(`Failed to load document ${hash}:`, err);
          return null;
        }
      });

      const documentResults = await Promise.all(documentPromises);
      const validDocuments = documentResults.filter((doc): doc is DocumentCopyright => doc !== null);
      
      setDocuments(validDocuments);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const statsData = await getStatistics();
      if (statsData) {
        setStats({
          totalDocuments: statsData.totalDocuments,
          totalVerified: statsData.totalVerified,
          totalOwners: statsData.totalOwners
        });
      }
    } catch (err) {
      console.error('Failed to load statistics:', err);
    }
  };

  const filterAndSortDocuments = () => {
    let filtered = [...documents];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'timestamp':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredDocuments(filtered);
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDocumentClick = (document: DocumentCopyright) => {
    onDocumentSelect?.(document);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isConnected) {
    return (
      <div className={styles.notConnected}>
        <AlertCircle size={48} />
        <h3>Chưa kết nối ví</h3>
        <p>Vui lòng kết nối ví MetaMask để xem tài liệu đã đăng ký bản quyền</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Tài liệu đã đăng ký bản quyền</h2>
          <p>
            {address ? `Tài liệu của ${address.slice(0, 6)}...${address.slice(-4)}` : 
             category ? `Tài liệu loại ${COPYRIGHT_CATEGORY_LABELS[category]}` :
             'Tài liệu của bạn'}
          </p>
        </div>
        
        {stats && (
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.totalDocuments}</span>
              <span className={styles.statLabel}>Tổng tài liệu</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.totalVerified}</span>
              <span className={styles.statLabel}>Đã xác minh</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.totalOwners}</span>
              <span className={styles.statLabel}>Tác giả</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.searchSection}>
            <div className={styles.searchInput}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, mô tả hoặc tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterGroup}>
              <Filter size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | '')}
              >
                <option value="">Tất cả loại</option>
                {Object.entries(COPYRIGHT_CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <Calendar size={16} />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <option value="timestamp-desc">Mới nhất</option>
                <option value="timestamp-asc">Cũ nhất</option>
                <option value="title-asc">A-Z</option>
                <option value="title-desc">Z-A</option>
                <option value="category-asc">Loại A-Z</option>
                <option value="category-desc">Loại Z-A</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải tài liệu...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={styles.error}>
          <AlertCircle size={24} />
          <p>{error}</p>
          <button onClick={loadDocuments}>Thử lại</button>
        </div>
      )}

      {/* Documents List */}
      {!loading && !error && (
        <div className={styles.documentsList}>
          {filteredDocuments.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={64} />
              <h3>Không có tài liệu</h3>
              <p>
                {searchTerm || selectedCategory ? 
                  'Không tìm thấy tài liệu phù hợp với bộ lọc' :
                  'Chưa có tài liệu nào được đăng ký bản quyền'
                }
              </p>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <div 
                key={document.documentHash} 
                className={styles.documentCard}
                onClick={() => handleDocumentClick(document)}
              >
                <div className={styles.documentHeader}>
                  <div className={styles.documentTitle}>
                    <FileText size={20} />
                    <h3>{document.title}</h3>
                    <span className={`${styles.category} ${styles[document.category]}`}>
                      {COPYRIGHT_CATEGORY_LABELS[document.category as DocumentCategory]}
                    </span>
                  </div>
                  
                  <div className={styles.documentStatus}>
                    {document.isVerified ? (
                      <div className={styles.verified}>
                        <CheckCircle size={16} />
                        <span>Đã xác minh</span>
                      </div>
                    ) : (
                      <div className={styles.pending}>
                        <Clock size={16} />
                        <span>Chờ xác minh</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.documentContent}>
                  <p className={styles.description}>{document.description}</p>
                  
                  {document.tags.length > 0 && (
                    <div className={styles.tags}>
                      {document.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.documentMeta}>
                  <div className={styles.metaItem}>
                    <User size={14} />
                    <span>{document.owner.slice(0, 6)}...{document.owner.slice(-4)}</span>
                  </div>
                  
                  <div className={styles.metaItem}>
                    <Clock size={14} />
                    <span>{formatTimestamp(document.timestamp)}</span>
                  </div>
                  
                  <div className={styles.metaItem}>
                    <span>{document.fileExtension}</span>
                    <span>•</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                </div>

                <div className={styles.documentHash}>
                  <Hash size={14} />
                  <span 
                    className={styles.hashValue}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(document.documentHash);
                    }}
                    title="Click để copy hash"
                  >
                    {document.documentHash.slice(0, 12)}...{document.documentHash.slice(-8)}
                  </span>
                  <ExternalLink size={12} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Load More Button */}
      {filteredDocuments.length > 0 && (
        <div className={styles.loadMore}>
          <button onClick={loadDocuments}>
            Tải thêm tài liệu
          </button>
        </div>
      )}
    </div>
  );
}
