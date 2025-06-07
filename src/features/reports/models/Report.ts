import Attachment from "../../attachments/models/Attachment";

export default interface Report {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    attachments: Attachment[];
}