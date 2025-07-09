import dayjs from "dayjs";

import DomainDeleteModal from "@/components/delete-domain-modal";
import DomainInfoModal from "@/components/domain-info-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DomainsTable({ domains, setShowModal }) {
  return (
    <Card className="mt-8 h-full">
      {!domains.length ? (
        <div className="flex flex-col items-center justify-center rounded-md bg-white py-12 dark:bg-zinc-950">
          <h2 className="z-10 text-xl font-semibold text-gray-700 dark:text-zinc-50">
            You {"don't"} have any domains yet!
          </h2>
          <img
            className="blur-0 pointer-events-none my-4 dark:hue-rotate-180 dark:invert"
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
            {domains.map(
              ({ id, domainName, expiryDate, registeredDate, registrar, updatedDate }) => (
                <TableRow className="dark:border-b-zinc-800" key={id}>
                  <TableCell>{domainName}</TableCell>
                  <TableCell>{dayjs(expiryDate).format("DD-MM-YYYY")}</TableCell>
                  <TableCell>{dayjs(registeredDate).format("DD-MM-YYYY")}</TableCell>
                  <TableCell>{dayjs(updatedDate).format("DD-MM-YYYY")}</TableCell>
                  <TableCell>
                    {dayjs(expiryDate).isBefore() ? (
                      <Badge className="border-0 bg-red-200 text-red-800 hover:bg-red-200 hover:text-red-800 dark:bg-red-600/50 dark:text-zinc-200 dark:hover:bg-red-600/60">
                        <span className="font-medium">Expired</span>
                      </Badge>
                    ) : (
                      <Badge className="border-0 bg-green-200 text-green-800 hover:bg-green-200 dark:bg-green-200 dark:text-green-800 dark:hover:bg-green-200">
                        <span className="font-medium">Active</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{registrar}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <DomainInfoModal buttonText="View Info" domainName={domainName} />

                      <DomainDeleteModal domainName={domainName} domainId={id} />
                    </div>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

export default DomainsTable;
