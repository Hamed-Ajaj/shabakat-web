import { Skeleton } from "../../../components/ui/skeleton";
import { SectionCard } from "../../../shared/components/SectionCard";

export function InvoicesPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-64 flex-1">
            <Skeleton className="mb-1.5 h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="min-w-48">
            <Skeleton className="mb-1.5 h-3 w-20" />
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>
          <div className="min-w-44">
            <Skeleton className="mb-1.5 h-3 w-24" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
          <div className="min-w-44">
            <Skeleton className="mb-1.5 h-3 w-24" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-36" />
      </div>

      <SectionCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px]">
            <thead>
              <tr className="border-b border-white/8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <th key={index} className="px-4 py-3.5">
                    <Skeleton className="h-4 w-24" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-white/8">
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/8 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2 self-end md:self-auto">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
