import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { domainSchema } from "@/lib/schema";
import { useAuth } from "@clerk/clerk-react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

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
          <kbd className="rounded ml-3 bg-slate-500/50 dark:bg-slate-900 dark:text-slate-100 px-2 py-0.5 text-xs font-light text-indigo-100">
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
            <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50" />
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
                <Dialog.Panel className="w-full max-w-2xl transform dark:bg-slate-900 overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between">
                    <Dialog.Title
                      as="h2"
                      className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100"
                    >
                      Add a Domain
                    </Dialog.Title>

                    <button onClick={() => setShowModal(false)}>
                      <X className="stroke-slate-500 dark:stroke-slate-300 dark:hover:stroke-slate-100 hover:stroke-slate-800 transition-colors" />
                    </button>
                  </div>

                  <form onSubmit={handleFormSubmit}>
                    <div className="mt-4">
                      <label className="text-sm text-slate-600 dark:text-slate-300">
                        Domain Name
                        <Input
                          className="mt-1"
                          placeholder="e.g. mohammedcodes.dev"
                          name="domain"
                          ref={modalInputRef}
                        />
                      </label>
                      {!!error && (
                        <p className="text-sm text-red-500 mt-2">{error}</p>
                      )}
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
