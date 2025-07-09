import { useState } from "react";
import { Toaster } from "sonner";

import ErrorScreen from "@/components/error-screen";
import Header from "@/components/header";
import LoadingSkeleton from "@/components/loading-skeleton";
import Stats from "@/components/stats";
import DomainsTable from "@/components/domains-table";
import { useDomains } from "@/hooks/use-domains";
import { useTheme } from "@/components/theme-provider";

function App() {
  const { data, error, isLoading } = useDomains();
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();

  if (error) return <ErrorScreen />;
  if (isLoading) return <LoadingSkeleton type="dashboard" />;

  return (
    <main className="p-8">
      <Header showModal={showModal} setShowModal={setShowModal} />
      <Stats domains={data.domains} />
      <DomainsTable domains={data.domains} setShowModal={setShowModal} />
      <Toaster theme={theme} />
    </main>
  );
}

export default App;
