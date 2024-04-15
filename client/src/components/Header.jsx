import { UserButton } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import AddDomainModal from "./AddDomainModal";
import { ModeToggle } from "./ThemeToggle";

export default function Header({ showModal, setShowModal }) {
  return (
    <div className="flex justify-between">
      <h1 className="font-medium text-xl dark:text-slate-200">Dashboard</h1>
      <div className="flex items-center">
        <AddDomainModal
          className="mr-6 flex items-center text-xs sm:text-sm"
          buttonText="Add Domain"
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <ModeToggle />
        <UserButton afterSignOutUrl="/signin" />
      </div>
    </div>
  );
}

Header.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
