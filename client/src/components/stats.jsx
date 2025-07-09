import dayjs from "dayjs";
import { Clock7, Globe, Lock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Stats({ domains }) {
  const domainsExpiringThisMonth = domains.filter((domain) =>
    dayjs().isSame(dayjs(domain.expiryDate).format("YYYY-MM-DD"), "month")
  );
  const sslCertsExpiringThisMonth = domains.filter(
    (domain) =>
      domain.sslInfo &&
      dayjs().isSame(dayjs(domain.sslInfo.validTo).format("YYYY-MM-DD"), "month")
  );

  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Total Domains</CardTitle>
          <Globe className="h-4 w-4 stroke-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-2xl font-bold">{domains.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Domains Expiring this Month</CardTitle>
          <Clock7 className="h-4 w-4 stroke-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-2xl font-bold">{domainsExpiringThisMonth.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">SSLs Expiring this Month</CardTitle>
          <Lock className="h-4 w-4 stroke-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-2xl font-bold">{sslCertsExpiringThisMonth.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Stats;
