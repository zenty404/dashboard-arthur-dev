"use client";

import { useTransition } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/app/admin/actions";
import { Eye, Trash2 } from "lucide-react";

interface UserRow {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  _count: {
    links: number;
    qrCodes: number;
    monitoredSites: number;
    clients: number;
  };
}

export function UserList({ users }: { users: UserRow[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, username: string) {
    if (!confirm(`Supprimer l'utilisateur "${username}" ?`)) return;
    startTransition(async () => {
      await deleteUser(id);
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead className="text-center hidden sm:table-cell">Liens</TableHead>
          <TableHead className="text-center hidden sm:table-cell">QR</TableHead>
          <TableHead className="text-center hidden sm:table-cell">Sites</TableHead>
          <TableHead className="text-center hidden sm:table-cell">Clients</TableHead>
          <TableHead className="hidden md:table-cell">Inscrit le</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role === "admin" ? "Admin" : "Utilisateur"}
              </Badge>
            </TableCell>
            <TableCell className="text-center hidden sm:table-cell">{user._count.links}</TableCell>
            <TableCell className="text-center hidden sm:table-cell">{user._count.qrCodes}</TableCell>
            <TableCell className="text-center hidden sm:table-cell">{user._count.monitoredSites}</TableCell>
            <TableCell className="text-center hidden sm:table-cell">{user._count.clients}</TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/users/${user.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(user.id, user.username)}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
