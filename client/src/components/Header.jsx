import { UserButton } from "@clerk/clerk-react";
import { Flex, Title } from "@tremor/react";
import PropTypes from "prop-types";
import AddDomainModal from "./AddDomainModal";

export default function Header({ showModal, setShowModal }) {
  return (
    <Flex justifyContent="between">
      <Title>Dashboard</Title>
      <div className="flex items-center">
        <AddDomainModal
          className="mr-7 sm:mr-10 flex items-center"
          buttonText="Add Domain"
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <UserButton afterSignOutUrl="/signin" />
      </div>
    </Flex>
  );
}

Header.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
