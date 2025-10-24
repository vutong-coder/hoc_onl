# 📚 Hướng Dẫn Sử Dụng - Trang Quản Lý Bài Thi

## 🎯 Tổng Quan
Trang **Quản lý Bài thi** cho phép admin quản lý đề thi, sinh đề ngẫu nhiên, và theo dõi kết quả thi.

## 🚀 Truy Cập
```
URL: /admin/exams
Component: src/admin/pages/ExamsPage.tsx
```

## 📋 Các Chức Năng

### 1. ⭐ Sinh Đề Thi Ngẫu Nhiên

#### Cách Sử Dụng:
1. Click nút **"Sinh đề ngẫu nhiên"** (icon 🔀 Shuffle)
2. Modal mở ra với form cấu hình
3. Điền thông tin:
   - **Môn học**: Chọn từ dropdown (10 môn)
   - **Tổng số câu hỏi**: Nhập số (1-100)
   - **Thời gian (phút)**: Nhập số (1-300)
   - **Độ khó**: Chọn 1 trong 4 options

#### Options Độ Khó:

##### A. Trộn lẫn (Mixed) - Auto
- Hệ thống tự động phân bổ:
  - 40% câu dễ
  - 40% câu trung bình
  - 20% câu khó
- Ví dụ: 30 câu → 12 dễ + 12 TB + 6 khó

##### B. Trộn lẫn (Mixed) - Custom
1. Check ✓ "Tùy chỉnh phân bổ độ khó"
2. Form mở rộng với 3 ô nhập:
   - Số câu dễ
   - Số câu trung bình
   - Số câu khó
3. **Validation**: Tổng phải bằng số câu đã chọn
4. Alert màu đỏ nếu sai
5. Nút "Sinh đề thi" disabled nếu invalid

##### C. Chỉ câu Dễ / Trung bình / Khó
- Tất cả câu hỏi đều cùng độ khó

#### Kết Quả:
- Đề thi mới xuất hiện **đầu tiên** trong danh sách
- Trạng thái: **Draft** (Nháp)
- Tiêu đề: "Đề thi [Môn học] - [Ngày tạo]"
- Tổng điểm tự động tính từ câu hỏi
- Người tạo: "Hệ thống"

### 2. 🔍 Tìm Kiếm

**Thanh search phía trên:**
- Tìm theo: Tiêu đề, Môn học, Mô tả, Người tạo
- Real-time filtering
- Case-insensitive

**Ví dụ:**
```
Search: "giữa kỳ" → Tìm tất cả đề thi giữa kỳ
Search: "web" → Tìm đề thi môn Lập trình Web
```

### 3. 🎛️ Bộ Lọc (Filters)

**4 filters có thể kết hợp:**

#### A. Môn học
- Dropdown dynamic (lấy từ dữ liệu thực tế)
- Options: Tất cả môn học, Lập trình Web, Cơ sở dữ liệu, ...

#### B. Loại bài thi
- Luyện tập (Practice)
- Kiểm tra (Quiz)
- Giữa kỳ (Midterm)
- Cuối kỳ (Final)
- Bài tập (Assignment)

#### C. Độ khó
- Dễ (Easy)
- Trung bình (Medium)
- Khó (Hard)

#### D. Trạng thái
- Nháp (Draft)
- Đã xuất bản (Published)
- Đang diễn ra (Ongoing)
- Đã kết thúc (Ended)
- Lưu trữ (Archived)

**Box "Kết quả":**
- Hiển thị số đề thi tìm thấy
- Cập nhật real-time

### 4. 📊 Sắp Xếp (Sort)

**Click vào tiêu đề cột để sort:**
- Tiêu đề (A-Z)
- Loại
- Số câu hỏi (tăng/giảm)
- Thời gian (tăng/giảm)
- Tổng điểm (tăng/giảm)
- Độ khó
- Trạng thái
- Ngày tạo (mới/cũ)

**Icons:**
- ↑ Ascending (tăng dần)
- ↓ Descending (giảm dần)

**Toggle:**
- Click 1 lần: Sort ascending
- Click 2 lần: Sort descending
- Click cột khác: Sort cột mới

### 5. 📄 Phân Trang

**Tự động khi > 10 đề thi:**
- Hiển thị 10 items/page
- Navigation: ◄◄ ◄ 1 2 3 ► ►►
- Info: "Hiển thị 1-10 của 25"

