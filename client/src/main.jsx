import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import App from "./App.jsx";
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
    element: <SignIn signUpUrl="/signup" />,
  },
  {
    path: "/signup/",
    element: <SignUp signInUrl="/signin" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
