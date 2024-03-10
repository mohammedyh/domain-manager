import DomainInfoModal from "@/components/DomainInfoModal";
import ErrorScreen from "@/components/ErrorScreen";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
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
import dayjs from "dayjs";
import { Clock7, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import DomainDeleteModal from "./components/DeleteDomainModal";

function App() {
  const { data, error, isLoading } = useFetchAllDomains();
  const [showModal, setShowModal] = useState(false);

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
            <button
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-75"
              onClick={() => setShowModal(true)}
            >
              Add a Domain
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableRow key={id}>
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
                        <Badge className="bg-red-200 text-red-800 hover:bg-red-200 hover:text-red-800">
                          <span className="font-medium">Expired</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-green-200 text-green-800 hover:bg-green-200 hover:text-green-800">
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
      <Toaster />
    </main>
  );
}

export default App;
