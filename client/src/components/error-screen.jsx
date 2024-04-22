import { Button } from "@/components/ui/button";

export default function ErrorScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen">
      <img
        className="pointer-events-none blur-0 my-4 dark:invert dark:hue-rotate-180"
        src="/crashed-error.svg"
        alt="Error"
        width="300"
        height="300"
        loading="lazy"
      />
      <h1 className="mt-8 mb-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
        Something went wrong.
      </h1>
      <p className="mb-6 text-lg text-slate-700 dark:text-slate-300">
        We are sorry for the inconvenience, try again later.
      </p>
      <Button onClick={() => window.location.reload()}>
        <div className="flex items-center">
          <ReloadIcon />
          Reload
        </div>
      </Button>
    </div>
  );
}

function ReloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="mr-[6px] w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
}
