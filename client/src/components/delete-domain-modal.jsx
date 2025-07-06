import { useAuth } from "@clerk/clerk-react";
import { Trash } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DomainDeleteModal({ domainName, domainId }) {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger
          className="h-9 rounded-md px-3 bg-red-100 text-zinc-50 cursor-pointer hover:bg-red-200/90 dark:bg-red-400/15 dark:text-zinc-50 dark:hover:bg-red-400/20"
          onClick={() => setIsOpen(true)}
        >
          <Trash className="h-4 w-4 stroke-red-600" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium text-gray-900 dark:text-zinc-100">
              Delete {domainName}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this domain?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDomainById(domainId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

DomainDeleteModal.propTypes = {
  domainName: PropTypes.string.isRequired,
  domainId: PropTypes.number.isRequired,
};
