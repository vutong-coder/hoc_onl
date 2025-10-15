# 👥 Trang Quản Lý Người Dùng

## 📁 Cấu Trúc Files

```
admin/
├── components/
│   ├── common/              # Components tái sử dụng
│   │   ├── Table.tsx        # ✅ Bảng chung, có thể dùng cho các trang khác
│   │   ├── Pagination.tsx   # ✅ Component phân trang
│   │   ├── SearchBar.tsx    # ✅ Thanh tìm kiếm
│   │   ├── Badge.tsx        # ✅ Nhãn trạng thái (status, role)
│   │   └── Modal.tsx        # ✅ Popup xác nhận/chỉnh sửa
│   │
│   └── users/               # ✅ Components dành riêng cho User Management
│       ├── UserTable.tsx        # Bảng hiển thị users với columns đã config
│       ├── UserTableRow.tsx     # Một hàng trong bảng user (có avatar, badges)
│       └── UserActions.tsx      # Nút hành động (sửa, xóa, khóa/mở khóa)
│
├── hooks/
│   └── useUsers.ts          # ✅ Hook quản lý logic (filter, sort, pagination)
│
├── pages/
│   └── UsersPage.tsx        # ✅ Trang chính quản lý users
│
├── types/
│   └── user.ts              # ✅ TypeScript interfaces
│
├── mock/
│   └── users.ts             # ✅ Dữ liệu người dùng giả (12 users)
│
└── styles/
    ├── table.css            # ✅ CSS cho Table component
    └── common.css           # ✅ CSS tái sử dụng (search, pagination, badge, modal...)
```

## 🎨 Components Tái Sử Dụng

### 1. Table.tsx
Bảng chung có thể dùng cho bất kỳ data nào:
```tsx
<Table
  columns={[
    { key: 'name', label: 'Tên', sortable: true },
    { key: 'email', label: 'Email' }
  ]}
  data={data}
  onSort={handleSort}
/>
```

### 2. Pagination.tsx
Phân trang tự động:
```tsx
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={setPage}
  totalItems={100}
  itemsPerPage={10}
/>
```

### 3. SearchBar.tsx
Thanh tìm kiếm với icon:
```tsx
<SearchBar
  value={search}
  onChange={setSearch}
  placeholder="Tìm kiếm..."
/>
```

### 4. Badge.tsx
Hiển thị trạng thái với màu sắc:
```tsx
<Badge variant="success">Hoạt động</Badge>
<Badge variant="warning">Không hoạt động</Badge>
<Badge variant="danger">Bị khóa</Badge>
```

### 5. Modal.tsx
Popup với animation:
```tsx
<Modal
  isOpen={true}
  onClose={handleClose}
  title="Xác nhận"
  footer={<button>OK</button>}
>
  <p>Nội dung modal</p>
</Modal>
```

## 🎯 Tính Năng UsersPage

### ✅ Tìm Kiếm
- Tìm theo: tên, email, số điện thoại, phòng ban
- Real-time search
- Reset về trang 1 khi search

### ✅ Lọc (Filters)
- **Vai trò**: Tất cả, Admin, Giảng viên, Học viên, Người dùng
- **Trạng thái**: Tất cả, Hoạt động, Không hoạt động, Bị khóa
- Hiển thị số lượng kết quả

### ✅ Sắp Xếp (Sort)
- Click vào header cột để sort
- Toggle asc/desc
- Hiển thị mũi tên ↑↓
- Sort theo: tên, vai trò, phòng ban, trạng thái, đăng nhập lần cuối

### ✅ Phân Trang
- 10 items/trang (có thể config)
- Nút Trước/Sau
- Hiển thị số trang
- Ellipsis (...) cho nhiều trang
- Hiển thị "X - Y / Tổng số"

### ✅ Hành Động
- **Chỉnh sửa** (Edit): Mở modal chỉnh sửa thông tin
- **Khóa/Mở khóa**: Toggle status giữa active/inactive
- **Xóa**: Xác nhận trước khi xóa

### ✅ Hiển Thị
- Avatar user
- Badge vai trò (với màu khác nhau)
- Badge trạng thái
- Thời gian đăng nhập lần cuối (relative time: "2 giờ trước")
- Responsive table

## 📊 Mock Data

