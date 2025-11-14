# Frontend API Endpoints Configuration

## Tổng quan
Tất cả các API calls từ frontend đều đi qua **API Gateway** tại `http://localhost:8080`

## Environment Variables

### Required
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Blockchain Configuration
```env
VITE_REWARD_TOKEN_NETWORK_NAME=Localhost 7545
VITE_REWARD_TOKEN_CHAIN_ID=0x539
VITE_REWARD_TOKEN_DEPOSIT_ADDRESS=0xBd289d6b07Ad6A7A267F6acc9bC9f1C33E803D17
VITE_REWARD_TOKEN_ESCROW_ADDRESS=0xa7FBAc24452dA656AEdE23279993DC90D5105239
VITE_LEARN_TOKEN_ADDRESS=0x217395230cC8Fa9Cad73e1DF3732E6a32F979787
VITE_COURSE_COMPLETION_REWARD=100
```

---

## API Service Files Updated

### User Services
| File | Old URL | New URL (via Gateway) |
|------|---------|----------------------|
| `services/api/userApi.ts` | `VITE_USER_API_URL` (9010) | `${VITE_API_BASE_URL}/identity/api/v1` |
| `services/api/authApi.ts` | Already using gateway | `${VITE_API_BASE_URL}/identity/api/v1` |

### Course & Exam Services
| File | Old URL | New URL (via Gateway) |
|------|---------|----------------------|
| `services/api/courseApi.ts` | Already using gateway | `${VITE_API_BASE_URL}/api/v1` |
| `services/api/examApi.ts` | `VITE_EXAM_API_URL` (9005) | `${VITE_API_BASE_URL}/exam` |
| `services/api/onlineExamApi.ts` | `VITE_ONLINE_EXAM_API_URL` (9003) | `${VITE_API_BASE_URL}/api/exam` |

### Token & Reward Services
| File | Old URL | New URL (via Gateway) |
|------|---------|----------------------|
| `services/api/tokenRewardApi.ts` | `VITE_TOKEN_REWARD_API_URL` (9009) | `${VITE_API_BASE_URL}/api/tokens` |
| `services/api/tokenApi.ts` | `VITE_TOKEN_API_URL` (9009) | `${VITE_API_BASE_URL}/api/tokens` |

### Blockchain Services
| File | Old URL | New URL (via Gateway) |
|------|---------|----------------------|
| `services/api/multisigApi.ts` | `VITE_MULTISIG_SERVICE_URL` (3001) | `${VITE_API_BASE_URL}/api/v1/multisig` |

### Monitoring Services
| File | Old URL | New URL (via Gateway) |
|------|---------|----------------------|
| `services/api/proctoringApi.ts` | `localhost:8082` (hardcoded) | `${VITE_API_BASE_URL}/api/proctoring` |
| `admin/services/analyticsApi.ts` | `VITE_ANALYTICS_API_URL` (9004) | `${VITE_API_BASE_URL}/analytics` |

### Copyright Services
| File | Old URL | New URL (via Gateway) |
|------|---------|----------------------|
| `services/api/copyrightApi.ts` | `${VITE_API_BASE_URL}/copyright` | `${VITE_API_BASE_URL}/api/copyrights` |
| `services/api/copyrightService.ts` | Already using gateway | `${VITE_API_BASE_URL}/api/copyrights` |

---

## API Endpoint Mappings

### Authentication & User Management
```typescript
// Login & Register
POST http://localhost:8080/identity/api/v1/auth/login
POST http://localhost:8080/identity/api/v1/auth/register
POST http://localhost:8080/identity/api/v1/users/change-password

// User Profile
GET  http://localhost:8080/identity/api/v1/users/profile
GET  http://localhost:8080/identity/api/v1/users/{id}
PUT  http://localhost:8080/identity/api/v1/users/{id}
```

### Course Management
```typescript
GET  http://localhost:8080/api/v1/courses
POST http://localhost:8080/api/v1/courses
GET  http://localhost:8080/api/v1/courses/{id}
PUT  http://localhost:8080/api/v1/courses/{id}
DELETE http://localhost:8080/api/v1/courses/{id}

// Materials
GET  http://localhost:8080/api/v1/courses/{id}/materials
POST http://localhost:8080/api/v1/courses/{id}/materials

// Progress
GET  http://localhost:8080/api/v1/progress/student/{studentId}/course/{courseId}
POST http://localhost:8080/api/v1/progress/student/{studentId}/course/{courseId}/material/{materialId}
```

