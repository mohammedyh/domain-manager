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
import { useFetchAllDomains } from "@/hooks/useFetchAllDomains";

function App() {
  const { data, error, isLoading } = useFetchAllDomains();
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();

  if (error) return <ErrorScreen />;
  if (isLoading) return <LoadingSkeleton type="dashboard" />;

  const domainsExpiringThisMonth = data.domains.filter((domain) =>
    dayjs().isSame(dayjs(domain.expiryDate).format("YYYY-MM-DD"), "month")
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
            <Globe className="h-4 w-4 stroke-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-2xl font-bold">{data.domains.length}</div>
            <p className="mt-1 text-xs text-slate-600">+100% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Domains Expiring this Month
            </CardTitle>
            <Clock7 className="h-4 w-4 stroke-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-2xl font-bold">
              {domainsExpiringThisMonth.length}
            </div>
            <p className="mt-1 text-xs text-slate-600">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              SSLs Expiring this Month
            </CardTitle>
            <Lock className="h-4 w-4 stroke-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-2xl font-bold">12</div>
            <p className="mt-1 text-xs text-slate-600">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="h-full mt-8">
        {!data.domains.length ? (
          <div className="flex flex-col items-center justify-center rounded-md bg-white py-12">
            <h2 className="z-10 text-xl font-semibold text-gray-700">
              You {"don't"} have any domains yet!
            </h2>
            <img
              alt="No domains have been created yet"
              loading="lazy"
              width="250"
              height="250"
              className="pointer-events-none blur-0 my-4"
              src="/product-launch.svg"
            />
            <Button onClick={() => setShowModal(true)}>Add a Domain</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="dark:border-b-slate-800">
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
                  <TableRow className="dark:border-b-slate-800" key={id}>
                    <TableCell>{domainName}</TableCell>
                    <TableCell>
                      {dayjs(expiryDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {dayjs(registeredDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {dayjs(updatedDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {dayjs(expiryDate).isBefore() ? (
                        <Badge className="bg-red-200 text-red-800 dark:bg-red-600/50 dark:text-slate-200 dark:hover:bg-red-600/60 hover:bg-red-200 hover:text-red-800">
                          <span className="font-medium">Expired</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-green-200 text-green-800 dark:bg-green-200 dark:text-slate-800 hover:bg-green-200 hover:text-green-800">
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
