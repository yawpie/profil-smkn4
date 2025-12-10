import { DashboardTotalsResponse } from "@/types/DashboardTotals";
import { apiGet } from "@/utils/apiClient";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PreDashboardPage() {
    const router = useRouter();
    const returnUrl = router.query.returnUrl as string | undefined;
    useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // 1. Fetch / prepare data
      const res = await apiGet<DashboardTotalsResponse>("/stats");
      const stats = res.data; 
      

      // 2. Save to localStorage (or context, etc.)
      localStorage.setItem("statsTotals", JSON.stringify(stats));

      // 3. Redirect after done
      if (!cancelled) {
        if (returnUrl){
          router.replace(returnUrl); // go to real page
  
        }else {

          router.replace("/dashboard"); // go to real page
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <p>Loading data, please wait...</p>
    </main>
  );
}