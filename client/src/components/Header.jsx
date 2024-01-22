import { UserButton } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import AddDomainModal from "./AddDomainModal";

export default function Header({ showModal, setShowModal }) {
  return (
    <div className="flex justify-between">
      <h1 className="font-medium text-xl">Dashboard</h1>
      <div className="flex items-center">
        <AddDomainModal
          className="mr-7 sm:mr-10 flex items-center text-xs sm:text-sm"
          buttonText="Add Domain"
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <UserButton afterSignOutUrl="/signin" />
      </div>
    </div>
  );
}

Header.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
