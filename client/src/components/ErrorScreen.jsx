import Button from "./Button";

export default function ErrorScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen">
      <img
        src="/crashed-error.svg"
        alt="Error"
        width="300"
        height="300"
        loading="lazy"
      />
      <h1 className="mt-8 mb-4 text-3xl font-semibold text-slate-900">
        Something went wrong.
      </h1>
      <p className="text-lg text-slate-700 mb-6">
        We are sorry for the inconvenience, try again later.
      </p>
      <Button onClick={() => window.location.reload()}>Go Back Home</Button>
    </div>
  );
}
