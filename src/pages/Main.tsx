import { useClient } from "../hooks/useClients";

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
    <div>
      <
    </div>
  )
}