import ClientsTable from "@/components/ClientsTable";
import { useClient } from "../hooks/useClients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Main() {
  const { isLoading, isError, clients } = useClient()

  if (isLoading) {
    return (
      <div>Loading...</div>
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
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <ClientsTable 
        data={clients}
      />
    </div>
  )
}