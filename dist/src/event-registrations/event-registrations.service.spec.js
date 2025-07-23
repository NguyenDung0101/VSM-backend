"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const event_registrations_service_1 = require("./event-registrations.service");
describe('EventRegistrationsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [event_registrations_service_1.EventRegistrationsService],
        }).compile();
        service = module.get(event_registrations_service_1.EventRegistrationsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=event-registrations.service.spec.js.map