import { Skeleton } from "@/components/ui/skeleton";
import PropType from "prop-types";

export default function LoadingSkeleton({ type }) {
  if (type === "dashboard") return <DashboardLoadingSkeleton />;
  return <DefaultLoadingSkeleton />;
}

function DashboardLoadingSkeleton() {
  return (
    <Skeleton className="rounded-2xl bg-teal/5 p-8 animate-pulse">
      <Skeleton className="flex justify-between items-center">
        <Skeleton className="h-4 w-28 rounded-lg bg-slate-600/30" />
        <Skeleton className="h-4 w-44 rounded-lg bg-slate-600/30" />
      </Skeleton>

      <Skeleton className="mt-16 h-28 rounded-lg bg-slate-600/30" />
      <Skeleton className="mt-6 h-48 rounded-lg bg-slate-600/30" />
      <Skeleton className="mt-6 h-48 rounded-lg bg-slate-600/30" />
    </Skeleton>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <Skeleton className="rounded-2xl bg-teal/5 p-8 animate-pulse">
      <Skeleton className="h-4 w-1/3 rounded-lg bg-slate-600/30" />
      <Skeleton className="mt-4 h-4 w-3/5 rounded-lg bg-slate-600/30" />
      <Skeleton className="mt-10 h-48 rounded-lg bg-slate-600/30" />
      <Skeleton className="mt-4 h-48 rounded-lg bg-slate-600/30" />
    </Skeleton>
  );
}

LoadingSkeleton.propTypes = {
  type: PropType.string,
};
