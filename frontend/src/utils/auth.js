export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const expiration = localStorage.getItem("tokenExpiration");

  const isTokenValid = token && (!expiration || new Date().getTime() < expiration);

  return isTokenValid;
};
