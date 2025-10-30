# 🐛 Debug CourseLearnPage - Trang trắng

## ❌ Vấn đề

Khi click "Tiếp tục học" vào trang `/user/courses/:courseId/learn` → **Trang hiển thị trắng tinh**

## 🔍 Nguyên nhân có thể

1. **Đang loading nhưng không hiển thị** - CSS không load
2. **Không có materials** - Khóa học chưa có tài liệu
3. **Lỗi fetch data** - API trả về lỗi
4. **currentMaterial = null** - Không set được material đầu tiên

## ✅ Đã sửa

### 1. Thêm console.log để debug

```typescript
const fetchCourseData = async () => {
  console.log('Fetching course data for:', courseId)
  
  const courseResponse = await courseApi.getCourseById(courseId)
  console.log('Course data:', courseResponse.data)
  
  const materialsResponse = await courseApi.getCourseMaterials(courseId)
  console.log('Materials:', sortedMaterials)
}
```

### 2. Sửa Loading State với inline styles

```typescript
if (loading) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      // ... inline styles không phụ thuộc CSS file
    }}>
      <div className="spinner"></div>
      <p>Đang tải bài học...</p>
    </div>
  )
}
```

### 3. Thêm Empty State cho không có materials

```typescript
if (materials.length === 0) {
  return (
    <div style={{...}}>
      <BookOpen size={64} />
      <h2>Khóa học chưa có tài liệu</h2>
      <button onClick={() => navigate(`/user/courses/${courseId}`)}>
        Quay lại khóa học
      </button>
    </div>
  )
}
```

### 4. Xử lý error khi fetch materials

```typescript
try {
  const materialsResponse = await courseApi.getCourseMaterials(courseId)
  setMaterials(sortedMaterials)
} catch (err) {
  console.log('No materials found, setting empty array')
  setMaterials([]) // Set empty thay vì crash
}
```

## 🚀 Cách debug

### Bước 1: Mở Developer Console

1. Press `F12` hoặc `Ctrl+Shift+I`
2. Chuyển sang tab **Console**
3. Clear console (`Ctrl+L`)

### Bước 2: Reload trang

1. Refresh trang (`F5`)
2. Xem console logs:

**Kỳ vọng thấy:**
```
Fetching course data for: 957aa02a-6d7d-4f07-83bf-be5d2bd02b2d
Course data: { id: "...", title: "...", ... }
Materials: [{...}, {...}]
```

**Nếu thấy lỗi:**
```
Error fetching course data: Error: Failed to get course
// hoặc
No materials found, setting empty array
```

### Bước 3: Kiểm tra Network Tab

1. Chuyển sang tab **Network**
2. Reload trang
3. Tìm requests:
   - `GET /api/courses/{courseId}` → Status?
   - `GET /api/courses/{courseId}/materials` → Status?

**Kỳ vọng:**
- ✅ Status: 200 OK
- ✅ Response có data

**Nếu lỗi:**
- ❌ 403/401 → Backend chưa restart
- ❌ 404 → Course không tồn tại
- ❌ 500 → Backend error

## 📋 Checklist Debug

### Backend (Course Service)

- [ ] **Service đang chạy?**
  ```bash
  curl http://localhost:9001/actuator/health
  # Expect: {"status":"UP"}
  ```

- [ ] **API courses hoạt động?**
  ```bash
  curl http://localhost:9001/api/courses
  # Expect: 200 OK với list courses
  ```

- [ ] **Course ID tồn tại?**
  ```bash
  curl http://localhost:9001/api/courses/957aa02a-6d7d-4f07-83bf-be5d2bd02b2d
  # Expect: 200 OK với course data
  ```

- [ ] **Materials tồn tại?**
  ```bash
  curl http://localhost:9001/api/courses/957aa02a-6d7d-4f07-83bf-be5d2bd02b2d/materials
  # Expect: 200 OK với list materials
  ```

### Frontend

- [ ] **Token hợp lệ?**
  ```javascript
  console.log(localStorage.getItem('accessToken'))
  // Expect: "eyJhbGciOiJSUzI1NiIs..."
  ```

- [ ] **User logged in?**
  ```javascript
  console.log(user)
  // Expect: { id: "...", email: "...", ... }
  ```

- [ ] **CSS file load được?**
  ```
  Network tab → CourseLearnPage.css → Status 200
  ```

## 🔧 Các trường hợp và giải pháp

### Trường hợp 1: Course không tồn tại

**Console log:**
```
Error fetching course data: Error: Failed to get course
```

**Giải pháp:**
- Kiểm tra courseId có đúng không
- Hoặc tạo course mới trong admin panel

### Trường hợp 2: Course không có materials

**Console log:**
```
No materials found, setting empty array
Materials: []
```