### Exam Management
```typescript
// Exam Service (exam-service)
GET  http://localhost:8080/exam/exams
POST http://localhost:8080/exam/exams
GET  http://localhost:8080/exam/exams/{id}
PUT  http://localhost:8080/exam/exams/{id}
DELETE http://localhost:8080/exam/exams/{id}

// Online Exam Service (online_exam_service)
GET  http://localhost:8080/api/exam/api/quizzes/{id}
POST http://localhost:8080/api/exam/api/quizzes/{id}/start
POST http://localhost:8080/api/exam/api/submissions/{id}/submit
```

### Token & Rewards
```typescript
GET  http://localhost:8080/api/tokens/balance/{studentId}
GET  http://localhost:8080/api/tokens/history/{studentId}
POST http://localhost:8080/api/tokens/grant
POST http://localhost:8080/api/tokens/spend
POST http://localhost:8080/api/tokens/withdraw
```

### Multisig Wallet
```typescript
GET  http://localhost:8080/api/v1/multisig/
POST http://localhost:8080/api/v1/multisig/
GET  http://localhost:8080/api/v1/multisig/{walletId}
GET  http://localhost:8080/api/v1/multisig/{walletId}/transactions
POST http://localhost:8080/api/v1/multisig/{walletId}/transactions
```

### Proctoring
```typescript
GET  http://localhost:8080/api/proctoring/sessions
POST http://localhost:8080/api/proctoring/sessions/{id}/terminate
POST http://localhost:8080/api/proctoring/analyze-frame

# WebSocket
ws://localhost:8080/ws
```

### Analytics
```typescript
GET  http://localhost:8080/analytics/...
POST http://localhost:8080/analytics/...
```

### Copyright
```typescript
GET  http://localhost:8080/api/copyrights
POST http://localhost:8080/api/copyrights/register
POST http://localhost:8080/api/copyrights/verify/{hash}
```

### Notifications (SSE)
```typescript
GET  http://localhost:8080/api/v1/notifications/stream
```

---

## Admin Services

All admin services in `src/admin/services/` are re-exports from main services, so they automatically use the API Gateway configuration:

- `admin/services/userApi.ts` → Uses `services/api/userApi.ts`
- `admin/services/courseApi.ts` → Uses `services/api/courseApi.ts`
- `admin/services/examApi.ts` → Uses `services/api/examApi.ts`
- `admin/services/proctoringApi.ts` → Uses `services/api/proctoringApi.ts`
- `admin/services/tokenRewardApi.ts` → Uses `services/api/tokenRewardApi.ts`
- `admin/services/analyticsApi.ts` → Direct config (already updated)

---

## Benefits of API Gateway

1. **Single Entry Point**: All requests go through one endpoint (port 8080)
2. **No CORS Issues**: Only gateway handles CORS headers
3. **Centralized Auth**: JWT token validation at gateway level
4. **Load Balancing**: Automatic via Eureka service discovery
5. **Monitoring**: Easy to monitor all API traffic
6. **Security**: Centralized security policies

---

## Migration Notes

### Deprecated Environment Variables
These are no longer needed and should be removed from `.env`:
- `VITE_USER_API_URL`
- `VITE_COURSE_API_URL`
- `VITE_EXAM_API_URL`
- `VITE_ONLINE_EXAM_API_URL`
- `VITE_TOKEN_REWARD_API_URL`
- `VITE_TOKEN_API_URL`
- `VITE_ANALYTICS_API_URL`
- `VITE_MULTISIG_SERVICE_URL`

### Required Environment Variable
Only `VITE_API_BASE_URL` is needed:
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## Testing

After updating, test each service:

1. **Login**: POST `/identity/api/v1/auth/login`
2. **Get Courses**: GET `/api/v1/courses`
3. **Get Token Balance**: GET `/api/tokens/balance/{studentId}`
4. **Create Exam**: POST `/exam/exams`
5. **Analytics**: GET `/analytics/...`

All should return proper responses without CORS errors.

