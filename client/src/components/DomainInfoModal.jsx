import { useAuth } from "@clerk/clerk-react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import {
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import dayjs from "dayjs";
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
                      </div>
                      <DomainInfoTabs data={domainDetails} />
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
  console.log(data);
  return (
    <Tab.Group as="div" className="mt-6">
      <Tab.List className="space-x-5 border-b border-gray-200">
        <Tab className="ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors">
          DNS Records
        </Tab>
        <Tab className="ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors">
          SSL Info
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <Table className="mt-5">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Value</TableHeaderCell>
                <TableHeaderCell>TTL</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.records?.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.type}</TableCell>
                  <TableCell className="whitespace-normal max-w-5xl">
                    {record.value}
                  </TableCell>
                  <TableCell>{record.ttl}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tab.Panel>
        <Tab.Panel>
          {!data.sslInfo.validFrom || !data.sslInfo.validTo ? (
            <div className="my-6 flex flex-col justify-center text-center items-center">
              <img
                src="https://illustrations.popsy.co/violet/falling.svg"
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
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Days Remaining</TableHeaderCell>
                  <TableHeaderCell>Valid</TableHeaderCell>
                  <TableHeaderCell>Valid From</TableHeaderCell>
                  <TableHeaderCell>Valid To</TableHeaderCell>
                  <TableHeaderCell>Valid For</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{data?.sslInfo?.daysRemaining}</TableCell>
                  <TableCell className="whitespace-normal max-w-5xl">
                    {data?.sslInfo?.valid ? "Yes" : "No"}
                  </TableCell>
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
      sslInfo: PropTypes.shape({
        daysRemaining: PropTypes.number,
        valid: PropTypes.bool,
        validFor: PropTypes.array,
        validFrom: PropTypes.string,
        validTo: PropTypes.string,
      }),
    }),
  ]),
};
