import { Skeleton } from "../../../components/ui/skeleton";
import { SectionCard } from "../../../shared/components/SectionCard";

export function SubscribersPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
          <div className="flex min-w-72 flex-1 gap-2">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
          <Skeleton className="h-10 min-w-full rounded-xl xl:min-w-56" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-36" />
      </div>

      <SectionCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
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
