import type { Clients } from "@/api/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ClientsTableProps {
  data: Clients[]
}

export default function ClientsTable({ data }: ClientsTableProps) {

  return (
    <Table>
      <TableCaption>A list of your clients</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>CreatedAt</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.id}</TableCell>
            <TableCell>{client.name}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>{client.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}