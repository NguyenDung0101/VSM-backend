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
exports.EventRegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EventRegistrationsService = class EventRegistrationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerForEvent(eventId, userId, registerDto) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { registrations: true },
        });
        if (!event) {
            throw new common_1.NotFoundException('Sự kiện không tồn tại');
        }
        if (!event.published) {
            throw new common_1.BadRequestException('Sự kiện chưa được công bố');
        }
        if (event.registrationDeadline && new Date() > event.registrationDeadline) {
            throw new common_1.BadRequestException('Đã hết hạn đăng ký sự kiện');
        }
        const existingRegistration = await this.prisma.eventRegistration.findFirst({
            where: { eventId, userId },
        });
        if (existingRegistration) {
            throw new common_1.ConflictException('Bạn đã đăng ký sự kiện này rồi');
        }
        const confirmedCount = event.registrations.filter(reg => reg.status === client_1.RegistrationStatus.CONFIRMED).length;
        let status = client_1.RegistrationStatus.PENDING;
        if (confirmedCount >= event.maxParticipants) {
            status = client_1.RegistrationStatus.WAITLIST;
        }
        else if (confirmedCount >= event.maxParticipants * 0.9) {
            status = client_1.RegistrationStatus.WAITLIST;
        }
        const registration = await this.prisma.eventRegistration.create({
            data: {
                ...registerDto,
                eventId,
                userId,
                status,
                registeredAt: new Date(),
            },
            include: {
                event: {
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        location: true,
                    },
                },
            },
        });
        if (status === client_1.RegistrationStatus.PENDING) {
            await this.prisma.event.update({
                where: { id: eventId },
                data: {
                    currentParticipants: {
                        increment: 1,
                    },
                },
            });
        }
        return registration;
    }
    async getUserRegistrations(userId) {
        return this.prisma.eventRegistration.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        location: true,
                        image: true,
                        category: true,
                        status: true,
                    },
                },
            },
            orderBy: { registeredAt: 'desc' },
        });
    }
    async getEventRegistrations(eventId, userRole) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể xem danh sách đăng ký');
        }
        return this.prisma.eventRegistration.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { registeredAt: 'desc' },
        });
    }
    async updateRegistrationStatus(registrationId, status, userRole) {
        if (userRole !== client_1.Role.EDITOR && userRole !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Chỉ Editor và Admin mới có thể cập nhật trạng thái đăng ký');
        }
        if (!Object.values(client_1.RegistrationStatus).includes(status)) {
            throw new common_1.BadRequestException('Trạng thái không hợp lệ');
        }
        const registration = await this.prisma.eventRegistration.findUnique({
            where: { id: registrationId },
            include: { event: true },
        });
        if (!registration) {
            throw new common_1.NotFoundException('Đăng ký không tồn tại');
        }
        const oldStatus = registration.status;
        if (oldStatus === status) {
            throw new common_1.BadRequestException('Trạng thái không thay đổi');
        }
        const updatedRegistration = await this.prisma.eventRegistration.update({
            where: { id: registrationId },
            data: { status },
            include: {
                event: {
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        location: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        let increment = 0;
        if (oldStatus === client_1.RegistrationStatus.CONFIRMED && status !== client_1.RegistrationStatus.CONFIRMED) {
            increment = -1;
        }
        else if (oldStatus !== client_1.RegistrationStatus.CONFIRMED && status === client_1.RegistrationStatus.CONFIRMED) {
            increment = 1;
        }
        if (increment !== 0) {
            await this.prisma.event.update({
                where: { id: registration.eventId },
                data: {
                    currentParticipants: {
                        increment,
                    },
                },
            });
        }
        return updatedRegistration;
    }
    async cancelRegistration(registrationId, userId) {
        const registration = await this.prisma.eventRegistration.findFirst({
            where: {
                id: registrationId,
                userId,
            },
            include: { event: true },
        });
        if (!registration) {
            throw new common_1.NotFoundException('Đăng ký không tồn tại hoặc bạn không có quyền hủy');
        }
        if (registration.event.date < new Date()) {
            throw new common_1.BadRequestException('Không thể hủy đăng ký sau khi sự kiện đã diễn ra');
        }
        const updatedRegistration = await this.prisma.eventRegistration.update({
            where: { id: registrationId },
            data: { status: client_1.RegistrationStatus.CANCELLED },
            include: { event: true },
        });
        if (registration.status === client_1.RegistrationStatus.CONFIRMED) {
            await this.prisma.event.update({
                where: { id: registration.eventId },
                data: {
                    currentParticipants: {
                        decrement: 1,
                    },
                },
            });
        }
        return updatedRegistration;
    }
    async getRegistrationStats(eventId) {
        const where = eventId ? { eventId } : {};
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
};
exports.EventRegistrationsService = EventRegistrationsService;
exports.EventRegistrationsService = EventRegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventRegistrationsService);
//# sourceMappingURL=event-registrations.service.js.map