import config from '../../../config';
export const checkForLogin = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error: "Network error. Please try again later." };
    }
  };
  
 export const goForSignUp = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, error: "Network error. Please try again later." };
    }
  };
