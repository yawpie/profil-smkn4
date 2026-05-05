import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SEO from "@/components/SEO";
import { merriweatherSans, sourceSerif } from "../fonts";
// import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Check if the current route is a dashboard route or predashboard
  const isDashboardRoute =
    router.pathname.startsWith("/dashboard") ||
    router.pathname === "/predashboard";
  // console.log("isDashboardRoute: "+isDashboardRoute);

  return (
    <>
      <SEO />
      {/* <AuthProvider> */}
        <div className={`${merriweatherSans.variable} ${sourceSerif.variable}`}>
          {isDashboardRoute ? (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      {/* </AuthProvider> */}
    </>
  );
}
