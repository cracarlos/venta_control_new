import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUsersStore } from "@/hooks/useUsersStore";
import type { User } from "@/types/user";
import { UserTabletCard } from "./UserTabletCard";
import { useUiStore } from "@/hooks/useUiStore";
import { Button } from "./ui/button";
import { KeyRound, UserRoundPen } from "lucide-react";

export const UserTableList = () => {
    const { _getUsers, _getUserById } = useUsersStore();
    const { _setModalOpen, _setModalName, isLoading } = useUiStore();

    const [users, setUsers] = useState<User[]>([]);

    const getUserList = async () => {
        const resp =  await _getUsers();
        setUsers(resp);
        return resp;
    };

    const getUserById = (userId:any) => {
        _getUserById(userId);
        return userId;
    };

    const handleModal = () => {
        _setModalName('user');
        _setModalOpen(true);
    }
    
    const handleModalResetPassword = () => {
        _setModalName('resetPassword');
        _setModalOpen(true);
    }


    useEffect(() => {
        getUserList();
    }, [isLoading]);
    
  return (
    <UserTabletCard>
        <Table>
            <TableCaption>Usuarios del sistema</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{`${user.first_name} ${user.middle_name} ${user.last_name}`}</TableCell>
                        <TableCell>{user.groups[0]?.name || "Super Usuario"}</TableCell>
                        <TableCell onClick={() => getUserById(user.id)}>
                            <Button variant="outline" onClick={handleModal}>
                                <UserRoundPen />
                            </Button>
                            <Button className="ml-2" variant="outline" onClick={handleModalResetPassword} title="Restablecer contraseña">
                                <KeyRound />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </UserTabletCard>
  )
}
