# 🛡️ Hệ thống bảo vệ bản quyền tài liệu học thuật

> Hệ thống đăng ký và bảo vệ bản quyền tài liệu học thuật sử dụng blockchain Ethereum

## 📋 Tổng quan

Hệ thống bảo vệ bản quyền tài liệu học thuật được xây dựng để giải quyết các vấn đề về đạo văn và bảo vệ quyền sở hữu trí tuệ trong lĩnh vực giáo dục. Hệ thống sử dụng công nghệ blockchain để lưu trữ hash của tài liệu, tạo ra bằng chứng không thể chối cãi về thời điểm công bố và quyền sở hữu.

### ✨ Tính năng chính

- **🔐 Bảo vệ bản quyền**: Đăng ký hash tài liệu trên blockchain Ethereum
- **📄 Hỗ trợ đa định dạng**: PDF, DOC, DOCX, TXT, MD, RTF
- **🔍 Tìm kiếm thông minh**: Tìm kiếm theo hash, tiêu đề, tags, tác giả
- **✅ Xác minh tài liệu**: Hệ thống xác minh độc lập
- **📊 Thống kê chi tiết**: Phân tích hoạt động đăng ký bản quyền
- **🔗 Tích hợp IPFS**: Lưu trữ file phân tán
- **💳 Thanh toán gas**: Tự động tính toán phí giao dịch

## 🏗️ Kiến trúc hệ thống

### Smart Contract
- **CopyrightRegistry.sol**: Hợp đồng chính lưu trữ hash tài liệu
- **Chức năng**: Đăng ký, xác minh, tìm kiếm, quản lý tài liệu
- **Bảo mật**: Access control, Pausable, ReentrancyGuard

### Frontend Components
- **CopyrightPage**: Trang chính quản lý bản quyền
- **CopyrightUploadModal**: Modal đăng ký tài liệu mới
- **CopyrightDocumentsList**: Danh sách tài liệu đã đăng ký
- **useCopyright**: Hook quản lý trạng thái và tương tác blockchain

### Backend Services
- **copyrightService**: Service tương tác với blockchain
- **copyrightApi**: API endpoints cho backend
- **Hash calculation**: Tính toán SHA-256 hash

## 🚀 Cài đặt và triển khai

### 1. Deploy Smart Contract

```bash
# Di chuyển vào thư mục contracts
cd contracts

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Cấu hình .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Deploy contract
npx hardhat run scripts/deployCopyright.js --network sepolia

# Verify contract
npx hardhat run scripts/verifyCopyright.js --network sepolia -- <CONTRACT_ADDRESS>

# Test contract
npx hardhat run scripts/testCopyright.js --network sepolia -- <CONTRACT_ADDRESS>
```

### 2. Cấu hình Frontend

```bash
# Thêm contract address vào .env
echo "VITE_COPYRIGHT_REGISTRY_ADDRESS=0xYourContractAddress" >> .env

# Restart dev server
npm run dev
```

### 3. Cấu hình Backend API

```bash
# Thêm environment variables
COPYRIGHT_CONTRACT_ADDRESS=0xYourContractAddress
COPYRIGHT_CONTRACT_ABI=path/to/abi.json
IPFS_GATEWAY=https://ipfs.io/ipfs/
ETHEREUM_NETWORK=sepolia
```

## 📖 Hướng dẫn sử dụng

### Đăng ký bản quyền tài liệu

1. **Kết nối ví MetaMask**
   - Mở trang Bản quyền
   - Nhấn "Kết nối ví" để kết nối MetaMask
   - Xác nhận kết nối trong MetaMask

2. **Upload tài liệu**
   - Nhấn "Đăng ký tài liệu"
   - Chọn loại upload: File hoặc văn bản
   - Chọn file (PDF, DOC, DOCX, TXT, MD, RTF) hoặc nhập nội dung
   - Điền thông tin metadata:
     - Tiêu đề tài liệu
     - Mô tả
     - Loại tài liệu
     - Tags
     - Tác giả (tùy chọn)
     - Tổ chức (tùy chọn)

