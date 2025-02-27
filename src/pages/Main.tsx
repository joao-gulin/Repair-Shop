import ClientsTable from "@/components/ClientsTable";
import { useClient } from "../hooks/useClients";
import ClientSkeleton from "@/components/ClientSkeleton";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Main() {
  const { isLoading, isError, clients } = useClient()

  if (isLoading) {
    return (
      <ClientSkeleton />
    )
  }

  if (isError) {
    return (
      <div>Error...</div>
    )
  }

  if (!clients) {
    return <div>No clients available.</div>;
  }

  return (
    <>
        <div className="p-6 max-w-4xl mx-auto space-y-4">
          <ClientsTable 
            data={clients}
          />
        </div>
    </>
  )
}