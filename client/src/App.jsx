import dayjs from "dayjs";
import { Clock7, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";

import DomainDeleteModal from "@/components/delete-domain-modal";
import DomainInfoModal from "@/components/domain-info-modal";
import ErrorScreen from "@/components/error-screen";
import Header from "@/components/header";
import LoadingSkeleton from "@/components/loading-skeleton";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchAllDomains } from "@/hooks/use-fetch-all-domains";

function App() {
  const { data, error, isLoading } = useFetchAllDomains();
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();

  if (error) return <ErrorScreen />;
  if (isLoading) return <LoadingSkeleton type="dashboard" />;

  const domainsExpiringThisMonth = data.domains.filter((domain) =>
    dayjs().isSame(dayjs(domain.expiryDate).format("YYYY-MM-DD"), "month")
  );
  const validSSLCerts = data.sslInfo.filter(
    (cert) => cert.status !== "rejected"
  );
  const sslCertsExpiringThisMonth = validSSLCerts.filter((ssl) =>
    dayjs().isSame(dayjs(ssl.value.validTo).format("YYYY-MM-DD"), "month")
  );
  return (
    <main className="p-8">
      <Header showModal={showModal} setShowModal={setShowModal} />

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Total Domains
            </CardTitle>
            <Globe className="h-4 w-4 stroke-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-2xl font-bold">{data.domains.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Domains Expiring this Month
            </CardTitle>
            <Clock7 className="h-4 w-4 stroke-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-2xl font-bold">
              {domainsExpiringThisMonth.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              SSLs Expiring this Month
            </CardTitle>
            <Lock className="h-4 w-4 stroke-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-2xl font-bold">
              {sslCertsExpiringThisMonth.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-full mt-8">
        {!data.domains.length ? (
          <div className="flex flex-col items-center justify-center rounded-md bg-white dark:bg-zinc-950 py-12">
            <h2 className="z-10 text-xl font-semibold text-gray-700 dark:text-zinc-50">
              You {"don't"} have any domains yet!
            </h2>
            <img
              className="pointer-events-none blur-0 my-4 dark:invert dark:hue-rotate-180"
              src="/product-launch.svg"
              alt="No domains have been created yet"
              width="250"
              height="250"
              loading="lazy"
            />
            <Button onClick={() => setShowModal(true)}>Add a Domain</Button>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-100/50 dark:bg-zinc-800/50">
              <TableRow className="dark:border-b-zinc-800">
                <TableHead>Domain</TableHead>
                <TableHead>Expires On</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead>Updated On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registrar</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.domains.map(
                ({
                  id,
                  domainName,
                  expiryDate,
                  registeredDate,
                  registrar,
                  updatedDate,
                }) => (
                  <TableRow className="dark:border-b-zinc-800" key={id}>
                    <TableCell>{domainName}</TableCell>
                    <TableCell>
                      {dayjs(expiryDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>
                      {dayjs(registeredDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>
                      {dayjs(updatedDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>
                      {dayjs(expiryDate).isBefore() ? (
                        <Badge className="border-0 bg-red-200 text-red-800 dark:bg-red-600/50 dark:text-zinc-200 dark:hover:bg-red-600/60 hover:bg-red-200 hover:text-red-800">
                          <span className="font-medium">Expired</span>
                        </Badge>
                      ) : (
                        <Badge className="border-0 bg-green-200 text-green-800 dark:bg-green-200 dark:text-green-800 hover:bg-green-200 dark:hover:bg-green-200">
                          <span className="font-medium">Active</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{registrar}</TableCell>
                    <TableCell>
                      <div className="flex justify-end items-center space-x-2">
                        <DomainInfoModal
                          buttonText="View Info"
                          domainName={domainName}
                        />

                        <DomainDeleteModal
                          domainName={domainName}
                          domainId={id}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </Card>
      <Toaster theme={theme} />
    </main>
  );
}

export default App;
