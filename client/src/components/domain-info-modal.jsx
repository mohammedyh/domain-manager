import dayjs from "dayjs";
import { RefreshCw } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

import LoadingSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDomains } from "@/hooks/use-domains";

export default function DomainInfoModal({ buttonText, domainName }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useDomains(isOpen && domainName);

  function handleClick() {
    setIsOpen(true);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="px-3 text-xs dark:bg-zinc-50 dark:text-zinc-900"
            size="sm"
            onClick={handleClick}
          >
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Domain: {domainName}
            </DialogTitle>
            <DialogDescription>
              Here are the DNS records and SSL details for {domainName}
            </DialogDescription>
          </DialogHeader>
          {!data ? (
            <LoadingSkeleton />
          ) : (
            <>
              <DomainInfoTabs data={data} />
            </>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

DomainInfoModal.propTypes = {
  buttonText: PropTypes.string.isRequired,
  domainName: PropTypes.string.isRequired,
};

export function DomainInfoTabs({ data }) {
  function handleRefetch() {
    try {
      mutate(`/api/domains/${data.domain}`);
      toast.success(`Refetched data for ${data.domain}`);
    } catch (error) {
      toast.error(error);
    }
  }

  const sortedDomainData = data?.records?.sort((a, b) => a.type > b.type);
  return (
    <Tabs defaultValue="dns-records">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="dns-records">DNS Records</TabsTrigger>
          <TabsTrigger value="ssl-info">SSL Info</TabsTrigger>
        </TabsList>
        <Button onClick={handleRefetch}>
          <RefreshCw className="mr-1.5 h-4 w-4" />
          Refetch
        </Button>
      </div>

      <TabsContent value="dns-records">
        <Table className="mt-5">
          <TableHeader>
            <TableRow className="dark:border-b-zinc-800">
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>TTL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDomainData?.map((record, index) => (
              <TableRow className="dark:border-b-zinc-800" key={index}>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell className="max-w-lg break-all">{record.data}</TableCell>
                <TableCell>{record.ttl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="ssl-info">
        {!data?.sslInfo?.validFrom || !data?.sslInfo?.validTo ? (
          <div className="my-6 flex flex-col items-center justify-center text-center">
            <img
              className="blur-0 pointer-events-none my-2 dark:hue-rotate-180 dark:invert"
              src="/person-falling.svg"
              alt="No SSL information available"
              width="250"
              height="250"
              loading="lazy"
            />
            <h2 className="text-2xl font-medium">SSL Information Unavailable</h2>
            <p className="mt-4 max-w-xl">
              The {"website's"} SSL information could not be displayed. Please ensure that the
              domain has a valid SSL certificate.
            </p>
          </div>
        ) : (
          <Table className="mt-5">
            <TableHeader>
              <TableRow className="dark:border-b-zinc-800">
                <TableHead>Issuer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Days Remaining</TableHead>
                <TableHead>Valid From</TableHead>
                <TableHead>Valid To</TableHead>
                <TableHead>Valid For</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{data?.sslInfo?.issuer.O ?? "Unknown Issuer"}</TableCell>
                <TableCell className="capitalize">{data?.sslStatus.status}</TableCell>
                <TableCell>{data?.sslInfo?.daysRemaining}</TableCell>
                <TableCell>{dayjs(data?.sslInfo?.validFrom).format("DD-MM-YYYY")}</TableCell>
                <TableCell>{dayjs(data?.sslInfo?.validTo).format("DD-MM-YYYY")}</TableCell>
                <TableCell>
                  {data?.sslInfo?.validFor?.length > 1
                    ? data?.sslInfo?.validFor.join(", ")
                    : data?.sslInfo?.validFor}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  );
}

DomainInfoTabs.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      records: PropTypes.array,
      sslInfo: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          daysRemaining: PropTypes.number,
          valid: PropTypes.bool,
          validFor: PropTypes.array,
          validFrom: PropTypes.string,
          validTo: PropTypes.string,
        }),
      ]),
    }),
  ]),
};
