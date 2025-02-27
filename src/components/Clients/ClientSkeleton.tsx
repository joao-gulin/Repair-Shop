import { Skeleton } from "@/components/ui/skeleton";

export default function ClientSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4">
        <Skeleton />
      </div>
    </div>
  );
}
