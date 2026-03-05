// src/context/AuthContext.jsx
import { useUser, useAuth, useClerk } from "@clerk/clerk-react";
import { createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <AuthContext.Provider value={{ user, isLoaded, isSignedIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => useContext(AuthContext);