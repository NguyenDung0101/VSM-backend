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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(userRole, query) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể xem dashboard');
        }
        const { startDate, endDate, year, month } = query || {};
        const dateFilter = this.createDateFilter(startDate, endDate, year, month);
        const [userStats, eventStats, postStats, registrationStats, recentActivity, monthlyData,] = await Promise.all([
            this.getUserStats(dateFilter),
            this.getEventStats(dateFilter),
            this.getPostStats(dateFilter),
            this.getRegistrationStats(dateFilter),
            this.getRecentActivity(),
            this.getMonthlyData(year),
        ]);
        return {
            overview: {
                users: userStats,
                events: eventStats,
                posts: postStats,
                registrations: registrationStats,
            },
            recentActivity,
            monthlyData,
        };
    }
    createDateFilter(startDate, endDate, year, month) {
        const filter = {};
        if (year && month) {
            const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
            filter.gte = startOfMonth;
            filter.lte = endOfMonth;
        }
        else if (year) {
            const startOfYear = new Date(parseInt(year), 0, 1);
            const endOfYear = new Date(parseInt(year), 11, 31, 23, 59, 59);
            filter.gte = startOfYear;
            filter.lte = endOfYear;
        }
        else {
            if (startDate)
                filter.gte = new Date(startDate);
            if (endDate)
                filter.lte = new Date(endDate);
        }
        return Object.keys(filter).length > 0 ? filter : undefined;
    }
    async getUserStats(dateFilter) {
        const where = dateFilter ? { createdAt: dateFilter } : {};
        const [total, totalUsers, totalEditors, totalAdmins, activeUsers, newUsersThisMonth] = await Promise.all([
            this.prisma.user.count({ where }),
            this.prisma.user.count({ where: { ...where, role: client_1.Role.USER } }),
            this.prisma.user.count({ where: { ...where, role: client_1.Role.EDITOR } }),
            this.prisma.user.count({ where: { ...where, role: client_1.Role.ADMIN } }),
            this.prisma.user.count({ where: { ...where, isActive: true } }),
            this.prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
        ]);
        return {
            total,
            byRole: {
                users: totalUsers,
                editors: totalEditors,
                admins: totalAdmins,
            },
            active: activeUsers,
            newThisMonth: newUsersThisMonth,
        };
    }
    async getEventStats(dateFilter) {
        const where = dateFilter ? { createdAt: dateFilter } : {};
        const [total, published, upcoming, ongoing, completed, totalParticipants, eventsByCategory,] = await Promise.all([
            this.prisma.event.count({ where }),
            this.prisma.event.count({ where: { ...where, published: true } }),
            this.prisma.event.count({
                where: {
                    ...where,
                    status: client_1.EventStatus.UPCOMING,
                    date: { gte: new Date() }
                }
            }),
            this.prisma.event.count({ where: { ...where, status: client_1.EventStatus.ONGOING } }),
            this.prisma.event.count({ where: { ...where, status: client_1.EventStatus.COMPLETED } }),
            this.prisma.eventRegistration.count({
                where: {
                    status: client_1.RegistrationStatus.CONFIRMED,
                    event: where,
                },
            }),
            this.prisma.event.groupBy({
                by: ['category'],
                where,
                _count: { category: true },
            }),
        ]);
        return {
            total,
            published,
            upcoming,
            ongoing,
            completed,
            totalParticipants,
            byCategory: eventsByCategory.reduce((acc, item) => {
                acc[item.category] = item._count.category;
                return acc;
            }, {}),
        };
    }
    async getPostStats(dateFilter) {
        const where = dateFilter ? { createdAt: dateFilter } : {};
        const [total, published, drafts, totalViews, totalLikes, postsByCategory,] = await Promise.all([
            this.prisma.post.count({ where }),
            this.prisma.post.count({ where: { ...where, status: client_1.PostStatus.PUBLISHED } }),
            this.prisma.post.count({ where: { ...where, status: client_1.PostStatus.DRAFT } }),
            this.prisma.post.aggregate({
                where,
                _sum: { views: true },
            }),
            this.prisma.post.aggregate({
                where,
                _sum: { likes: true },
            }),
            this.prisma.post.groupBy({
                by: ['category'],
                where,
                _count: { category: true },
            }),
        ]);
        return {
            total,
            published,
            drafts,
            totalViews: totalViews._sum.views || 0,
            totalLikes: totalLikes._sum.likes || 0,
            byCategory: postsByCategory.reduce((acc, item) => {
                acc[item.category] = item._count.category;
                return acc;
            }, {}),
        };
    }
    async getRegistrationStats(dateFilter) {
        const where = dateFilter ? { registeredAt: dateFilter } : {};
        const [total, confirmed, pending, waitlist, cancelled] = await Promise.all([
            this.prisma.eventRegistration.count({ where }),
            this.prisma.eventRegistration.count({ where: { ...where, status: client_1.RegistrationStatus.CONFIRMED } }),
            this.prisma.eventRegistration.count({ where: { ...where, status: client_1.RegistrationStatus.PENDING } }),
            this.prisma.eventRegistration.count({ where: { ...where, status: client_1.RegistrationStatus.WAITLIST } }),
            this.prisma.eventRegistration.count({ where: { ...where, status: client_1.RegistrationStatus.CANCELLED } }),
        ]);
        return {
            total,
            confirmed,
            pending,
            waitlist,
            cancelled,
        };
    }
    async getRecentActivity() {
        const [recentUsers, recentEvents, recentPosts, recentRegistrations] = await Promise.all([
            this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            }),
            this.prisma.event.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    date: true,
                    location: true,
                    currentParticipants: true,
                    maxParticipants: true,
                    createdAt: true,
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            this.prisma.post.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    status: true,
                    views: true,
                    likes: true,
                    createdAt: true,
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            this.prisma.eventRegistration.findMany({
                take: 5,
                orderBy: { registeredAt: 'desc' },
                select: {
                    id: true,
                    fullName: true,
                    status: true,
                    registeredAt: true,
                    event: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
        ]);
        return {
            users: recentUsers,
            events: recentEvents,
            posts: recentPosts,
            registrations: recentRegistrations,
        };
    }
    async getMonthlyData(year) {
        const currentYear = year ? parseInt(year) : new Date().getFullYear();
        const months = Array.from({ length: 12 }, (_, i) => {
            const startOfMonth = new Date(currentYear, i, 1);
            const endOfMonth = new Date(currentYear, i + 1, 0, 23, 59, 59);
            return { startOfMonth, endOfMonth, month: i + 1 };
        });
        const monthlyData = await Promise.all(months.map(async ({ startOfMonth, endOfMonth, month }) => {
            const [users, events, posts, registrations] = await Promise.all([
                this.prisma.user.count({
                    where: {
                        createdAt: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                }),
                this.prisma.event.count({
                    where: {
                        createdAt: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                }),
                this.prisma.post.count({
                    where: {
                        createdAt: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                }),
                this.prisma.eventRegistration.count({
                    where: {
                        registeredAt: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                }),
            ]);
            return {
                month,
                users,
                events,
                posts,
                registrations,
            };
        }));
        return monthlyData;
    }
    async getDetailedEventStats(userRole, eventId) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể xem thống kê chi tiết');
        }
        if (eventId) {
            const event = await this.prisma.event.findUnique({
                where: { id: eventId },
                include: {
                    registrations: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                }
                            }
                        }
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            });
            if (!event) {
                throw new Error('Sự kiện không tồn tại');
            }
            const registrationsByStatus = event.registrations.reduce((acc, reg) => {
                acc[reg.status] = (acc[reg.status] || 0) + 1;
                return acc;
            }, {});
            const registrationsByExperience = event.registrations.reduce((acc, reg) => {
                acc[reg.experience] = (acc[reg.experience] || 0) + 1;
                return acc;
            }, {});
            return {
                event: {
                    id: event.id,
                    name: event.name,
                    date: event.date,
                    location: event.location,
                    maxParticipants: event.maxParticipants,
                    currentParticipants: event.currentParticipants,
                },
                registrations: {
                    total: event.registrations.length,
                    byStatus: registrationsByStatus,
                    byExperience: registrationsByExperience,
                },
                recentRegistrations: event.registrations
                    .sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime())
                    .slice(0, 10),
            };
        }
        const events = await this.prisma.event.findMany({
            include: {
                _count: {
                    select: {
                        registrations: true,
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
        return {
            totalEvents: events.length,
            eventsWithRegistrations: events.filter(e => e._count.registrations > 0).length,
            averageRegistrationsPerEvent: events.reduce((sum, e) => sum + e._count.registrations, 0) / events.length,
            mostPopularEvents: events
                .sort((a, b) => b._count.registrations - a._count.registrations)
                .slice(0, 5)
                .map(e => ({
                id: e.id,
                name: e.name,
                date: e.date,
                registrations: e._count.registrations,
            })),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map