import { useAuth } from "@clerk/clerk-react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@tremor/react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import Button from "./Button";
import LoadingSkeleton from "./LoadingSkeleton";

export default function DomainInfoModal({ buttonText, domainName }) {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [domainDetails, setDomainDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsOpen(true);
    setIsLoading(true);

    const domainDetailsRequest = await fetch(`/api/domains/${domainName}`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    const domainRecords = await domainDetailsRequest.json();
    setDomainDetails(domainRecords);
    setIsLoading(false);
  }

  return (
    <>
      <Button className="px-3 text-xs" onClick={() => handleClick()}>
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
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : (
                    <>
                      <Flex>
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Domain: {domainDetails.domain}
                        </Dialog.Title>

                        <button onClick={() => setIsOpen(false)}>
                          <X className="stroke-slate-500 hover:stroke-slate-800 transition-colors" />
                        </button>
                      </Flex>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Here are the DNS records and SSL information for{" "}
                          {domainDetails.domain}
                        </p>

                        <Table className="mt-5">
                          <TableHead>
                            <TableRow>
                              <TableHeaderCell>Type</TableHeaderCell>
                              <TableHeaderCell>Value</TableHeaderCell>
                              <TableHeaderCell>TTL</TableHeaderCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {domainDetails?.records?.map((record) => (
                              <TableRow key={record.name}>
                                <TableCell>{record.type}</TableCell>
                                <TableCell className="whitespace-normal max-w-5xl">
                                  {record.value}
                                </TableCell>
                                <TableCell>{record.ttl}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

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
