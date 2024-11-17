// auth.js
export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return payload.exp > Date.now() / 1000; // Check if token is expired
  } catch (e) {
    console.error("Invalid token", e);
    return false;
  }
};

export const login = (token) => {
  localStorage.setItem('token', token);
};

export const logout = () => {
  localStorage.removeItem('token');
};
