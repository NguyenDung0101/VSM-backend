import { PrismaService } from '../prisma/prisma.service';
import { RegisterEventDto } from './dto/register-event.dto';
import { RegistrationStatus, Role } from '@prisma/client';
export declare class EventRegistrationsService {
    private prisma;
    constructor(prisma: PrismaService);
    registerForEvent(eventId: string, userId: string, registerDto: RegisterEventDto): Promise<{
        event: {
            id: string;
            name: string;
            date: Date;
            location: string;
        };
    } & {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        registeredAt: Date;
        updatedAt: Date;
        eventId: string;
        userId: string;
    }>;
    getUserRegistrations(userId: string): Promise<({
        event: {
            id: string;
            status: import(".prisma/client").$Enums.EventStatus;
            name: string;
            date: Date;
            location: string;
            image: string;
            category: import(".prisma/client").$Enums.EventCategory;
        };
    } & {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        registeredAt: Date;
        updatedAt: Date;
        eventId: string;
        userId: string;
    })[]>;
    getEventRegistrations(eventId: string, userRole: Role): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        registeredAt: Date;
        updatedAt: Date;
        eventId: string;
        userId: string;
    })[]>;
    updateRegistrationStatus(registrationId: string, status: RegistrationStatus, userRole: Role): Promise<{
        event: {
            id: string;
            name: string;
            date: Date;
            location: string;
        };
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        registeredAt: Date;
        updatedAt: Date;
        eventId: string;
        userId: string;
    }>;
    cancelRegistration(registrationId: string, userId: string): Promise<{
        event: {
            id: string;
            status: import(".prisma/client").$Enums.EventStatus;
            updatedAt: Date;
            name: string;
            description: string;
            content: string;
            date: Date;
            location: string;
            image: string | null;
            maxParticipants: number;
            currentParticipants: number;
            category: import(".prisma/client").$Enums.EventCategory;
            distance: string | null;
            registrationFee: number | null;
            requirements: string | null;
            published: boolean;
            featured: boolean;
            registrationDeadline: Date | null;
            organizer: string | null;
            createdAt: Date;
            authorId: string;
        };
    } & {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        emergencyContact: string;
        emergencyPhone: string | null;
        medicalConditions: string | null;
        experience: import(".prisma/client").$Enums.ExperienceLevel;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        registeredAt: Date;
        updatedAt: Date;
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