### 6. 👁️ Xem Chi Tiết

**Click nút 👁️ Eye:**

Modal hiển thị:

#### Thông Tin Cơ Bản:
- Tiêu đề + Mô tả
- Môn học
- Loại bài thi

#### Cấu Hình Đề Thi:
- Số câu hỏi
- Thời gian (phút)
- Tổng điểm
- Điểm đạt (passing score)
- Độ khó
- Trạng thái
- Số lần thi tối đa
- Người tạo

#### Cài Đặt:
- ✓ Xem lại câu hỏi: Có/Không
- ✓ Trộn câu hỏi: Có/Không
- ✓ Hiển thị kết quả: Có/Không

### 7. 📋 Sao Chép Đề Thi

**Click nút 📋 Copy:**
- Tạo bản sao với:
  - Tiêu đề: "[Tên cũ] (Bản sao)"
  - Trạng thái: Draft
  - Ngày tạo: Hiện tại
  - Tất cả thông tin khác: Giống gốc
- Xuất hiện đầu danh sách

**Use case:**
```
Có đề thi "Thi giữa kỳ - Web" (Published)
→ Sao chép
→ "Thi giữa kỳ - Web (Bản sao)" (Draft)
→ Chỉnh sửa rồi publish
```

### 8. ✏️ Chỉnh Sửa

**Click nút ✏️ Edit:**
- Hiện tại: Alert placeholder
- Sẽ implement: Form edit đầy đủ

**Restrictions:**
- **Disabled** khi:
  - Status = Ongoing (Đang diễn ra)
  - Status = Ended (Đã kết thúc)
- Lý do: Không thể sửa đề đang/đã thi

### 9. 🗑️ Xóa Đề Thi

**Click nút 🗑️ Delete:**
1. Modal confirm xuất hiện
2. Hiển thị: "Bạn có chắc chắn muốn xóa đề thi [Tên]?"
3. Warning: "Hành động này không thể hoàn tác."
4. Options:
   - **Hủy**: Đóng modal
   - **Xóa**: Xóa vĩnh viễn

**Restrictions:**
- **Disabled** khi Status = Ongoing
- Lý do: Không thể xóa đề đang thi

### 10. 📥 Nhập/📤 Xuất Excel

**2 nút phụ:**
- **Nhập đề thi** (Upload): Placeholder
- **Xuất Excel** (Download): Placeholder

*Sẽ implement tương tự UsersPage*

### 11. ➕ Thêm Đề Thi

**Nút chính:**
- **Thêm đề thi** (Plus): Placeholder
- Sẽ mở modal form tạo đề thủ công

## 🎨 UI Elements

### Badges Màu Sắc

#### Loại Bài Thi:
- 🔴 **Cuối kỳ** (Final): Đỏ
- 🟡 **Giữa kỳ** (Midterm): Vàng
- 🔵 **Kiểm tra** (Quiz): Xanh dương
- 🟢 **Bài tập** (Assignment): Xanh lá
- ⚪ **Luyện tập** (Practice): Xám

#### Độ Khó:
- 🟢 **Dễ**: Xanh lá
- 🟡 **Trung bình**: Vàng
- 🔴 **Khó**: Đỏ

#### Trạng Thái:
- 🟢 **Đã xuất bản**: Xanh lá
- 🔵 **Đang diễn ra**: Xanh dương
- ⚪ **Nháp**: Xám
- 🟡 **Đã kết thúc**: Vàng
- ⚪ **Lưu trữ**: Xám

### Icons

**Trong Table:**
- 📄 FileText: Số câu hỏi
- ⏱️ Clock: Thời gian
- 🏆 Award: Tổng điểm

**Actions:**
- 👁️ Eye: Xem chi tiết
- 📋 Copy: Sao chép
- ✏️ Edit: Chỉnh sửa
- 🗑️ Trash: Xóa

**Buttons:**
- 🔀 Shuffle: Sinh đề ngẫu nhiên
- ⬆️ Upload: Nhập đề thi
- ⬇️ Download: Xuất Excel
- ➕ Plus: Thêm đề thi

## 📊 Dữ Liệu Mock

