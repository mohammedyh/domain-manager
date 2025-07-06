import { useAuth } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { domainSchema } from "@/lib/schema";
import { useEffect } from "react";

export default function AddDomainModal({ buttonText, showModal, setShowModal, className }) {
  const modalInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { getToken } = useAuth();

  const onKeyDown = useCallback(
    (event) => {
      const existingOpenDialog = document.querySelector("[data-state=open]");
      const openClerkModal = document.querySelector(".cl-modalBackdrop");
      if (
        (event.key === "a" && event.metaKey) ||
        (event.key === "a" && event.ctrlKey) ||
        event.key !== "a" ||
        existingOpenDialog ||
        openClerkModal
      ) {
        return;
      }

      event.preventDefault();
      setShowModal(true);
    },
    [setShowModal],
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
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <Button className={className} onClick={() => setShowModal(true)}>
            {buttonText}
            <kbd className="ml-3 rounded bg-zinc-500/50 px-2 py-0.5 text-xs font-light text-indigo-100 dark:bg-zinc-900 dark:text-zinc-100">
              A
            </kbd>
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} onCloseAutoFocus={() => setError("")}>
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Add a domain
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form onSubmit={handleFormSubmit} id="add-domain">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="domain" className="text-sm text-zinc-600 dark:text-zinc-300">
                  Name
                </Label>
                <Input
                  id="domain"
                  name="domain"
                  className="text-zinc-900 dark:text-zinc-100"
                  ref={modalInputRef}
                  placeholder="apple.com"
                />
                {!!error && <p className="text-sm text-red-400">{error}</p>}
              </div>
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="add-domain">
              {isSubmitting ? "Adding Domain..." : "Add Domain"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

AddDomainModal.propTypes = {
  buttonText: PropTypes.string.isRequired,
  className: PropTypes.string,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
