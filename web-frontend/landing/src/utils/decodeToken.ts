interface DecodedToken {
  sub: string; // user id
  email: string;
  name: string;
  role: string;
  iat: number; // issued at
  exp: number; // expiration
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // Split the token into parts
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (middle part)
    const payload = parts[1];
    
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);
    
    return parsedPayload as DecodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  
  if (!decoded) {
    return true;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

export const getTokenExpirationTime = (token: string): Date | null => {
  const decoded = decodeToken(token);
  
  if (!decoded) {
    return null;
  }
  
  return new Date(decoded.exp * 1000);
};

export const getTokenTimeRemaining = (token: string): number => {
  const decoded = decodeToken(token);
  
  if (!decoded) {
    return 0;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  const timeRemaining = decoded.exp - currentTime;
  
  return Math.max(0, timeRemaining);
};
