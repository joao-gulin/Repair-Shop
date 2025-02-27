import ClientsTable from "@/components/ClientsTable";
import { useClient } from "../hooks/useClients";
import ClientSkeleton from "@/components/ClientSkeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <Tabs defaultValue="clients">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="repairs">Repairs</TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
        <ClientsTable 
          data={clients}
        />
      </TabsContent>
      </Tabs>
    </div>
  )
}