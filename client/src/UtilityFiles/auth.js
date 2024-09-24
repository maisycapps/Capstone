//function to decode JWT token
const decodedToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Correct token decoding
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token"); //gets token from local storage
  if (!token) return false;

  const decoded = decodedToken(token);
  const currentTime = Date.now() / 1000; //get current time in seconds
  return decoded && decoded.exp > currentTime; //checks if token is expired
};
