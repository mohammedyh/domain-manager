import { useAuth, useUser } from "@clerk/clerk-react";
import { Dialog, Transition } from "@headlessui/react";
import { Button, TextInput } from "@tremor/react";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function Modal({ buttonText, showModal, setShowModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  async function handleFormSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const data = {
      domainName: formData.get("domain"),
      userId: user.id,
    };

    const addDomainRequest = await fetch("/api/domains/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const addDomainResponse = await addDomainRequest.json();
    toast.success(addDomainResponse.message);

    mutate("/api/domains");
    setShowModal(false);
    setIsSubmitting(false);
  }

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-md bg-indigo-600 mr-10 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-75"
        >
          {buttonText}
        </button>
      </div>

      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowModal(false)}
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
            <div className="fixed inset-0 bg-black bg-opacity-30" />
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h2"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Add a Domain
                  </Dialog.Title>

                  <form onSubmit={handleFormSubmit}>
                    <div className="mt-4">
                      <label className="text-sm text-slate-600">
                        Domain Name
                        <TextInput
                          className="mt-1 ring-indigo-500 focus-within:ring-1"
                          placeholder="E.g. mohammedcodes.dev"
                          name="domain"
                        />
                      </label>
                    </div>

                    <div className="mt-4">
                      <Button
                        color="indigo"
                        type="submit"
                        loading={isSubmitting}
                        loadingText="Adding Domain"
                      >
                        Add Domain
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

Modal.propTypes = {
  buttonText: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
