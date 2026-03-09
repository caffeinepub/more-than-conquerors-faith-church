import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Sermon {
    id: bigint;
    title: string;
    date: Time;
    tags: Array<string>;
    description: string;
    youtubeId: string;
    speaker: string;
    seriesName: string;
}
export type Time = bigint;
export interface PrayerRequest {
    id: bigint;
    submittedDate: Time;
    name: string;
    email: string;
    prayerText: string;
}
export interface GivingFund {
    goalAmount?: bigint;
    description: string;
    fundName: string;
}
export interface Event {
    id: bigint;
    title: string;
    description: string;
    registrationLink: string;
    dateTime: Time;
    location: string;
    eventType: EventType;
}
export interface NewsletterSubscriber {
    signupDate: Time;
    email: string;
}
export interface UserProfile {
    name: string;
}
export interface Testimony {
    id: bigint;
    storyText: string;
    name: string;
    approved: boolean;
    category: TestimonyCategory;
}
export enum EventType {
    bibleStudy = "bibleStudy",
    conference = "conference",
    community = "community",
    sundayService = "sundayService",
    youth = "youth"
}
export enum TestimonyCategory {
    growth = "growth",
    healing = "healing",
    restoration = "restoration",
    faith = "faith"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveTestimony(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvent(event: Event): Promise<void>;
    createGivingFund(fund: GivingFund): Promise<void>;
    createSermon(sermon: Sermon): Promise<void>;
    deleteEvent(id: bigint): Promise<void>;
    deleteGivingFund(fundName: string): Promise<void>;
    deleteSermon(id: bigint): Promise<void>;
    getAllGivingFunds(): Promise<Array<GivingFund>>;
    getAllNewsletterSubscribers(): Promise<Array<NewsletterSubscriber>>;
    getAllPrayerRequests(): Promise<Array<PrayerRequest>>;
    getAllSermons(): Promise<Array<Sermon>>;
    getAllUpcomingEvents(): Promise<Array<Event>>;
    getApprovedTestimonies(): Promise<Array<Testimony>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEventsByType(eventType: EventType): Promise<Array<Event>>;
    getSermonsBySeries(seriesName: string): Promise<Array<Sermon>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchSermonsByTag(tag: string): Promise<Array<Sermon>>;
    submitPrayerRequest(request: PrayerRequest): Promise<void>;
    submitTestimony(testimony: Testimony): Promise<void>;
    subscribeNewsletter(email: string): Promise<void>;
    updateEvent(id: bigint, event: Event): Promise<void>;
    updateGivingFund(fund: GivingFund): Promise<void>;
    updateSermon(id: bigint, sermon: Sermon): Promise<void>;
}
