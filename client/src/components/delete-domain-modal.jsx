import { useAuth } from "@clerk/clerk-react";
import { Dialog, Transition } from "@headlessui/react";
import { Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { Fragment, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";

export default function DomainDeleteModal({ domainName, domainId }) {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const deleteButtonRef = useRef(null);

  async function deleteDomainById(id) {
    const deleteDomainRequest = await fetch(`/api/domains/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    const { message } = await deleteDomainRequest.json();
    toast.success(message);
    mutate("/api/domains");
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="px-3"
        onClick={() => setIsOpen(true)}
      >
        <Trash className="h-4 w-4 stroke-red-600" />
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
          initialFocus={deleteButtonRef}
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
            <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
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
                <Dialog.Panel className="w-full max-w-xl transform dark:bg-zinc-900 overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <>
                    <div className="flex justify-between items-center">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 dark:text-zinc-100"
                      >
                        Delete {domainName}
                      </Dialog.Title>

                      <button onClick={() => setIsOpen(false)}>
                        <X className="stroke-zinc-500 dark:stroke-zinc-300 dark:hover:stroke-zinc-100 hover:stroke-zinc-800 transition-colors" />
                      </button>
                    </div>

                    <div className="block mt-4">
                      <p className="text-sm text-gray-500 dark:text-zinc-300">
                        Are you sure you want to delete this domain?
                      </p>
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="ml-3 bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-200 focus:ring-offset-2 dark:bg-red-800 dark:hover:bg-red-900"
                        variant="destructive"
                        onClick={() => deleteDomainById(domainId)}
                        ref={deleteButtonRef}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

DomainDeleteModal.propTypes = {
  domainName: PropTypes.string.isRequired,
  domainId: PropTypes.number.isRequired,
};
