# Sơ đồ luồng hoạt động hệ thống thi với camera giám sát

## Luồng chính (Main Flow)

```
┌─────────────────┐
│   Dashboard     │
│ (UpcomingExams) │
└─────────┬───────┘
          │ User clicks "Start Exam"
          ▼
┌─────────────────┐
│ ExamPreCheckPage│
│ /exam/:id/pre-  │
│ check           │
└─────────┬───────┘
          │ Camera ready
          ▼
┌─────────────────┐
│ ExamTakingPage  │
│ /exam/:id/take  │
└─────────┬───────┘
          │ Exam completed
          ▼
┌─────────────────┐
│ ExamResultPage  │
│ /exam/:id/result│
└─────────────────┘
```

## Chi tiết từng bước

### 1. ExamPreCheckPage
```
┌─────────────────────────────────────┐
│            ExamPreCheckPage         │
├─────────────────────────────────────┤
│ 1. Load exam details                │
│ 2. Show instructions                │
│ 3. Request camera permission        │
│ 4. Test camera functionality        │
│ 5. Confirm readiness                │
└─────────────────┬───────────────────┘
                  │ All checks passed
                  ▼
        ┌─────────────────┐
        │ Navigate to     │
        │ /exam/:id/take  │
        └─────────────────┘
```

### 2. ExamTakingPage
```
┌─────────────────────────────────────┐
│            ExamTakingPage           │
├─────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐    │
│ │   Main      │  │   Sidebar   │    │
│ │   Content   │  │             │    │
│ │             │  │ ┌─────────┐ │    │
│ │ ┌─────────┐ │  │ │ Timer   │ │    │
│ │ │Question │ │  │ └─────────┘ │    │
│ │ │Display  │ │  │ ┌─────────┐ │    │
│ │ └─────────┘ │  │ │Question │ │    │
│ │             │  │ │Navigator│ │    │
│ │ Navigation  │  │ └─────────┘ │    │
│ │ Buttons     │  │ ┌─────────┐ │    │
│ └─────────────┘  │ │Camera   │ │    │
│                  │ │Monitor  │ │    │
│                  │ └─────────┘ │    │
│                  └─────────────┘    │
├─────────────────────────────────────┤
│ Features:                           │
│ • Auto-save answers (30s)           │
│ • Screenshot capture (10s)          │
│ • Timer countdown                   │
│ • Question navigation               │
│ • Camera monitoring                 │
└─────────────────┬───────────────────┘
                  │ Time up or Submit
                  ▼
        ┌─────────────────┐
        │ Submit Exam     │
        │ API Call        │
        └─────────────────┘
```

### 3. ExamResultPage
```
┌─────────────────────────────────────┐
│            ExamResultPage           │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │        Score Display            │ │
│ │                                 │ │
│ │    ○─────○                      │ │
│ │   ╱       ╲                     │ │
│ │  ╱         ╲                    │ │
│ │ ╱           ╲                   │ │
│ │╱             ╲                  │ │
│ │               ╲                 │ │
│ │                ╲                │ │
│ │                 ╲               │ │
│ │                  ╲              │ │
│ │                   ╲             │ │
│ │                    ╲            │ │
│ │                     ╲           │ │
│ │                      ╲          │ │
│ │                       ╲         │ │
│ │                        ╲        │ │
│ │                         ╲       │ │
│ │                          ╲      │ │
│ │                           ╲     │ │
│ │                            ╲    │ │
│ │                             ╲   │ │
│ │                              ╲  │ │
│ │                               ╲ │ │
│ │                                ╲│ │
│ │                                 │ │
│ │         85%                     │ │
│ │        PASSED                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────┐ ┌─────────────┐     │
│ │ Statistics  │ │ Next Steps  │     │
│ │             │ │             │     │
│ │ ✓ 21/25     │ │ View Details│     │
│ │ ⏱ 87 min    │ │ Dashboard   │     │
│ └─────────────┘ └─────────────┘     │
└─────────────────────────────────────┘
```

## Các component chính

