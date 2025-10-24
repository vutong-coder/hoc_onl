import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';
import { useCopyright } from '../../hooks/useCopyright';
import { DocumentMetadata, DocumentCategory, COPYRIGHT_CONSTANTS } from '../../types/copyright';
import styles from '../../assets/css/CopyrightUploadModal.module.css';

interface CopyrightUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (documentHash: string, transactionHash: string) => void;
}

export default function CopyrightUploadModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CopyrightUploadModalProps): JSX.Element {
  const { 
    isConnected, 
    connectWallet, 
    registerFileDocument, 
    registerTextDocument,
    getRegistrationFee,
    isLoading,
    error 
  } = useCopyright();

  const [uploadType, setUploadType] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    title: '',
    description: '',
    category: 'other',
    fileExtension: '',
    fileSize: 0,
    tags: [],
    authorName: '',
    institution: '',
    keywords: [],
    abstract: ''
  });
  const [registrationFee, setRegistrationFee] = useState('0');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    documentHash?: string;
    transactionHash?: string;
    error?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTag, setNewTag] = useState('');

  // Load registration fee when modal opens
  React.useEffect(() => {
    if (isOpen) {
      loadRegistrationFee();
    }
  }, [isOpen, getRegistrationFee]);

  const loadRegistrationFee = async () => {
    try {
      const fee = await getRegistrationFee();
      setRegistrationFee(fee);
    } catch (err) {
      console.error('Failed to load registration fee:', err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      if (file.size > COPYRIGHT_CONSTANTS.MAX_FILE_SIZE) {
        alert(`File quá lớn. Kích thước tối đa: ${COPYRIGHT_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
        return;
      }

      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!COPYRIGHT_CONSTANTS.ALLOWED_EXTENSIONS.includes(extension)) {
        alert(`Định dạng file không được hỗ trợ. Các định dạng được hỗ trợ: ${COPYRIGHT_CONSTANTS.ALLOWED_EXTENSIONS.join(', ')}`);
        return;
      }

      setSelectedFile(file);
      setMetadata(prev => ({
        ...prev,
        fileExtension: extension,
        fileSize: file.size,
        title: file.name.replace(/\.[^/.]+$/, '') // Remove extension from title
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && metadata.tags.length < COPYRIGHT_CONSTANTS.MAX_TAGS_COUNT) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleRegister = async () => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    // Validate metadata
    if (!metadata.title.trim()) {
      alert('Vui lòng nhập tiêu đề tài liệu');
      return;
    }

    if (!metadata.description.trim()) {
      alert('Vui lòng nhập mô tả tài liệu');
      return;
    }

    setIsRegistering(true);
    setRegistrationResult(null);

    try {
      let result;
      
      if (uploadType === 'file') {
        if (!selectedFile) {
          alert('Vui lòng chọn file');
          return;
        }
        result = await registerFileDocument(selectedFile, metadata);
      } else {
        if (!textContent.trim()) {
          alert('Vui lòng nhập nội dung văn bản');
          return;
        }
        result = await registerTextDocument(textContent, {
          ...metadata,
          fileExtension: '.txt',
          fileSize: new Blob([textContent]).size
        });
      }

      setRegistrationResult(result);

      if (result.success && result.documentHash && result.transactionHash) {
        onSuccess?.(result.documentHash, result.transactionHash);
        // Reset form after successful registration
        setTimeout(() => {
          resetForm();
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setRegistrationResult({
        success: false,
        error: 'Đăng ký bản quyền thất bại'
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTextContent('');
    setMetadata({
      title: '',
      description: '',
      category: 'other',
      fileExtension: '',
      fileSize: 0,
      tags: [],
      authorName: '',
      institution: '',
      keywords: [],
      abstract: ''
    });
    setRegistrationResult(null);
    setNewTag('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!isRegistering) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return <></>;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Đăng ký bản quyền tài liệu</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            disabled={isRegistering}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Connection Status */}
          {!isConnected && (
            <div className={styles.warning}>
              <AlertCircle size={20} />
              <span>Vui lòng kết nối ví MetaMask để đăng ký bản quyền</span>
              <button 
                className={styles.connectButton}
                onClick={connectWallet}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className={styles.spinner} /> : 'Kết nối ví'}
              </button>
            </div>
          )}

          {/* Registration Fee */}
          <div className={styles.feeInfo}>
            <span>Phí đăng ký: {registrationFee} ETH</span>
          </div>

          {/* Upload Type Selection */}
          <div className={styles.uploadTypeSection}>
            <label>Loại tài liệu:</label>
            <div className={styles.uploadTypeButtons}>
              <button
                className={`${styles.uploadTypeButton} ${uploadType === 'file' ? styles.active : ''}`}
                onClick={() => setUploadType('file')}
              >
                <FileText size={16} />
                Upload File
              </button>
              <button
                className={`${styles.uploadTypeButton} ${uploadType === 'text' ? styles.active : ''}`}
                onClick={() => setUploadType('text')}
              >
                <FileText size={16} />
                Nhập văn bản
              </button>
            </div>
          </div>

          {/* File Upload */}
          {uploadType === 'file' && (
            <div className={styles.fileUploadSection}>
              <label>Chọn file tài liệu:</label>
              <div 
                className={styles.fileDropZone}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className={styles.selectedFile}>
                    <FileText size={24} />
                    <div>
                      <p>{selectedFile.name}</p>
                      <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setMetadata(prev => ({ ...prev, fileExtension: '', fileSize: 0 }));
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.dropZoneContent}>
                    <Upload size={32} />
                    <p>Nhấp để chọn file hoặc kéo thả file vào đây</p>
                    <p className={styles.supportedFormats}>
                      Định dạng hỗ trợ: {COPYRIGHT_CONSTANTS.ALLOWED_EXTENSIONS.join(', ')}
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={COPYRIGHT_CONSTANTS.ALLOWED_EXTENSIONS.join(',')}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* Text Input */}
          {uploadType === 'text' && (
            <div className={styles.textInputSection}>
              <label>Nội dung văn bản:</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Nhập nội dung tài liệu cần đăng ký bản quyền..."
                rows={10}
                maxLength={COPYRIGHT_CONSTANTS.MAX_DESCRIPTION_LENGTH * 10}
              />
              <div className={styles.characterCount}>
                {textContent.length} / {COPYRIGHT_CONSTANTS.MAX_DESCRIPTION_LENGTH * 10}
              </div>
            </div>
          )}

          {/* Metadata Form */}
          <div className={styles.metadataSection}>
            <h3>Thông tin tài liệu</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nhập tiêu đề tài liệu"
                  maxLength={COPYRIGHT_CONSTANTS.MAX_TITLE_LENGTH}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Loại tài liệu *</label>
                <select
                  value={metadata.category}
                  onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value as DocumentCategory }))}
                >
                  {COPYRIGHT_CONSTANTS.SUPPORTED_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Mô tả *</label>
              <textarea
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả ngắn gọn về tài liệu"
                rows={3}
                maxLength={COPYRIGHT_CONSTANTS.MAX_DESCRIPTION_LENGTH}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Tác giả</label>
                <input
                  type="text"
                  value={metadata.authorName || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="Tên tác giả"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Tổ chức</label>
                <input
                  type="text"
                  value={metadata.institution || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="Tên tổ chức/trường học"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Tóm tắt</label>
              <textarea
                value={metadata.abstract || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, abstract: e.target.value }))}
                placeholder="Tóm tắt nội dung tài liệu"
                rows={4}
              />
            </div>

            {/* Tags */}
            <div className={styles.formGroup}>
              <label>Tags</label>
              <div className={styles.tagsInput}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nhập tag và nhấn Enter"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  maxLength={COPYRIGHT_CONSTANTS.MAX_TAG_LENGTH}
                />
                <button onClick={handleAddTag} disabled={!newTag.trim()}>
                  Thêm
                </button>
              </div>
              <div className={styles.tagsList}>
                {metadata.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className={styles.error}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Result */}
          {registrationResult && (
            <div className={`${styles.result} ${registrationResult.success ? styles.success : styles.error}`}>
              {registrationResult.success ? (
                <>
                  <CheckCircle size={20} />
                  <div>
                    <p>Đăng ký bản quyền thành công!</p>
                    <p>Hash: {registrationResult.documentHash}</p>
                    <p>Transaction: {registrationResult.transactionHash}</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle size={20} />
                  <div>
                    <p>Đăng ký bản quyền thất bại</p>
                    <p>{registrationResult.error}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button 
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isRegistering}
            >
              Hủy
            </button>
            <button 
              className={styles.registerButton}
              onClick={handleRegister}
              disabled={!isConnected || isRegistering || !metadata.title.trim() || !metadata.description.trim()}
            >
              {isRegistering ? (
                <>
                  <Loader2 className={styles.spinner} />
                  Đang đăng ký...
                </>
              ) : (
                `Đăng ký bản quyền (${registrationFee} ETH)`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
