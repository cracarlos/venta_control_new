export interface Permission {
    id: number;
    name: string;
    codename: string;
    content_type: {
        id: number;
        app_label: string;
        model: string;
    };
}

export interface GroupWithPermissions {
    id: number;
    name: string;
    permissions: number[];
}