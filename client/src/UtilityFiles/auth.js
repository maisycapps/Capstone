export const isAuthenticated = () => {
  const token = localStorage.getItem("token"); //gets token from local storage
  if (!token) return false;

  const decodedToken = decodedToken(token);
  const currentTime = Date.now() / 1000; //get current time in seconds
  return decodedToken && decodedToken.exp > currentTime; //checks if token is expired
};

//function to decode JWT token
const decodedToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split("."[1])));
    return payload;
  } catch (error) {
    return null;
  }
};