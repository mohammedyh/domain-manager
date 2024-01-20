import { useAuth } from "@clerk/clerk-react";
import {
  Badge,
  Card,
  Flex,
  Icon,
  Metric,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@tremor/react";
import dayjs from "dayjs";
import { Box, Clock4, ShieldAlert, Trash } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { mutate } from "swr";
import DomainInfoModal from "./components/DomainInfoModal";
import ErrorScreen from "./components/ErrorScreen";
import Header from "./components/Header";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { useFetchAllDomains } from "./hooks/useFetchAllDomains";
import {
  Card as NewCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Clock7 } from "lucide-react";
import { Globe } from "lucide-react";

function App() {
  const { getToken } = useAuth();
  const { data, error, isLoading } = useFetchAllDomains();
  const [showModal, setShowModal] = useState(false);

  async function deleteDomainById(id) {
    const deleteDomainRequest = await fetch(`/api/domains/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    const { message } = await deleteDomainRequest.json();
    toast.success(message);
    mutate("/api/domains");
  }

  if (error) return <ErrorScreen />;
  if (isLoading) return <LoadingSkeleton type="dashboard" />;

  return (
    <main className="p-8">
      <Header showModal={showModal} setShowModal={setShowModal} />

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NewCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 stroke-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-2xl font-bold">{data.domains.length}</div>
            <p className="mt-1 text-xs text-slate-600">
              +100% from last month
            </p>
          </CardContent>
        </NewCard>

        <NewCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Expiring this Month
            </CardTitle>
            <Clock7 className="h-4 w-4 stroke-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-2xl font-bold">23</div>
            <p className="mt-1 text-xs text-slate-600">
              +180.1% from last month
            </p>
          </CardContent>
        </NewCard>

        <NewCard>
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
        </NewCard>
      </div>

      <Card className="h-full mt-6">
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
            <TableHead>
              <TableRow>
                <TableHeaderCell>Domain</TableHeaderCell>
                <TableHeaderCell>Expires On</TableHeaderCell>
                <TableHeaderCell>Registered On</TableHeaderCell>
                <TableHeaderCell>Updated On</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Registrar</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Actions
                </TableHeaderCell>
              </TableRow>
            </TableHead>

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
                        <Badge color="red" size="xs">
                          <span className="font-medium">Expired</span>
                        </Badge>
                      ) : (
                        <Badge color="green" size="xs">
                          <span className="font-medium">Active</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{registrar}</TableCell>
                    <TableCell>
                      <Flex justifyContent="end" className="space-x-2">
                        <DomainInfoModal
                          buttonText="View Domain Info"
                          domainName={domainName}
                        />

                        <button onClick={() => deleteDomainById(id)}>
                          <Icon
                            icon={Trash}
                            variant="light"
                            size="md"
                            color="red"
                          />
                        </button>
                      </Flex>
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
