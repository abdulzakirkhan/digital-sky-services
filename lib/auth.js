// Simulating login authentication logic
export const loginUser = async (email, password) => {
    if (email === "user@example.com" && password === "password123") {
      localStorage.setItem("isLoggedIn", "true");
      return true;
    }
    return false;
  };
  
  export const logoutUser = () => {
    localStorage.removeItem("isLoggedIn");
  };
  