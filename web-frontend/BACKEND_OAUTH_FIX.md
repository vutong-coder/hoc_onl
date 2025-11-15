# Backend OAuth Redirect Fix

## Vấn đề hiện tại

Backend đang redirect về: `http://localhost:4173/user?token=...`

Nhưng frontend cần: `http://localhost:4173/oauth/callback?token=...`

## Giải pháp: Update Backend OAuth Success Handler

### Location: `Code-spark/services/identity-service/src/main/java/com/dao/identity_service/security/OAuth2LoginSuccessHandler.java`

Tìm phần code redirect sau khi OAuth success:

```java
@Override
public void onAuthenticationSuccess(
    HttpServletRequest request,
    HttpServletResponse response,
    Authentication authentication
) throws IOException {
    // Current code (SAI):
    response.sendRedirect(
        frontendUrl + "/user?token=" + jwtToken
    );
}
```

### Thay đổi thành:

```java
@Override
public void onAuthenticationSuccess(
    HttpServletRequest request,
    HttpServletResponse response,
    Authentication authentication
) throws IOException {
    // Get OAuth2 user details
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    
    // Create or update user in database
    User user = createOrUpdateUserFromOAuth(oAuth2User);
    
    // Generate JWT token
    String jwtToken = jwtTokenProvider.generateToken(user);
    
    // Redirect to frontend callback page (ĐÚNG)
    response.sendRedirect(
        frontendUrl + "/oauth/callback?token=" + jwtToken
    );
}
```

### Hoặc nếu muốn return JSON thay vì redirect:

```java
@Override
public void onAuthenticationSuccess(
    HttpServletRequest request,
    HttpServletResponse response,
    Authentication authentication
) throws IOException {
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    User user = createOrUpdateUserFromOAuth(oAuth2User);
    
    String accessToken = jwtTokenProvider.generateToken(user);
    String refreshToken = jwtTokenProvider.generateRefreshToken(user);
    
    // Return JSON instead of redirect
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    Map<String, Object> responseData = Map.of(
        "success", true,
        "data", Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken,
            "user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "roles", user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toList()),
                "avatarUrl", user.getAvatarUrl()
            )
        )
    );
    
    response.getWriter().write(
        new ObjectMapper().writeValueAsString(responseData)
    );
}
```

## Verify Environment Variables

Đảm bảo backend có environment variable:

```properties
# application.yml or application.properties
frontend:
  url: http://localhost:4173  # Development
  # url: https://your-production-domain.com  # Production

# Or as environment variable:
FRONTEND_URL=http://localhost:4173
```

## Testing

1. Click "Đăng nhập bằng Google"
2. Authenticate with Google
3. Backend should redirect to: `http://localhost:4173/oauth/callback?token=eyJ...`
4. Frontend OAuthCallbackPage will:
   - Parse JWT token
   - Extract user info
   - Save to localStorage
   - Redirect to `/user` dashboard

## Debug Log Example

Sau khi fix, backend logs sẽ như này:

```
Redirecting to http://localhost:4173/oauth/callback?token=eyJhbGci...
```

Thay vì:

```
Redirecting to http://localhost:4173/user?token=eyJhbGci...
```

## Alternative: Keep Current Backend & Update Frontend

Nếu không muốn sửa backend, có thể thêm route handler ở frontend:

**KHÔNG KHUYẾN KHÍCH** vì sẽ conflict với existing `/user/*` routes!

## Recommended: Update Backend

✅ **Thay đổi backend redirect URL** là cách tốt nhất và cleanest.

