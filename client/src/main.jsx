import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import "@fontsource-variable/inter";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import App from "./App";
import "./index.css";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing publishable key");
}

const router = createBrowserRouter([
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
      <div className="grid place-content-center min-h-screen">
        <SignIn signUpUrl="/signup" />
      </div>
    ),
  },
  {
    path: "/signup/",
    element: (
      <div className="grid place-content-center min-h-screen">
        <SignUp signInUrl="/signin" />
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
