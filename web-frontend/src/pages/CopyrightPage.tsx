import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Upload, 
  FileText, 
  Search, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import CopyrightUploadModal from '../components/molecules/CopyrightUploadModal';
import CopyrightDocumentsList from '../components/molecules/CopyrightDocumentsList';
import { useCopyright } from '../hooks/useCopyright';
import { DocumentCopyright, CopyrightStats } from '../types/copyright';
import styles from '../assets/css/CopyrightPage.module.css';

export default function CopyrightPage(): JSX.Element {
  const { 
    isConnected, 
    currentAddress, 
    getStatistics,
    isLoading 
  } = useCopyright();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentCopyright | null>(null);
  const [stats, setStats] = useState<CopyrightStats | null>(null);
  const [activeTab, setActiveTab] = useState<'my-documents' | 'all-documents' | 'analytics'>('my-documents');
  const [searchAddress, setSearchAddress] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Load statistics when component mounts
  useEffect(() => {
    if (isConnected) {
      loadStatistics();
    }
  }, [isConnected, getStatistics]);

  const loadStatistics = async () => {
    try {
      const statsData = await getStatistics();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleUploadSuccess = (documentHash: string, transactionHash: string) => {
    console.log('Document registered successfully:', { documentHash, transactionHash });
    setShowUploadModal(false);
    // Refresh statistics
    loadStatistics();
  };

  const handleDocumentSelect = (document: DocumentCopyright) => {
    setSelectedDocument(document);
  };

  const handleSearchAddress = () => {
    if (searchAddress.trim()) {
      // Navigate to search results or show documents for specific address
      console.log('Searching for address:', searchAddress);
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('vi-VN');
  };

  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - (timestamp * 1000);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
    return `${Math.floor(days / 365)} năm trước`;
  };

  return (
    <div className={styles.copyrightPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <div className={styles.iconContainer}>
              <Shield size={32} />
            </div>
            <div>
              <h1>Bảo vệ bản quyền tài liệu</h1>
              <p>Đăng ký và quản lý bản quyền tài liệu học thuật trên blockchain</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {isConnected ? (
              <>
                <button 
                  className={styles.uploadButton}
                  onClick={() => setShowUploadModal(true)}
                >
                  <Plus size={20} />
                  Đăng ký tài liệu
                </button>
                <button 
                  className={styles.searchButton}
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search size={20} />
                  Tìm kiếm
                </button>
              </>
            ) : (
              <div className={styles.notConnected}>
                <AlertCircle size={20} />
                <span>Chưa kết nối ví MetaMask</span>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className={styles.searchBar}>
            <div className={styles.searchInput}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Nhập địa chỉ ví để tìm kiếm tài liệu..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchAddress()}
              />
              <button onClick={handleSearchAddress}>Tìm kiếm</button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileText size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.totalDocuments}</h3>
              <p>Tổng tài liệu</p>
              <span className={styles.statChange}>+12% tháng này</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.totalVerified}</h3>
              <p>Tài liệu đã xác minh</p>
              <span className={styles.statChange}>+8% tháng này</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.totalOwners}</h3>
              <p>Tác giả đăng ký</p>
              <span className={styles.statChange}>+5% tháng này</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BarChart3 size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.contractBalance}</h3>
              <p>ETH trong hợp đồng</p>
              <span className={styles.statChange}>Phí đăng ký</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.navigation}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'my-documents' ? styles.active : ''}`}
            onClick={() => setActiveTab('my-documents')}
          >
            <FileText size={16} />
            Tài liệu của tôi
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'all-documents' ? styles.active : ''}`}
            onClick={() => setActiveTab('all-documents')}
          >
            <Search size={16} />
            Tất cả tài liệu
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} />
            Thống kê
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'my-documents' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Tài liệu của tôi</h2>
              <p>Quản lý các tài liệu đã đăng ký bản quyền</p>
            </div>
            <CopyrightDocumentsList 
              address={currentAddress || undefined}
              onDocumentSelect={handleDocumentSelect}
            />
          </div>
        )}

        {activeTab === 'all-documents' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Tất cả tài liệu</h2>
              <p>Khám phá tài liệu đã đăng ký bản quyền trên hệ thống</p>
            </div>
            <CopyrightDocumentsList 
              showFilters={true}
              onDocumentSelect={handleDocumentSelect}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Thống kê hệ thống</h2>
              <p>Phân tích và báo cáo về hoạt động đăng ký bản quyền</p>
            </div>
            
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h3>Phân tích theo loại tài liệu</h3>
                <div className={styles.chartPlaceholder}>
                  <BarChart3 size={48} />
                  <p>Biểu đồ phân bố loại tài liệu</p>
                </div>
              </div>

              <div className={styles.analyticsCard}>
                <h3>Xu hướng đăng ký</h3>
                <div className={styles.chartPlaceholder}>
                  <BarChart3 size={48} />
                  <p>Biểu đồ xu hướng theo thời gian</p>
                </div>
              </div>

              <div className={styles.analyticsCard}>
                <h3>Tác giả tích cực</h3>
                <div className={styles.chartPlaceholder}>
                  <Users size={48} />
                  <p>Top tác giả đăng ký nhiều nhất</p>
                </div>
              </div>

              <div className={styles.analyticsCard}>
                <h3>Tỷ lệ xác minh</h3>
                <div className={styles.verificationStats}>
                  <div className={styles.verificationItem}>
                    <CheckCircle size={20} />
                    <span>Đã xác minh: {stats?.totalVerified || 0}</span>
                  </div>
                  <div className={styles.verificationItem}>
                    <Clock size={20} />
                    <span>Chờ xác minh: {(stats?.totalDocuments || 0) - (stats?.totalVerified || 0)}</span>
                  </div>
                  <div className={styles.verificationRate}>
                    Tỷ lệ: {stats ? ((stats.totalVerified / stats.totalDocuments) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <CopyrightUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className={styles.documentModal}>
          <div className={styles.modalOverlay} onClick={() => setSelectedDocument(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{selectedDocument.title}</h2>
                <button onClick={() => setSelectedDocument(null)}>×</button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.documentInfo}>
                  <div className={styles.infoRow}>
                    <label>Hash:</label>
                    <span className={styles.hash}>{selectedDocument.documentHash}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <label>Tác giả:</label>
                    <span>{selectedDocument.owner}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <label>Loại:</label>
                    <span>{selectedDocument.category}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <label>Đăng ký:</label>
                    <span>{formatDate(selectedDocument.timestamp)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <label>Trạng thái:</label>
                    <span className={selectedDocument.isVerified ? styles.verified : styles.pending}>
                      {selectedDocument.isVerified ? 'Đã xác minh' : 'Chờ xác minh'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.documentDescription}>
                  <h3>Mô tả</h3>
                  <p>{selectedDocument.description}</p>
                </div>

                {selectedDocument.tags.length > 0 && (
                  <div className={styles.documentTags}>
                    <h3>Tags</h3>
                    <div className={styles.tagsList}>
                      {selectedDocument.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