3. **Thanh toán phí**
   - Hệ thống sẽ tính toán phí đăng ký
   - Xác nhận giao dịch trong MetaMask
   - Chờ giao dịch được xác nhận

4. **Xác minh đăng ký**
   - Sau khi giao dịch thành công, tài liệu sẽ được đăng ký
   - Nhận được hash tài liệu và transaction hash
   - Có thể xác minh tài liệu để tăng độ tin cậy

### Quản lý tài liệu

1. **Xem danh sách tài liệu**
   - Tab "Tài liệu của tôi": Xem tài liệu đã đăng ký
   - Tab "Tất cả tài liệu": Khám phá tài liệu công khai
   - Sử dụng bộ lọc để tìm kiếm theo loại, trạng thái

2. **Tìm kiếm tài liệu**
   - Sử dụng thanh tìm kiếm để tìm theo tiêu đề, mô tả, tags
   - Lọc theo loại tài liệu
   - Sắp xếp theo thời gian, tiêu đề, loại

3. **Quản lý tài liệu**
   - Cập nhật thông tin tài liệu
   - Thêm/sửa tags
   - Xác minh tài liệu
   - Vô hiệu hóa tài liệu (nếu cần)

### Xem thống kê

1. **Thống kê tổng quan**
   - Tổng số tài liệu đã đăng ký
   - Số tài liệu đã xác minh
   - Số tác giả tham gia
   - Số dư hợp đồng

2. **Phân tích chi tiết**
   - Phân bố theo loại tài liệu
   - Xu hướng đăng ký theo thời gian
   - Top tác giả tích cực
   - Tỷ lệ xác minh

## 🔧 API Documentation

### Endpoints chính

#### 1. Đăng ký tài liệu

```typescript
POST /api/copyright/register
Content-Type: multipart/form-data

Body:
- file: File (tài liệu cần đăng ký)
- metadata: DocumentMetadata (JSON string)

Response:
{
  "success": boolean,
  "data": {
    "documentHash": string,
    "transactionHash": string
  }
}
```

#### 2. Đăng ký văn bản

```typescript
POST /api/copyright/register-text
Content-Type: application/json

Body:
{
  "content": string,
  "metadata": DocumentMetadata
}

Response:
{
  "success": boolean,
  "data": {
    "documentHash": string,
    "transactionHash": string
  }
}
```

#### 3. Xác minh tài liệu

```typescript
POST /api/copyright/verify/{documentHash}
Content-Type: application/json

Response:
{
  "success": boolean,
  "data": {
    "transactionHash": string
  }
}
```

#### 4. Lấy thông tin tài liệu

```typescript
GET /api/copyright/document/{documentHash}

Response:
{
  "success": boolean,
  "data": DocumentCopyright
}
```

#### 5. Tìm kiếm tài liệu

```typescript
POST /api/copyright/search
Content-Type: application/json

Body:
{
  "filters": CopyrightSearchFilters,
  "page": number,
  "limit": number
}

Response:
{
  "success": boolean,
  "data": CopyrightSearchResult
}
```

#### 6. Lấy thống kê

```typescript
GET /api/copyright/statistics

Response:
{
  "success": boolean,
  "data": CopyrightStats
}
```

### Types định nghĩa

```typescript
interface DocumentMetadata {
  title: string;
  description: string;
  category: 'thesis' | 'research' | 'paper' | 'report' | 'presentation' | 'coursework' | 'assignment' | 'other';
  fileExtension: string;
  fileSize: number;
  tags: string[];
  ipfsHash?: string;
  authorName?: string;
  institution?: string;
  keywords?: string[];
  abstract?: string;
}

interface DocumentCopyright {
  documentHash: string;
  owner: string;
  title: string;
  description: string;
  category: string;
  fileExtension: string;
  fileSize: number;
  timestamp: number;
  isVerified: boolean;
  isActive: boolean;
  ipfsHash: string;
  tags: string[];
}

interface CopyrightStats {
  totalDocuments: number;
  totalVerified: number;
  totalOwners: number;
  contractBalance: string;
  registrationFee: string;
  verificationFee: string;
}
```

## 💰 Chi phí và phí giao dịch

