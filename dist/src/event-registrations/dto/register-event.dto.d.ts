import { ExperienceLevel } from '@prisma/client';
export declare class RegisterEventDto {
    fullName: string;
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone?: string;
    medicalConditions?: string;
    experience: ExperienceLevel;
}
