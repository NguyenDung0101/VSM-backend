"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        return this.prisma.user.create({
            data: createUserDto,
        });
    }
    async findAll(role, isActive, keyword) {
        const where = {};
        if (role)
            where.role = role;
        if (isActive === "true" || isActive === "false")
            where.isActive = isActive === "true";
        if (keyword) {
            where.OR = [
                { name: { contains: keyword, mode: "insensitive" } },
                { email: { contains: keyword, mode: "insensitive" } },
            ];
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        posts: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                        comments: true,
                        events: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async remove(id) {
        const user = await this.findById(id);
        return this.prisma.user.delete({
            where: { id },
        });
    }
    async findAllForAdmin(role, isActive, keyword, adminRole) {
        if (adminRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Admin mới có thể xem tất cả tài khoản');
        }
        const where = {};
        if (role && Object.values(client_1.Role).includes(role)) {
            where.role = role;
        }
        if (isActive === "true" || isActive === "false") {
            where.isActive = isActive === "true";
        }
        if (keyword) {
            where.OR = [
                { name: { contains: keyword, mode: "insensitive" } },
                { email: { contains: keyword, mode: "insensitive" } },
            ];
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        posts: true,
                        comments: true,
                        events: true,
                        eventRegistrations: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async updateUserRole(id, role, adminRole) {
        if (adminRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Admin mới có thể thay đổi quyền tài khoản');
        }
        const user = await this.findById(id);
        if (user.id === id && user.role === client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Không thể thay đổi quyền của chính mình');
        }
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async toggleUserStatus(id, adminRole) {
        if (adminRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Admin mới có thể kích hoạt/vô hiệu hóa tài khoản');
        }
        const user = await this.findById(id);
        if (user.id === id && user.role === client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Không thể vô hiệu hóa tài khoản của chính mình');
        }
        return this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async getUserStats(adminRole) {
        if (adminRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Admin mới có thể xem thống kê tài khoản');
        }
        const [totalUsers, activeUsers, usersByRole, recentUsers,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.user.groupBy({
                by: ['role'],
                _count: { role: true },
            }),
            this.prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            }),
        ]);
        const roleStats = usersByRole.reduce((acc, item) => {
            acc[item.role] = item._count.role;
            return acc;
        }, {});
        return {
            overview: {
                total: totalUsers,
                active: activeUsers,
                inactive: totalUsers - activeUsers,
            },
            byRole: roleStats,
            recentUsers,
        };
    }
    async deleteUserAccount(id, adminRole) {
        if (adminRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Admin mới có thể xóa tài khoản');
        }
        const user = await this.findById(id);
        if (user.role === client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Không thể xóa tài khoản Admin');
        }
        return this.prisma.user.delete({
            where: { id },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map