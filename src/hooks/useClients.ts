import { useQuery } from "@tanstack/react-query";
import { repairShop } from "../api/repairs";

export function useClient() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['clients'],
    queryFn: () => repairShop.fetchClients(),
  })

  return {
    isLoading,
    isError,
    clients: data?.map(client => ({
      id: client.id,
      createdAt: client.createdAt,
      name: client.name,
      phone: client.phone
    })) || [],
  }
}