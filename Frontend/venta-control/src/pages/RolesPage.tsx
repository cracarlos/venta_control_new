import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Save, Loader2, Plus, Trash2, Pencil } from "lucide-react"
import { getGroups, getPermissions, putGroup, postGroup, deleteGroup } from "@/services/usersServices"
import type { Groups } from "@/types/groups"
import type { Permission } from "@/types/permission"

export const RolesPage = () => {
    const [groups, setGroups] = useState<Groups[]>([])
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null)
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    
    const [isCreating, setIsCreating] = useState(false)
    const [newGroupName, setNewGroupName] = useState("")
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null)
    const [editGroupName, setEditGroupName] = useState("")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [groupsData, permissionsData] = await Promise.all([
                getGroups(),
                getPermissions()
            ])
            setGroups(groupsData)
            setPermissions(permissionsData)
        } catch (error) {
            console.error('Error loading data:', error)
            setMessage({ type: 'error', text: 'Error al cargar los datos' })
        } finally {
            setLoading(false)
        }
    }

    const groupedPermissions = permissions.reduce((acc, perm) => {
        const key = perm.content_type?.app_label || 'other'
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(perm)
        return acc
    }, {} as Record<string, Permission[]>)

    const handleSelectGroup = (group: Groups) => {
        setSelectedGroup(group)
        setSelectedPermissions(group.permissions || [])
        setEditingGroupId(null)
        setEditGroupName("")
    }

    const handlePermissionChange = (permId: number, checked: boolean) => {
        if (checked) {
            setSelectedPermissions([...selectedPermissions, permId])
        } else {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permId))
        }
    }

    const handleSave = async () => {
        if (!selectedGroup) return

        setSaving(true)
        setMessage(null)

        try {
            await putGroup({
                ...selectedGroup,
                permissions: selectedPermissions
            })
            setMessage({ type: 'success', text: 'Permisos actualizados correctamente' })
            const updatedGroups = groups.map(g =>
                g.id === selectedGroup.id ? { ...g, permissions: selectedPermissions } : g
            )
            setGroups(updatedGroups)
        } catch (error) {
            console.error('Error saving:', error)
            setMessage({ type: 'error', text: 'Error al guardar los permisos' })
        } finally {
            setSaving(false)
        }
    }

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            setMessage({ type: 'error', text: 'Ingresa un nombre para el grupo' })
            return
        }

        setSaving(true)
        setMessage(null)

        try {
            const resp = await postGroup(newGroupName)
            if (resp.status === 201) {
                setMessage({ type: 'success', text: 'Grupo creado correctamente' })
                loadData()
                setNewGroupName("")
                setIsCreating(false)
            } else {
                setMessage({ type: 'error', text: 'Error al crear el grupo' })
            }
        } catch (error) {
            console.error('Error creating group:', error)
            setMessage({ type: 'error', text: 'Error al crear el grupo' })
        } finally {
            setSaving(false)
        }
    }

    const handleStartEdit = (group: Groups, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingGroupId(group.id)
        setEditGroupName(group.name)
        setSelectedGroup(group)
        setSelectedPermissions(group.permissions || [])
    }

    const handleSaveEdit = async () => {
        if (!editGroupName.trim() || !editingGroupId) {
            setMessage({ type: 'error', text: 'Ingresa un nombre para el grupo' })
            return
        }

        setSaving(true)
        setMessage(null)

        try {
            const groupToUpdate = groups.find(g => g.id === editingGroupId)
            if (groupToUpdate) {
                await putGroup({
                    ...groupToUpdate,
                    name: editGroupName
                })
                setMessage({ type: 'success', text: 'Grupo actualizado correctamente' })
                loadData()
                setEditingGroupId(null)
                setEditGroupName("")
            }
        } catch (error) {
            console.error('Error updating group:', error)
            setMessage({ type: 'error', text: 'Error al actualizar el grupo' })
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteGroup = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        
        if (!confirm("¿Estás seguro de eliminar este grupo?")) return

        setSaving(true)
        setMessage(null)

        try {
            await deleteGroup(id)
            setMessage({ type: 'success', text: 'Grupo eliminado correctamente' })
            if (selectedGroup?.id === id) {
                setSelectedGroup(null)
                setSelectedPermissions([])
            }
            loadData()
        } catch (error) {
            console.error('Error deleting group:', error)
            setMessage({ type: 'error', text: 'Error al eliminar el grupo' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="p-4">Cargando...</div>
    }

    return (
        <div className="space-y-4 p-2 md:p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="md:w-1/3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Grupos</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setIsCreating(!isCreating)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardDescription>Selecciona un grupo para editar sus permisos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isCreating && (
                            <div className="flex gap-2 mb-4">
                                <Input
                                    placeholder="Nombre del grupo"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
                                />
                                <Button size="sm" onClick={handleCreateGroup} disabled={saving}>
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                </Button>
                            </div>
                        )}
                        <div className="space-y-2">
                            {groups.map(group => (
                                <div
                                    key={group.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                        selectedGroup?.id === group.id ? 'bg-accent border-primary' : 'hover:bg-accent'
                                    }`}
                                    onClick={() => handleSelectGroup(group)}
                                >
                                    {editingGroupId === group.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <Input
                                                value={editGroupName}
                                                onChange={(e) => setEditGroupName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                                onClick={(e) => e.stopPropagation()}
                                                className="h-8"
                                            />
                                            <Button size="sm" variant="ghost" onClick={handleSaveEdit} disabled={saving}>
                                                <Save className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1">
                                                <span className="font-medium">{group.name}</span>
                                                {group.permissions?.length > 0 && (
                                                    <Badge variant="secondary" className="ml-2 text-xs">
                                                        {group.permissions.length}
                                                    </Badge>
                                                )}
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => handleStartEdit(group, e)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={(e) => handleDeleteGroup(group.id, e)}
                                                disabled={saving}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ))}
                            {groups.length === 0 && (
                                <p className="text-muted-foreground text-sm">No hay grupos disponibles</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:w-2/3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>
                                    Permisos de {selectedGroup?.name || 'Grupo'}
                                </CardTitle>
                                <CardDescription>
                                    Selecciona los permisos para el grupo seleccionado
                                </CardDescription>
                            </div>
                            {selectedGroup && (
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Guardar
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {message && (
                            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message.text}
                            </div>
                        )}
                        {selectedGroup ? (
                            <div className="h-[400px] overflow-y-auto pr-4">
                                <div className="space-y-4">
                                    {Object.entries(groupedPermissions).map(([appLabel, perms]) => (
                                        <div key={appLabel} className="border rounded-lg p-3">
                                            <h4 className="font-medium mb-2 capitalize">{appLabel}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {perms.map(perm => (
                                                    <div key={perm.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`perm-${perm.id}`}
                                                            checked={selectedPermissions.includes(perm.id)}
                                                            onCheckedChange={(checked) => handlePermissionChange(perm.id, checked as boolean)}
                                                        />
                                                        <Label
                                                            htmlFor={`perm-${perm.id}`}
                                                            className="text-sm cursor-pointer"
                                                        >
                                                            {perm.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                Selecciona un grupo para ver sus permisos
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}