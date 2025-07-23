import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardStats(req: any, query: any): Promise<{
        overview: {
            users: {
                total: number;
                byRole: {
                    users: number;
                    editors: number;
                    admins: number;
                };
                active: number;
                newThisMonth: number;
            };
            events: {
                total: number;
                published: number;
                upcoming: number;
                ongoing: number;
                completed: number;
                totalParticipants: number;
                byCategory: Record<string, number>;
            };
            posts: {
                total: number;
                published: number;
                drafts: number;
                totalViews: number;
                totalLikes: number;
                byCategory: Record<string, number>;
            };
            registrations: {
                total: number;
                confirmed: number;
                pending: number;
                waitlist: number;
                cancelled: number;
            };
        };
        recentActivity: {
            users: {
                id: string;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
            }[];
            events: {
                id: string;
                name: string;
                createdAt: Date;
                author: {
                    name: string;
                };
                date: Date;
                location: string;
                maxParticipants: number;
                currentParticipants: number;
            }[];
            posts: {
                id: string;
                createdAt: Date;
                title: string;
                category: import(".prisma/client").$Enums.PostCategory;
                views: number;
                likes: number;
                status: import(".prisma/client").$Enums.PostStatus;
                author: {
                    name: string;
                };
            }[];
            registrations: {
                event: {
                    name: string;
                };
                id: string;
                status: import(".prisma/client").$Enums.RegistrationStatus;
                fullName: string;
                registeredAt: Date;
            }[];
        };
        monthlyData: {
            month: number;
            users: number;
            events: number;
            posts: number;
            registrations: number;
        }[];
    }>;
    getDetailedEventStats(req: any, eventId?: string): Promise<{
        event: {
            id: string;
            name: string;
            date: Date;
            location: string;
            maxParticipants: number;
            currentParticipants: number;
        };
        registrations: {
            total: number;
            byStatus: Record<string, number>;
            byExperience: Record<string, number>;
        };
        recentRegistrations: ({
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
            eventId: string;
            fullName: string;
            emergencyContact: string;
            emergencyPhone: string | null;
            medicalConditions: string | null;
            experience: import(".prisma/client").$Enums.ExperienceLevel;
            registeredAt: Date;
            userId: string;
        })[];
        totalEvents?: undefined;
        eventsWithRegistrations?: undefined;
        averageRegistrationsPerEvent?: undefined;
        mostPopularEvents?: undefined;
    } | {
        totalEvents: number;
        eventsWithRegistrations: number;
        averageRegistrationsPerEvent: number;
        mostPopularEvents: {
            id: string;
            name: string;
            date: Date;
            registrations: number;
        }[];
        event?: undefined;
        registrations?: undefined;
        recentRegistrations?: undefined;
    }>;
}
