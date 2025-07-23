import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from 'src/events/dto/update-event.dto';
import { Role } from '@prisma/client';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEventDto: CreateEventDto, userId: string, userRole: Role): Promise<{
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
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
    }>;
    findAll(query?: any): Promise<{
        data: ({
            _count: {
                registrations: number;
            };
            author: {
                id: string;
                name: string;
            };
        } & {
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
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllForAdmin(query: any, userRole: Role): Promise<{
        data: ({
            _count: {
                registrations: number;
            };
            author: {
                id: string;
                name: string;
                email: string;
            };
        } & {
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
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        _count: {
            registrations: number;
        };
        author: {
            id: string;
            name: string;
            email: string;
        };
        registrations: ({
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
        })[];
    } & {
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
    }>;
    update(id: string, updateEventDto: UpdateEventDto, userRole: Role): Promise<{
        author: {
            id: string;
            name: string;
            email: string;
        };
    } & {
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
    }>;
    remove(id: string, userRole: Role): Promise<{
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
    }>;
    getEventStats(query: any, userRole: Role): Promise<{
        overview: {
            totalEvents: number;
            publishedEvents: number;
            upcomingEvents: number;
            ongoingEvents: number;
            completedEvents: number;
            totalRegistrations: number;
        };
        categoryDistribution: Record<string, number>;
        recentEvents: ({
            _count: {
                registrations: number;
            };
            author: {
                id: string;
                name: string;
            };
        } & {
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
        })[];
    }>;
}