**UI hiển thị:**
```
📖 Khóa học chưa có tài liệu
Khóa học "..." hiện chưa có tài liệu học tập nào.
[Quay lại khóa học]
```

**Giải pháp:**
- Vào admin panel
- Thêm materials cho course

### Trường hợp 3: Backend chưa restart

**Console log:**
```
Error getting course: AxiosError
Request failed with status code 403
```

**Giải pháp:**
```bash
cd Code-spark/services/course-service
mvn spring-boot:run
```

### Trường hợp 4: CSS không load

**Trang hiển thị content nhưng không có styling**

**Giải pháp:**
- Đã thêm inline styles → sẽ hiển thị dù CSS không load
- Check file: `web-frontend/src/assets/css/CourseLearnPage.css` tồn tại

### Trường hợp 5: Dependency warning

**Console có warning về useEffect dependencies**

**Giải pháp:**
- Đã bỏ qua warnings không ảnh hưởng
- Hoặc thêm dependencies vào array

## 🎯 Testing Steps

### Test 1: Có Course + Có Materials

1. Vào admin panel: `/admin/courses`
2. Tạo course mới
3. Thêm 2-3 materials (video, document, quiz)
4. Vào user: `/user/courses`
5. Click vào course → Xem chi tiết
6. Click "Đăng ký học" → Vào trang learn
7. **Expect:** Hiển thị materials và content

### Test 2: Có Course + Không Materials

1. Tạo course mới
2. KHÔNG thêm materials
3. Click "Đăng ký học"
4. **Expect:** Hiển thị "Khóa học chưa có tài liệu"

### Test 3: Course không tồn tại

1. Truy cập URL: `/user/courses/invalid-uuid/learn`
2. **Expect:** Hiển thị "Không tìm thấy khóa học"

## 📝 Debug Commands

Chạy trong Console để debug:

```javascript
// 1. Check token
console.log('Token:', localStorage.getItem('accessToken'))

// 2. Check user
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'))

// 3. Test API manually
fetch('http://localhost:9001/api/courses/957aa02a-6d7d-4f07-83bf-be5d2bd02b2d', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})
.then(r => r.json())
.then(data => console.log('Course API:', data))
.catch(err => console.error('Error:', err))

// 4. Test materials API
fetch('http://localhost:9001/api/courses/957aa02a-6d7d-4f07-83bf-be5d2bd02b2d/materials', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})
.then(r => r.json())
.then(data => console.log('Materials API:', data))
.catch(err => console.error('Error:', err))
```

## 🔄 Steps to Fix

### 1. Ensure Backend is Running

```bash
# Terminal 1: Course Service
cd Code-spark/services/course-service
mvn spring-boot:run

# Wait for: Started CourseServiceApplication...
```

### 2. Create Test Data

```bash
# Vào admin panel: http://localhost:4173/admin/courses
# Tạo course với materials
```

### 3. Check Console Logs

```
F12 → Console tab
Reload page
Xem logs: "Fetching course data for:", "Course data:", "Materials:"
```

### 4. Fix Based on Logs

**Nếu thấy:**
- ✅ Logs xuất hiện + Data OK → Trang sẽ render
- ❌ Error 403/401 → Backend chưa restart
- ❌ Materials: [] → Course chưa có materials
- ❌ Không có logs → JavaScript error, check Errors trong console

## 🎉 Expected Final Result

Sau khi fix:

1. **Console logs:**
   ```
   Fetching course data for: 957aa02a-...
   Course data: {id: "...", title: "Python Programming"}
   Materials: [{id: "...", title: "Introduction", type: "video"}, ...]
   ```

2. **UI hiển thị:**
   - Header với course title
   - Progress bar
   - Main content: Video/Document/Quiz
   - Sidebar: Danh sách materials
   - Navigation buttons

3. **Không còn lỗi trong Console** ✅

## 📚 Files Updated

- ✅ `CourseLearnPage.tsx` - Thêm debug logs và inline styles
- ✅ Error states với inline styles (không phụ thuộc CSS)
- ✅ Empty state khi không có materials
- ✅ Better error handling

## ⚠️ Important Notes

1. **Backend PHẢI chạy trước** khi test frontend
2. **Course PHẢI có materials** để hiển thị content
3. **User PHẢI login** để truy cập
4. **CourseId PHẢI hợp lệ** (UUID format)

## 🚀 Quick Fix

```bash
# 1. Restart backend (nếu chưa)
cd Code-spark/services/course-service
mvn spring-boot:run

# 2. Refresh frontend
# Press F5 in browser

# 3. Open Console (F12)
# Check logs và errors

# 4. Nếu "No materials":
# → Vào /admin/courses
# → Thêm materials cho course
# → Refresh lại
```

Hãy làm theo hướng dẫn và xem Console để biết vấn đề cụ thể! 🔍