### Phí đăng ký
- **Phí cơ bản**: 0.001 ETH (có thể điều chỉnh)
- **Phí gas**: Tùy thuộc vào tình trạng mạng Ethereum
- **Tổng chi phí**: Phí đăng ký + Gas fee

### Phí xác minh
- **Phí cơ bản**: 0.002 ETH (có thể điều chỉnh)
- **Phí gas**: Tùy thuộc vào tình trạng mạng
- **Lợi ích**: Tăng độ tin cậy và khả năng tìm kiếm

### Ước tính chi phí
- **Sepolia Testnet**: ~0.001-0.005 ETH per transaction
- **Ethereum Mainnet**: ~0.01-0.05 ETH per transaction (tùy gas price)

## 🔒 Bảo mật và quyền riêng tư

### Bảo mật
- **Hash SHA-256**: Tài liệu được hash để bảo mật nội dung
- **Không lưu nội dung**: Chỉ lưu hash, không lưu nội dung tài liệu
- **Access Control**: Chỉ owner mới có thể cập nhật tài liệu
- **Pausable**: Contract có thể tạm dừng trong trường hợp khẩn cấp

### Quyền riêng tư
- **Thông tin công khai**: Hash, owner, metadata
- **Thông tin riêng tư**: Nội dung tài liệu không được lưu trữ
- **IPFS**: Tùy chọn lưu trữ phân tán với quyền kiểm soát

## 🚨 Xử lý lỗi thường gặp

### 1. Lỗi kết nối ví
```
Lỗi: "MetaMask not detected"
Giải pháp: 
- Cài đặt MetaMask extension
- Đảm bảo MetaMask đã unlock
- Kiểm tra network (Sepolia cho testnet)
```

### 2. Lỗi giao dịch thất bại
```
Lỗi: "Transaction failed"
Giải pháp:
- Kiểm tra số dư ETH
- Tăng gas limit
- Đợi network ổn định
```

### 3. Lỗi file không hỗ trợ
```
Lỗi: "File format not supported"
Giải pháp:
- Chỉ upload file: PDF, DOC, DOCX, TXT, MD, RTF
- Kiểm tra kích thước file (< 100MB)
```

### 4. Lỗi hash không khớp
```
Lỗi: "Hash verification failed"
Giải pháp:
- Đảm bảo file không bị thay đổi
- Upload lại file gốc
- Kiểm tra encoding
```

## 📈 Roadmap và phát triển

### Phiên bản hiện tại (v1.0)
- ✅ Đăng ký bản quyền cơ bản
- ✅ Xác minh tài liệu
- ✅ Tìm kiếm và lọc
- ✅ Thống kê cơ bản
- ✅ Tích hợp MetaMask

### Phiên bản tương lai (v1.1)
- 🔄 Tích hợp IPFS hoàn chỉnh
- 🔄 Hệ thống đánh giá tài liệu
- 🔄 API webhook cho notifications
- 🔄 Batch upload nhiều tài liệu
- 🔄 Advanced analytics

### Phiên bản tương lai (v2.0)
- 🔄 Multi-chain support (Polygon, BSC)
- 🔄 NFT certificates
- 🔄 AI plagiarism detection
- 🔄 Integration với academic databases
- 🔄 Mobile app

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp để cải thiện hệ thống:

1. **Fork repository**
2. **Tạo feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Tạo Pull Request**

### Guidelines
- Tuân thủ coding standards
- Viết tests cho code mới
- Cập nhật documentation
- Mô tả rõ ràng về thay đổi

## 📞 Hỗ trợ

### Liên hệ
- **Email**: support@copyright-system.com
- **Discord**: https://discord.gg/copyright-system
- **GitHub Issues**: https://github.com/your-repo/issues

### Tài liệu tham khảo
- [Ethereum Documentation](https://ethereum.org/docs/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [IPFS Documentation](https://docs.ipfs.io/)

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

**⚠️ Lưu ý quan trọng**: Hệ thống này đang trong giai đoạn phát triển. Vui lòng test kỹ lưỡng trên testnet trước khi sử dụng trên mainnet. Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất nào có thể xảy ra.
