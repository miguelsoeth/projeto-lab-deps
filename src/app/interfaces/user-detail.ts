export interface UserDetail {
    id: string;
    fullName: string;
    document: string;
    email: string;
    roles: string[];
    phoneNumber: string;
    twoFacotrEnabled: boolean;
    phoneNumberConfirmed: boolean;
    accessFailedCount: number;
    lockedOut: boolean;
}
