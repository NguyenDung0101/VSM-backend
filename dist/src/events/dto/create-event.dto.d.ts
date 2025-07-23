import { EventCategory, EventStatus } from '@prisma/client';
export declare class CreateEventDto {
    name: string;
    description: string;
    content: string;
    date: string;
    location: string;
    image?: string;
    maxParticipants: number;
    category: EventCategory;
    status?: EventStatus;
    distance?: string;
    registrationFee?: number;
    requirements?: string;
    published?: boolean;
    featured?: boolean;
    registrationDeadline?: string;
    organizer?: string;
}