### ProctoringView Component
```
┌─────────────────────────────────────┐
│          ProctoringView             │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │           Header                │ │
│ │ [●] Camera giám sát    [⚙][-]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │         Video Stream            │ │
│ │                                 │ │
│ │      (User's Camera)            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        Footer Info              │ │
│ │ Camera đang được sử dụng để     │ │
│ │ giám sát quá trình làm bài thi  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### CountdownTimer Component
```
┌─────────────────────────────────────┐
│          CountdownTimer             │
├─────────────────────────────────────┤
│ ⏰ Thời gian còn lại                │
│                                     │
│           01:23:45                  │
│                                     │
│ ╔═════════════════════════════════╗ │
│ ║                                 ║ │
│ ║ ████████████████░░░░░░░░░░░░░░░ ║ │
│ ║                                 ║ │
│ ╚═════════════════════════════════╝ │
│                                     │
│ 0:00                    90:00       │
└─────────────────────────────────────┘
```

### ExamQuestion Component
```
┌─────────────────────────────────────┐
│          ExamQuestion               │
├─────────────────────────────────────┤
│ [C3/25] [4 điểm] [Trắc nghiệm] [🚩] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Trong JavaScript, closure là gì?│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ○ A. Một hàm có thể truy cập biến   │
│     từ scope cha                    │
│                                     │
│ ● B. Một phương thức để đóng gói    │
│     dữ liệu                         │
│                                     │
│ ○ C. Một pattern để tạo private    │
│     methods                         │
│                                     │
│ ○ D. Tất cả các đáp án trên        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [← Câu trước]  [Sau →]          │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## State Management (Redux)

```
┌─────────────────────────────────────┐
│            Exam Slice               │
├─────────────────────────────────────┤
│ currentExam: ExamDetails            │
│ questions: ExamQuestion[]           │
│ currentQuestionIndex: number        │
│ answers: Record<number, ExamAnswer> │
│ timeRemaining: number               │
│ status: 'idle' | 'loading' | ...   │
│ isCameraReady: boolean              │
│ visitedQuestions: Set<number>       │
│ flaggedQuestions: Set<number>       │
└─────────────────────────────────────┘
```

## API Calls Flow

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          │ fetchExamDetails     │
          ├─────────────────────►│
          │                      │
          │ startExamSession     │
          ├─────────────────────►│
          │                      │
          │ saveAnswer (30s)     │
          ├─────────────────────►│
          │                      │
          │ sendScreenshot (10s) │
          ├─────────────────────►│
          │                      │
          │ submitExam           │
          ├─────────────────────►│
          │                      │
          │ ◄────────────────────┤
          │    Result            │
```

## Camera Monitoring Flow

```
┌─────────────────────────────────────┐
│         Camera Monitoring           │
├─────────────────────────────────────┤
│ 1. Request camera permission        │
│ 2. Start video stream               │
│ 3. Display video in ProctoringView  │
│ 4. Capture screenshots every 10s    │
│ 5. Send screenshots to server       │
│ 6. Monitor for errors               │
│ 7. Stop stream on exam end          │
└─────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────┐
│           Error Handling            │
├─────────────────────────────────────┤
│ Camera Errors:                      │
│ • Permission denied                 │
│ • Camera not found                  │
│ • Stream failed                     │
│                                     │
│ Network Errors:                     │
│ • Save answer failed                │
│ • Submit exam failed                │
│ • Screenshot upload failed          │
│                                     │
│ UI Errors:                          │
│ • Timer sync issues                 │
│ • Navigation problems               │
│ • State corruption                  │
└─────────────────────────────────────┘
```

## Security Features

```
┌─────────────────────────────────────┐
│         Security Features           │
├─────────────────────────────────────┤
│ • HTTPS required for camera         │
│ • No video recording (privacy)      │
│ • Screenshot encryption             │
│ • Session timeout handling          │
│ • Tab focus monitoring              │
│ • Audio monitoring                  │
│ • Anti-cheating detection           │
└─────────────────────────────────────┘
```

