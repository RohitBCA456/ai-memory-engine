import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth, useClerk } from "@clerk/clerk-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signOut } = useClerk();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the base URL for your User Service
  const USER_SERVICE_URL = "http://localhost:4000/user-service";

  useEffect(() => {
    const syncUserWithDb = async () => {
      if (isUserLoaded && user) {
        try {
          const userData = {
            clerkId: user.id,
            username: user.username || user.fullName || user.firstName,
            email: user.primaryEmailAddress.emailAddress,
            imageUrl: user.imageUrl,
          };

          // Direct fetch to save credentials
          const response = await fetch(`${USER_SERVICE_URL}/save-credentials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          const result = await response.json();
          console.log("Save Credentials Response:", result);

          if (result.success) {
            // We set the user in state; since you aren't using localStorage,
            // ensure your backend is setting an HttpOnly cookie
            console.log("Setting dbUser with data:", result.data);
            setDbUser(result.data);
          }
        } catch (error) {
          console.error("Backend Sync Error:", error);
        } finally {
          setLoading(false);
        }
      } else if (isUserLoaded && !user) {
        setLoading(false);
        setDbUser(null);
      }
    };

    syncUserWithDb();
  }, [user, isUserLoaded]);

const logout = async () => {
  try {
    // 1. Get the token (check if your backend sends 'token' or 'webToken')
    const token = dbUser?.token || dbUser?.webToken; 

    // 2. Call the backend - We only need the Authorization header
    await fetch(`http://localhost:4000/user-service/logout`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}` 
      }
    });

    // 3. Clean up the browser and redirect
    setDbUser(null);
    await signOut({ redirectUrl: "/login" });
    
  } catch (error) {
    console.error("Logout failed:", error);
    // Fallback: Always log out of the UI even if the backend fails
    setDbUser(null);
    await signOut({ redirectUrl: "/login" });
  }
};

  return (
    <AuthContext.Provider value={{ dbUser, setDbUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => useContext(AuthContext);
