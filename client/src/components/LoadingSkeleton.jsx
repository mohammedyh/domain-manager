export default function LoadingSkeleton() {
  return (
    <div className="rounded-2xl bg-teal/5 p-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-28 rounded-lg bg-indigo-600/30" />
        <div className="h-4 w-44 rounded-lg bg-indigo-600/30" />
      </div>

      <div className="mt-16 h-28 rounded-lg bg-indigo-600/30" />
      <div className="mt-6 h-48 rounded-lg bg-indigo-600/30" />
      <div className="mt-6 h-48 rounded-lg bg-indigo-600/30" />
    </div>
  );
}
