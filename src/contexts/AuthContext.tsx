import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { apiGet } from "@/utils/apiClient";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      // Try to get stats endpoint which requires authentication
      await apiGet("/check-auth");
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      console.error("error: ", error);
      
    } finally {
      setIsLoading(false);
      console.log(`isLoading: ${isLoading}`);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Clear any local storage
    localStorage.removeItem("statsTotals");
    // Redirect to login
    router.push("/login");
  };

  useEffect(() => {
    console.log("AuthContext Jalan");
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
