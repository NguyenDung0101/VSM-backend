import { EventRegistrationsService } from './event-registrations.service';
import { RegisterEventDto } from './dto/register-event.dto';
import { RegistrationStatus } from '@prisma/client';
export declare class EventRegistrationsController {
    private readonly eventRegistrationsService;
    constructor(eventRegistrationsService: EventRegistrationsService);
    registerForEvent(eventId: string, registerDto: RegisterEventDto, req: any): Promise<{
        event: {
            id: string;
            name: string;
            date: Date;
            location: string;
        };
    } & {
        id: string;
        email: string;
        phone: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        fullName: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        registeredAt: Date;
        eventId: string;
        userId: string;
    }>;
    getMyRegistrations(req: any): Promise<({
        event: {
            id: string;
            name: string;
            category: import(".prisma/client").$Enums.EventCategory;
            status: import(".prisma/client").$Enums.EventStatus;
            date: Date;
            location: string;
            image: string;
        };
    } & {
        id: string;
        email: string;
        phone: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        fullName: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        registeredAt: Date;
        eventId: string;
        userId: string;
    })[]>;
    getEventRegistrations(eventId: string, req: any): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string;
        };
    } & {
        id: string;
        email: string;
        phone: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        fullName: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        registeredAt: Date;
        eventId: string;
        userId: string;
    })[]>;
    updateRegistrationStatus(id: string, status: RegistrationStatus, req: any): Promise<{
        event: {
            id: string;
            name: string;
            date: Date;
            location: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        email: string;
        phone: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        fullName: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        registeredAt: Date;
        eventId: string;
        userId: string;
    }>;
    cancelRegistration(id: string, req: any): Promise<{
        event: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            content: string;
            category: import(".prisma/client").$Enums.EventCategory;
            status: import(".prisma/client").$Enums.EventStatus;
            featured: boolean;
            date: Date;
            authorId: string;
            location: string;
            image: string | null;
            maxParticipants: number;
            distance: string | null;
            registrationFee: number | null;
            requirements: string | null;
            published: boolean;
            registrationDeadline: Date | null;
            organizer: string | null;
            currentParticipants: number;
        };
    } & {
        id: string;
        email: string;
        phone: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        fullName: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        registeredAt: Date;
        eventId: string;
        userId: string;
    }>;
    getRegistrationStats(eventId?: string): Promise<{
        total: number;
        confirmed: number;
        pending: number;
        waitlist: number;
        cancelled: number;
    }>;
}
