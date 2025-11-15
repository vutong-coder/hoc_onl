# Google OAuth Setup Guide

## Tổng quan

Frontend đã được tích hợp Google OAuth. Khi user click nút "Đăng nhập bằng Google", flow sau sẽ diễn ra:

1. User click nút Google Login
2. Frontend redirect đến `${API_GATEWAY}/identity/oauth2/authorization/google`
3. Backend redirect user đến Google OAuth consent screen
4. User đăng nhập và cho phép truy cập
5. Google redirect về backend callback URL với authorization code
6. Backend exchange code for access token
7. Backend tạo user account (nếu chưa có) và trả về JWT token
8. Backend redirect về `${FRONTEND_URL}/oauth/callback?code=...`
9. Frontend callback page xử lý code và lưu tokens
10. User được redirect đến dashboard

## Frontend Integration

### Files đã được tạo/cập nhật:

1. **`src/services/api/authApi.ts`**
   - `initiateGoogleLogin()`: Redirect đến backend OAuth endpoint
   - `handleOAuthCallback()`: Xử lý callback từ Google

2. **`src/pages/OAuthCallbackPage.tsx`**
   - Component xử lý OAuth callback
   - Lưu tokens và user data vào localStorage
   - Redirect user đến dashboard

3. **`src/routes/AppRoutes.tsx`**
   - Added route `/oauth/callback` cho OAuth callback

4. **`src/pages/LoginPage.tsx`**
   - Updated `handleGoogleAuth()` để gọi `initiateGoogleLogin()`

## Backend Setup Requirements

### 1. Google Cloud Console Configuration

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn existing project
3. Enable Google+ API
4. Tạo OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:5173` (Vite dev)
     - `http://localhost:3000` (Production frontend)
     - `https://your-domain.com`
   - Authorized redirect URIs:
     - `http://localhost:8080/identity/login/oauth2/code/google`
     - `https://your-api-gateway.com/identity/login/oauth2/code/google`

5. Copy Client ID và Client Secret

### 2. Backend Configuration (Spring Boot)

#### application.yml

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - email
              - profile
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
        provider:
          google:
            authorization-uri: https://accounts.google.com/o/oauth2/v2/auth
            token-uri: https://oauth2.googleapis.com/token
            user-info-uri: https://www.googleapis.com/oauth2/v3/userinfo
            user-name-attribute: sub

# CORS configuration
cors:
  allowed-origins:
    - http://localhost:5173
    - http://localhost:3000
    - https://your-frontend-domain.com
  allowed-methods:
    - GET
    - POST
    - PUT
    - DELETE
    - OPTIONS
  allowed-headers:
    - "*"
  allow-credentials: true
```

#### Environment Variables

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Backend OAuth Controller

Backend cần có endpoint để xử lý OAuth callback:

```java
@RestController
@RequestMapping("/api/v1/auth/oauth2")
public class OAuthController {
    
    @GetMapping("/callback")
    public ResponseEntity<?> handleOAuthCallback(
        @RequestParam String code,
        @RequestParam(required = false) String state
    ) {
        // Exchange code for Google tokens
        // Get user info from Google
        // Create or update user in database
        // Generate JWT tokens
        // Return tokens and user data
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", Map.of(
                "accessToken", jwtToken,
                "refreshToken", refreshToken,
                "user", userData
            )
        ));
    }
}
```

### 4. Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(authorization -> authorization
                    .baseUri("/oauth2/authorization"))
                .redirectionEndpoint(redirection -> redirection
                    .baseUri("/login/oauth2/code/*"))
                .successHandler(oAuthSuccessHandler())
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // ... other configurations
        
        return http.build();
    }
    
    @Bean
    public OAuth2LoginSuccessHandler oAuthSuccessHandler() {
        return new OAuth2LoginSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(
                HttpServletRequest request,
                HttpServletResponse response,
                Authentication authentication
            ) throws IOException {
                // Generate JWT tokens
                // Redirect to frontend with code
                response.sendRedirect(
                    "http://localhost:5173/oauth/callback?code=" + code
                );
            }
        };
    }
}
```

## Testing

### 1. Development Testing

```bash
# Start backend
cd Code-spark
./mvnw spring-boot:run

# Start frontend
cd web-frontend
npm run dev
```

### 2. Test OAuth Flow

1. Navigate to `http://localhost:5173/auth/login`
2. Click "Đăng nhập bằng Google"
3. Chọn Google account
4. Allow permissions
5. Should redirect về frontend và auto-login

### 3. Debugging

Check browser console và network tab để xem:
- Redirect URL
- OAuth callback response
- Token storage
- User data

## Environment Variables

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Backend `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```

## Production Deployment

### Frontend

1. Update `.env.production`:
```env
VITE_API_BASE_URL=https://your-api-gateway.com
```

2. Update Google Cloud Console:
   - Add production redirect URIs
   - Add production JavaScript origins

### Backend

1. Update application.yml với production URLs
2. Set environment variables trên server
3. Enable HTTPS
4. Update CORS configuration

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Check Google Console authorized redirect URIs
   - Verify backend redirect-uri configuration matches

2. **CORS errors**
   - Check backend CORS configuration
   - Verify frontend URL trong allowed-origins

3. **Token not saved**
   - Check OAuthCallbackPage console logs
   - Verify backend response format
   - Check localStorage permissions

4. **User not redirected after OAuth**
   - Check backend success handler
   - Verify frontend callback route
   - Check browser console for errors

## Security Considerations

1. **Never commit secrets**: Use environment variables
2. **Use HTTPS in production**: Protect OAuth flow
3. **Validate state parameter**: Prevent CSRF attacks
4. **Short-lived tokens**: Implement token refresh
5. **Secure token storage**: Consider httpOnly cookies for production

## Next Steps

1. ✅ Frontend integration complete
2. ⏳ Backend OAuth configuration needed
3. ⏳ Google Cloud Console setup needed
4. ⏳ Testing và debugging
5. ⏳ Production deployment

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Spring Security OAuth2 Documentation](https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html)
- [React Router Documentation](https://reactrouter.com/)

