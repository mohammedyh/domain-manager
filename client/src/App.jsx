import { UserButton, useAuth } from "@clerk/clerk-react";
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
  Title,
} from "@tremor/react";
import dayjs from "dayjs";
import { Box, Clock4, ShieldAlert, Trash } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import useSWR, { mutate } from "swr";
import AddDomainModal from "./components/AddDomainModal";
import DomainInfoModal from "./components/DomainInfoModal";
import ErrorScreen from "./components/ErrorScreen";
import LoadingSkeleton from "./components/LoadingSkeleton";

function App() {
  const { getToken } = useAuth();
  const fetcher = async (url) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }).then((res) => res.json());

  const { data, error, isLoading } = useSWR("/api/domains", fetcher);
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
  if (isLoading) return <LoadingSkeleton />;

  return (
    <main className="p-8">
      <Toaster />
      <Flex justifyContent="between">
        <Title>Dashboard</Title>
        <div className="flex items-center">
          <AddDomainModal
            className="mr-10"
            buttonText="Add Domain"
            showModal={showModal}
            setShowModal={setShowModal}
          />
          <UserButton afterSignOutUrl="/signin" />
        </div>
      </Flex>

      <Flex className="gap-6 mt-10">
        <Card decoration="top" decorationColor="indigo">
          <Flex justifyContent="start" className="space-x-4">
            <Icon icon={Box} variant="light" size="xl" color="indigo" />
            <div>
              <Text>Total Domains</Text>
              <Metric className="mt-2">{data.domains.length}</Metric>
            </div>
          </Flex>
        </Card>

        <Card decoration="top" decorationColor="indigo">
          <Flex justifyContent="start" className="space-x-4">
            <Icon icon={Clock4} variant="light" size="xl" color="indigo" />
            <div>
              <Text>Domains Expiring This Month</Text>
              <Metric className="mt-2">0</Metric>
            </div>
          </Flex>
        </Card>

        <Card decoration="top" decorationColor="indigo">
          <Flex justifyContent="start" className="space-x-4">
            <Icon icon={ShieldAlert} variant="light" size="xl" color="indigo" />
            <div>
              <Text>Domains SSL Expiring This Month</Text>
              <Metric className="mt-2">0</Metric>
            </div>
          </Flex>
        </Card>
      </Flex>

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
                  <TableRow key={domainName}>
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
    </main>
  );
}

export default App;
