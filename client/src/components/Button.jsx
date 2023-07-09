import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

export default function Button({ children, className, ...props }) {
  const buttonClasses = twMerge(
    "rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-75",
    className
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
