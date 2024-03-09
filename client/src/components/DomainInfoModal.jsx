import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, Tab, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { useDomain } from "../hooks/useDomain";
import Button from "./Button";
import LoadingSkeleton from "./LoadingSkeleton";

export default function DomainInfoModal({ buttonText, domainName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data } = useDomain(shouldFetch, domainName);

  function handleClick() {
    setShouldFetch(true);
    setIsOpen(true);
  }

  return (
    <>
      <Button className="px-3 text-xs" onClick={handleClick}>
        {buttonText}
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
                  {!data ? (
                    <LoadingSkeleton />
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Domain: {data?.domain}
                        </Dialog.Title>

                        <button onClick={() => setIsOpen(false)}>
                          <X className="stroke-slate-500 hover:stroke-slate-800 transition-colors" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Here are the DNS records and SSL information for{" "}
                          {data?.domain}
                        </p>
                      </div>
                      <DomainInfoTabs data={data} />
                      <div className="mt-4">
                        <Button onClick={() => setIsOpen(false)}>Close</Button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

DomainInfoModal.propTypes = {
  buttonText: PropTypes.string.isRequired,
  domainName: PropTypes.string.isRequired,
};

export function DomainInfoTabs({ data }) {
  const sortedDomainData = data.records.sort((a, b) => a.type > b.type);
  return (
    <Tab.Group as="div" className="mt-6">
      <Tab.List className="space-x-5 border-b border-gray-200">
        <Tab className="ui-selected:border-slate-500 ui-selected:text-slate-600 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors">
          DNS Records
        </Tab>
        <Tab className="ui-selected:border-slate-500 ui-selected:text-slate-600 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors">
          SSL Info
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>TTL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDomainData?.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell className="whitespace-normal max-w-5xl">
                    {record.data}
                  </TableCell>
                  <TableCell>{record.ttl}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tab.Panel>
        <Tab.Panel>
          {!data?.sslInfo.validFrom || !data?.sslInfo.validTo ? (
            <div className="my-6 flex flex-col justify-center text-center items-center">
              <img
                src="/person-falling.svg"
                className="pointer-events-none blur-0 my-2"
                alt="No SSL information available"
                width="250"
                height="250"
                loading="lazy"
              />
              <h2 className="text-2xl font-medium">
                SSL Information Unavailable
              </h2>
              <p className="mt-4 max-w-xl">
                The {"website's"} SSL information could not be displayed. Please
                ensure that the domain has a valid SSL certificate.
              </p>
            </div>
          ) : (
            <Table className="mt-5">
              <TableHeader>
                <TableRow>
                  <TableHead>Days Remaining</TableHead>
                  <TableHead>Valid</TableHead>
                  <TableHead>Valid From</TableHead>
                  <TableHead>Valid To</TableHead>
                  <TableHead>Valid For</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{data?.sslInfo?.daysRemaining}</TableCell>
                  <TableCell>{data?.sslInfo?.valid ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {dayjs(data?.sslInfo?.validFrom).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {dayjs(data?.sslInfo?.validTo).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {data?.sslInfo?.validFor?.length > 1
                      ? data?.sslInfo?.validFor.join(", ")
                      : data?.sslInfo?.validFor}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
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
