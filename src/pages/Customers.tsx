import ClientsTable from "@/components/Clients/ClientsTable";
import { useClient } from "../hooks/useClients";
import ClientSkeleton from "@/components/Clients/ClientSkeleton";
import { PageHeader } from "@/components/page-header";

export default function Customers() {
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
      <PageHeader title="Customers">

      </PageHeader>
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <ClientsTable 
          data={clients}
        />
      </div>
    </>
  )
}