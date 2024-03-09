import { Button } from "@/components/ui/button";
import { Dialog, Transition } from "@headlessui/react";
import { Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";

export default function DomainDeleteModal({
  domainName,
  deleteDomainById,
  domainId,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="px-3 text-xs bg-red-100 border-none hover:bg-red-100"
        onClick={() => setIsOpen(true)}
      >
        <Trash className="h-4 w-4 stroke-red-600" />
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <>
                    <div className="flex justify-between items-center">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete {domainName}
                      </Dialog.Title>

                      <button onClick={() => setIsOpen(false)}>
                        <X className="stroke-slate-500 hover:stroke-slate-800 transition-colors" />
                      </button>
                    </div>

                    <div className="block mt-4">
                      <p className="text-sm text-gray-500">
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
                        className="ml-3"
                        variant="destructive"
                        onClick={() => deleteDomainById(domainId)}
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
  deleteDomainById: PropTypes.func.isRequired,
  domainId: PropTypes.number.isRequired,
};
