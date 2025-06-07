import Jar from "../../monobank/models/Jar";
import Report from "../../reports/models/Report";
import { FundraisingStatus } from "./FundraisingStatus";

export default interface Fundraising {
    id: string;
    title: string;
    description: string;
    avatarUrl: string;
    status: FundraisingStatus;
    createdAt: string;
    closedAt: Date;
    readyForReviewAt: Date;
    reviewedAt: Date;
    userId: string;
    userName: string;
    userAvatarUrl: string;
    monobankJarId: string;
    tags: string[];
    monobankJar: Jar;
    reports: Report[];
}