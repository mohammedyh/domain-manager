import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-zinc-100 p-[3px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "focus-visible:outline-ring inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent border-zinc-200 px-2 py-1 text-sm font-medium whitespace-nowrap text-zinc-950 transition-[color,box-shadow] focus-visible:border-zinc-950 focus-visible:ring-[3px] focus-visible:ring-zinc-950/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:border-zinc-800 dark:dark:text-zinc-400 dark:text-zinc-50 dark:text-zinc-500 dark:focus-visible:border-zinc-300 dark:focus-visible:ring-zinc-300/50 dark:dark:data-[state=active]:border-zinc-800 dark:data-[state=active]:border-zinc-200 dark:dark:data-[state=active]:bg-zinc-800/30 dark:data-[state=active]:bg-zinc-200/30 dark:data-[state=active]:bg-zinc-950 dark:dark:data-[state=active]:text-zinc-50 dark:data-[state=active]:text-zinc-950 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
