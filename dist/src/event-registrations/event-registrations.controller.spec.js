"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const event_registrations_controller_1 = require("./event-registrations.controller");
describe('EventRegistrationsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [event_registrations_controller_1.EventRegistrationsController],
        }).compile();
        controller = module.get(event_registrations_controller_1.EventRegistrationsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=event-registrations.controller.spec.js.map