import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "@prisma/client";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            posts: number;
            comments: number;
        };
    }[]>;
    findOne(id: string): Promise<{
        _count: {
            posts: number;
            comments: number;
            events: number;
        };
    } & {
        id: string;
        name: string;
        email: string;
        password: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllForAdmin(role?: string, isActive?: string, keyword?: string, req?: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            posts: number;
            comments: number;
            events: number;
            eventRegistrations: number;
        };
    }[]>;
    updateUserRole(id: string, role: Role, req: any): Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleUserStatus(id: string, req: any): Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserStats(req: any): Promise<{
        overview: {
            total: number;
            active: number;
            inactive: number;
        };
        byRole: Record<string, number>;
        recentUsers: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
        }[];
    }>;
    deleteUserAccount(id: string, req: any): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
