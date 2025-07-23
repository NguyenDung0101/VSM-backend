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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEventDto, userId, userRole) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể tạo sự kiện');
        }
        const eventData = {
            ...createEventDto,
            date: new Date(createEventDto.date),
            registrationDeadline: createEventDto.registrationDeadline
                ? new Date(createEventDto.registrationDeadline)
                : null,
            authorId: userId,
            currentParticipants: 0,
        };
        return this.prisma.event.create({
            data: eventData,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }
    async findAll(query) {
        const { category, status, featured, search, upcoming = 'true', limit = '10', page = '1' } = query || {};
        const where = { published: true };
        if (category)
            where.category = category;
        if (status)
            where.status = status;
        if (featured === 'true')
            where.featured = true;
        if (upcoming === 'true') {
            where.date = { gte: new Date() };
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ];
        }
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;
        const [events, total] = await Promise.all([
            this.prisma.event.findMany({
                where,
                orderBy: { date: 'asc' },
                take,
                skip,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    _count: {
                        select: {
                            registrations: true,
                        }
                    }
                },
            }),
            this.prisma.event.count({ where }),
        ]);
        return {
            data: events,
            pagination: {
                total,
                page: parseInt(page),
                limit: take,
                totalPages: Math.ceil(total / take),
            }
        };
    }
    async findAllForAdmin(query, userRole) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể xem tất cả sự kiện');
        }
        const { category, status, published, search, authorId, startDate, endDate, limit = '10', page = '1' } = query || {};
        const where = {};
        if (category)
            where.category = category;
        if (status)
            where.status = status;
        if (published === 'true' || published === 'false') {
            where.published = published === 'true';
        }
        if (authorId)
            where.authorId = authorId;
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ];
        }
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;
        const [events, total] = await Promise.all([
            this.prisma.event.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take,
                skip,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    _count: {
                        select: {
                            registrations: true,
                        }
                    }
                },
            }),
            this.prisma.event.count({ where }),
        ]);
        return {
            data: events,
            pagination: {
                total,
                page: parseInt(page),
                limit: take,
                totalPages: Math.ceil(total / take),
            }
        };
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
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
                _count: {
                    select: {
                        registrations: true,
                    }
                }
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('Sự kiện không tồn tại');
        }
        return event;
    }
    async update(id, updateEventDto, userRole) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể cập nhật sự kiện');
        }
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) {
            throw new common_1.NotFoundException('Sự kiện không tồn tại');
        }
        const updateData = {
            ...updateEventDto,
            ...(updateEventDto.date && { date: new Date(updateEventDto.date) }),
            ...(updateEventDto.registrationDeadline && {
                registrationDeadline: new Date(updateEventDto.registrationDeadline)
            }),
        };
        return this.prisma.event.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }
    async remove(id, userRole) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể xóa sự kiện');
        }
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) {
            throw new common_1.NotFoundException('Sự kiện không tồn tại');
        }
        return this.prisma.event.delete({
            where: { id },
        });
    }
    async getEventStats(query, userRole) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể xem thống kê');
        }
        const { startDate, endDate } = query || {};
        const dateFilter = {};
        if (startDate || endDate) {
            if (startDate)
                dateFilter.gte = new Date(startDate);
            if (endDate)
                dateFilter.lte = new Date(endDate);
        }
        const where = dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {};
        const [totalEvents, publishedEvents, upcomingEvents, ongoingEvents, completedEvents, totalRegistrations, eventsByCategory, recentEvents,] = await Promise.all([
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
                    event: where,
                }
            }),
            this.prisma.event.groupBy({
                by: ['category'],
                where,
                _count: {
                    category: true,
                },
            }),
            this.prisma.event.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    _count: {
                        select: {
                            registrations: true,
                        }
                    }
                },
            }),
        ]);
        return {
            overview: {
                totalEvents,
                publishedEvents,
                upcomingEvents,
                ongoingEvents,
                completedEvents,
                totalRegistrations,
            },
            categoryDistribution: eventsByCategory.reduce((acc, item) => {
                acc[item.category] = item._count.category;
                return acc;
            }, {}),
            recentEvents,
        };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map