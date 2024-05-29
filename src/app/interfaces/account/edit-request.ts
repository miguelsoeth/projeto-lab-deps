export interface EditRequest {
    email?: string | null;
    fullName?: string | null;
    document?: string | null;
    roles?: string[] | null;
    password?: string | null;
    disabled?: boolean | null;
}