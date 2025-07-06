import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

import App from "@/App";

const routes = [
  {
    path: "/",
    element: (
      <>
        <SignedIn>
          <App />
        </SignedIn>
        <SignedOut>
          <Navigate to="/signin" />
        </SignedOut>
      </>
    ),
  },
  {
    path: "/signin/",
    element: (
      <div className="grid min-h-screen place-content-center">
        <SignIn signUpUrl="/signup" />
      </div>
    ),
  },
  {
    path: "/signup/",
    element: (
      <div className="grid min-h-screen place-content-center">
        <SignUp signInUrl="/signin" />
      </div>
    ),
  },
];

export default routes;
