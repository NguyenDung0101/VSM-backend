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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationsController = void 0;
const common_1 = require("@nestjs/common");
const event_registrations_service_1 = require("./event-registrations.service");
const register_event_dto_1 = require("./dto/register-event.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let EventRegistrationsController = class EventRegistrationsController {
    constructor(eventRegistrationsService) {
        this.eventRegistrationsService = eventRegistrationsService;
    }
    async registerForEvent(eventId, registerDto, req) {
        return this.eventRegistrationsService.registerForEvent(eventId, req.user.sub, registerDto);
    }
    async getMyRegistrations(req) {
        return this.eventRegistrationsService.getUserRegistrations(req.user.sub);
    }
    async getEventRegistrations(eventId, req) {
        return this.eventRegistrationsService.getEventRegistrations(eventId, req.user.role);
    }
    async updateRegistrationStatus(id, status, req) {
        return this.eventRegistrationsService.updateRegistrationStatus(id, status, req.user.role);
    }
    async cancelRegistration(id, req) {
        return this.eventRegistrationsService.cancelRegistration(id, req.user.sub);
    }
    async getRegistrationStats(eventId) {
        return this.eventRegistrationsService.getRegistrationStats(eventId);
    }
};
exports.EventRegistrationsController = EventRegistrationsController;
__decorate([
    (0, common_1.Post)('events/:eventId/register'),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, register_event_dto_1.RegisterEventDto, Object]),
    __metadata("design:returntype", Promise)
], EventRegistrationsController.prototype, "registerForEvent", null);
__decorate([
    (0, common_1.Get)('my-registrations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventRegistrationsController.prototype, "getMyRegistrations", null);
__decorate([
    (0, common_1.Get)('events/:eventId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.EDITOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventRegistrationsController.prototype, "getEventRegistrations", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.EDITOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EventRegistrationsController.prototype, "updateRegistrationStatus", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventRegistrationsController.prototype, "cancelRegistration", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.EDITOR, client_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventRegistrationsController.prototype, "getRegistrationStats", null);
exports.EventRegistrationsController = EventRegistrationsController = __decorate([
    (0, common_1.Controller)('event-registrations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [event_registrations_service_1.EventRegistrationsService])
], EventRegistrationsController);
//# sourceMappingURL=event-registrations.controller.js.map