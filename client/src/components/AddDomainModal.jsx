import { useAuth } from "@clerk/clerk-react";
import { Dialog, Transition } from "@headlessui/react";
import { Flex, TextInput } from "@tremor/react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { domainSchema } from "../lib/schema";
import Button from "./Button";

export default function AddDomainModal({
  buttonText,
  showModal,
  setShowModal,
  className,
}) {
  const modalInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { getToken } = useAuth();

  const onKeyDown = useCallback(
    (event) => {
      const existingOpenModal = document.querySelector(
        '[data-headlessui-state="open"]'
      );
      const openClerkModal = document.querySelector(".cl-modalBackdrop");
      if (
        event.key !== "a" ||
        showModal ||
        existingOpenModal ||
        openClerkModal
      ) {
        return;
      }

      event.preventDefault();
      setShowModal(true);
    },
    [showModal, setShowModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  async function handleFormSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const domainName = await domainSchema.validate(formData.get("domain"));

      const addDomainRequest = await fetch("/api/domains/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ domainName }),
      });
      const { message } = await addDomainRequest.json();

      if (!addDomainRequest.ok) {
        setIsSubmitting(false);
        toast.error(message);
        event.target.reset();
        return;
      }

      toast.success(message);
      mutate("/api/domains");
      setShowModal(false);
      setIsSubmitting(false);
      setError("");
    } catch (error) {
      setIsSubmitting(false);
      setError(error.message);
    }
  }

  return (
    <>
      <div>
        <Button className={className} onClick={() => setShowModal(true)}>
          {buttonText}
          <kbd className="rounded ml-3 bg-indigo-400/60 px-2 py-0.5 text-xs font-light text-indigo-100">
            A
          </kbd>
        </Button>
      </div>

      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowModal(false)}
          initialFocus={modalInputRef}
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
                  <Flex>
                    <Dialog.Title
                      as="h2"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Add a Domain
                    </Dialog.Title>

                    <button onClick={() => setShowModal(false)}>
                      <X className="stroke-slate-500 hover:stroke-slate-800 transition-colors" />
                    </button>
                  </Flex>

                  <form onSubmit={handleFormSubmit}>
                    <div className="mt-4">
                      <label className="text-sm text-slate-600">
                        Domain Name
                        <TextInput
                          className="mt-1 ring-indigo-500 focus-within:ring-1"
                          placeholder="e.g. mohammedcodes.dev"
                          name="domain"
                          error={!!error}
                          errorMessage={error}
                          ref={modalInputRef}
                        />
                      </label>
                    </div>

                    <div className="mt-4">
                      <Button type="submit">
                        {isSubmitting ? "Adding Domain..." : "Add Domain"}
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

AddDomainModal.propTypes = {
  buttonText: PropTypes.string.isRequired,
  className: PropTypes.string,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
