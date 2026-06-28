/* Skeleton primitives for the admin panel */

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <div className="mb-5 flex items-center justify-between">
        <Bone className="h-3 w-20" />
        <Bone className="h-10 w-10 rounded-2xl" />
      </div>
      <Bone className="h-9 w-24" />
      <Bone className="mt-2 h-3 w-32" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  const widths = ["w-2/5", "w-1/5", "w-1/5", "w-1/6"];
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      <Bone className="h-12 w-12 shrink-0 rounded-2xl" />
      <div className="flex flex-1 items-center gap-4">
        {Array.from({ length: cols - 1 }).map((_, i) => (
          <Bone key={i} className={`h-3 ${widths[i + 1] ?? "w-1/6"}`} />
        ))}
      </div>
    </div>
  );
}

export function ProductTableSkeleton() {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-start gap-3">
              <Bone className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-2/3" />
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-4/5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <div className="flex gap-2">
                <Bone className="h-6 w-16 rounded-full" />
                <Bone className="h-6 w-14" />
              </div>
              <div className="flex gap-2">
                <Bone className="h-8 w-8 rounded-xl" />
                <Bone className="h-8 w-8 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 divide-y divide-white/10 lg:block">
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRowSkeleton key={i} cols={4} />
        ))}
      </div>
    </>
  );
}

export function EventTableSkeleton() {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-start gap-3">
              <Bone className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-2/3" />
                <Bone className="h-3 w-1/3" />
                <Bone className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 divide-y divide-white/10 lg:block">
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRowSkeleton key={i} cols={4} />
        ))}
      </div>
    </>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Bone className="h-4 w-28" />
          <Bone className="h-3 w-36" />
          <Bone className="h-3 w-24" />
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Bone className="h-9 w-32 rounded-2xl" />
          <Bone className="h-9 w-20 rounded-2xl" />
        </div>
      </div>
      <Bone className="mt-4 h-16 rounded-2xl" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Bone className="h-24 w-full rounded-[2rem]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 space-y-3">
        <Bone className="h-6 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between py-3">
            <div className="space-y-2">
              <Bone className="h-3 w-24" />
              <Bone className="h-3 w-32" />
            </div>
            <Bone className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