File `mock/users.ts` chứa 12 users mẫu:
- 2 Admin
- 3 Giảng viên
- 5 Học viên
- 2 Người dùng thường

Các trạng thái:
- 9 Hoạt động
- 2 Không hoạt động
- 1 Bị khóa

## 🎨 CSS Tái Sử Dụng

### table.css
- `.admin-table` - Style cho bảng
- `.admin-table th.sortable` - Cột có thể sort
- `.admin-table tbody tr:hover` - Hover effect
- `.admin-table-empty` - Empty state
- Responsive cho mobile

### common.css
- `.search-bar` - Thanh tìm kiếm
- `.pagination` - Phân trang
- `.badge-*` - Các loại badge
- `.modal-*` - Modal styles
- `.btn-*` - Button styles
- `.filters-container` - Container cho filters
- `.avatar` - Avatar styles
- Animations (fadeIn, slideUp)

## 🔧 Hook useUsers.ts

Custom hook quản lý toàn bộ logic:

```tsx
const {
  users,              // Users đã filter, sort, paginate
  filters,            // Object filters hiện tại
  updateFilter,       // Cập nhật 1 filter
  currentPage,        // Trang hiện tại
  setCurrentPage,     // Set trang
  totalPages,         // Tổng số trang
  totalItems,         // Tổng số items sau filter
  sortKey,            // Key đang sort
  sortOrder,          // asc/desc
  handleSort,         // Xử lý sort
  deleteUser,         // Xóa user
  toggleUserStatus,   // Toggle status
  updateUser,         // Cập nhật user
  addUser            // Thêm user mới
} = useUsers()
```

### Logic Xử Lý:
1. **Filter** → 2. **Sort** → 3. **Paginate**
2. Tự động reset về trang 1 khi filter thay đổi
3. useMemo để optimize performance

## 💡 Cách Sử Dụng

### Truy Cập Trang
```
http://localhost:5173/admin/users
```

### Test Features
1. ✅ **Tìm kiếm**: Gõ "Nguyễn" hoặc email
2. ✅ **Lọc vai trò**: Chọn "Giảng viên"
3. ✅ **Lọc trạng thái**: Chọn "Hoạt động"
4. ✅ **Sort**: Click vào "Người dùng" hoặc "Trạng thái"
5. ✅ **Phân trang**: Chuyển qua trang 2
6. ✅ **Chỉnh sửa**: Click nút Edit
7. ✅ **Khóa**: Click nút Lock/Unlock
8. ✅ **Xóa**: Click nút Delete → Xác nhận

## 🎯 Các Components Có Thể Tái Sử Dụng

Các components trong `components/common/` có thể dùng cho:

- **Table**: Trang ExamsPage, CoursesPage, OrganizationsPage
- **Pagination**: Mọi trang có list data
- **SearchBar**: Trang Certifications, Contests, Analytics
- **Badge**: Hiển thị status ở mọi nơi
- **Modal**: Confirm dialogs, Form popups

## 📝 To-Do (Nếu Có Backend)

Khi có backend, chỉ cần:

1. ✅ Thay `mockUsers` bằng API call trong `useUsers.ts`
2. ✅ Implement `updateUser`, `deleteUser`, `addUser` với API
3. ✅ Add loading states
4. ✅ Add error handling
5. ✅ Add success notifications

## 🚀 Best Practices Đã Áp Dụng

1. ✅ **Component Composition**: Chia nhỏ components (UserTable → UserTableRow → UserActions)
2. ✅ **CSS Modules**: Tách CSS riêng, có thể tái sử dụng
3. ✅ **Custom Hooks**: Logic tách khỏi UI (useUsers)
4. ✅ **TypeScript**: Type-safe với interfaces rõ ràng
5. ✅ **Accessibility**: Keyboard support (ESC close modal), proper labels
6. ✅ **UX**: Loading states, empty states, confirmations
7. ✅ **Performance**: useMemo, useCallback để optimize
8. ✅ **Responsive**: Mobile-friendly table
9. ✅ **Animations**: Smooth transitions và animations
10. ✅ **Clean Code**: DRY, SOLID principles

---

**Status: ✅ HOÀN THÀNH**

Trang quản lý người dùng đã sẵn sàng với đầy đủ tính năng, có thể tái sử dụng components và dễ dàng tích hợp backend!

