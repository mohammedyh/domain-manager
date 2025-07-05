import { UserButton } from "@clerk/clerk-react";
import PropTypes from "prop-types";

import AddDomainModal from "@/components/add-domain-modal";
import { ModeToggle } from "@/components/theme-toggle";

export default function Header({ showModal, setShowModal }) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="font-medium mr-4 md:mr-6 md:text-xl dark:text-zinc-200">
        Dashboard
      </h1>
      <div className="flex items-center">
        <AddDomainModal
          className="mr-4 md:mr-6 flex items-center text-xs sm:text-sm"
          buttonText="Add Domain"
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}

Header.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
