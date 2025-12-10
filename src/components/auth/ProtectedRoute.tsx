import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedRoute Jalan");
    
    if (!isAuthenticated && !isLoading) {
      // Save the attempted URL to redirect back after login
      // pop up saying you have to login first
      alert("Silahkan login terlebih dahulu untuk mengakses halaman dashboard.");
      const returnUrl = router.asPath;
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      );
    }

  // Don't render children if not authenticated (router will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render the protected content
  return <>{children}</>;
}
