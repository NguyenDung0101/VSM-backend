import { Role } from "@prisma/client";
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role?: Role;
    isActive?: boolean;
    phone?: string;
}
