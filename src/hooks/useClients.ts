import { useQuery } from "@tanstack/react-query";
import { repairShop } from "../api/repairs";
import type { Clients } from "../api/types";

export function useClient() {
  const { isLoading, isError, data } = useQuery<Clients>({
    queryKey: ['clients'],
    queryFn: () => repairShop.fetchClients(),
  })

  return {
    isLoading,
    isError,
    clients: data ?? [],
  }
}