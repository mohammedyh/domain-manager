import { useUser } from "@clerk/clerk-react";
import "./App.css";

function App() {
  const { user } = useUser();
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        <img
          style={{ borderRadius: "50%" }}
          src={user?.imageUrl}
          alt="Profile image"
          width="75"
          height="75"
        />
        <p style={{ fontSize: "18px" }}>
          {user?.primaryEmailAddress?.emailAddress}
        </p>
      </div>
    </>
  );
}

export default App;