### Exams: 10 đề thi mẫu
- Đa dạng môn học (10 môn)
- Đầy đủ 5 loại: Practice, Quiz, Midterm, Final, Assignment
- Đầy đủ 3 độ khó: Easy, Medium, Hard
- Đầy đủ 5 trạng thái: Draft, Published, Ongoing, Ended, Archived

### Questions: 10 câu hỏi mẫu
- Multiple-choice, Essay
- Đa dạng môn học
- Đa dạng độ khó
- Điểm khác nhau (2-5 điểm)

**Note:** Trong production, cần nhiều câu hỏi hơn để sinh đề đa dạng.

## 🔥 Use Cases

### Use Case 1: Sinh Đề Nhanh Cho Luyện Tập
```
1. Click "Sinh đề ngẫu nhiên"
2. Môn: Lập trình Web
3. Số câu: 20
4. Thời gian: 30 phút
5. Độ khó: Chỉ câu dễ
6. Click "Sinh đề thi"
→ Có ngay đề luyện tập 20 câu dễ
```

### Use Case 2: Sinh Đề Thi Chính Thức
```
1. Click "Sinh đề ngẫu nhiên"
2. Môn: Cơ sở dữ liệu
3. Số câu: 50
4. Thời gian: 90 phút
5. Độ khó: Trộn lẫn
6. Check "Tùy chỉnh phân bổ"
7. Dễ: 10, TB: 25, Khó: 15
8. Click "Sinh đề thi"
→ Đề thi cân bằng độ khó
9. Click Edit để tinh chỉnh
10. Publish để sử dụng
```

### Use Case 3: Tìm Và Sao Chép Đề Cũ
```
1. Filter: Môn "Thuật toán"
2. Filter: Loại "Giữa kỳ"
3. Filter: Trạng thái "Ended"
→ Tìm thấy đề thi kỳ trước
4. Click Copy
5. Edit đề mới
6. Publish cho kỳ này
```

### Use Case 4: Quản Lý Đề Đang Thi
```
1. Filter: Trạng thái "Ongoing"
→ Xem tất cả đề đang thi
2. Click View để xem chi tiết
3. Edit/Delete bị disabled (đúng)
→ Đảm bảo integrity
```

## 🛠️ Tips & Tricks

### 1. Sinh Đề Balanced
- Dùng Mixed với Custom distribution
- Tỷ lệ đề xuất: 30% Dễ, 50% TB, 20% Khó

### 2. Tìm Kiếm Nhanh
- Gõ từ khóa trong search
- Không cần chọn filter nếu search đủ specific

### 3. Sao Chép Thay Vì Tạo Mới
- Đề tương tự → Copy và edit
- Nhanh hơn tạo từ đầu

### 4. Check Draft Trước Khi Publish
- Xem chi tiết để review
- Đảm bảo cấu hình đúng

### 5. Kết Hợp Filters
- Môn + Loại + Độ khó
- Tìm chính xác đề cần

## ⚠️ Lưu Ý

### Validation Sinh Đề:
- ✅ Tổng câu phải = phân bổ (custom mode)
- ✅ Nút disabled nếu invalid
- ✅ Alert màu đỏ chỉ rõ lỗi

### Restrictions:
- ❌ Không edit đề đang/đã thi
- ❌ Không xóa đề đang thi
- ✅ Chỉ edit/xóa Draft hoặc Published (chưa bắt đầu)

### Performance:
- Phân trang tự động (10 items/page)
- Filters + Search hoạt động client-side (nhanh)

### Responsive:
- Desktop: Full features
- Tablet: Grid layout adjust
- Mobile: Stack layout

## 🚧 Upcoming Features

1. **Form Thêm/Edit Đề Thủ Công**
   - Rich text editor cho câu hỏi
   - Upload hình ảnh
   - Drag & drop reorder

2. **Import/Export Excel**
   - Template chuẩn
   - Bulk import câu hỏi
   - Export kèm statistics

3. **Thống Kê & Analytics**
   - Số lần thi
   - Điểm trung bình
   - Tỷ lệ đạt
   - Câu hỏi khó nhất

4. **Question Bank Management**
   - Quản lý riêng ngân hàng câu hỏi
   - Tag & Category
   - Search advanced

5. **Preview Mode**
   - Xem trước đề thi như học viên
   - Test luồng thi

---

**Happy Exam Managing! 🎓**

