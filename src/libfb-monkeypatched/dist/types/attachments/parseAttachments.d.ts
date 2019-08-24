import { FileAttachment, XMAAttachment } from '../Attachment';
export interface Attachments {
    fileAttachments: FileAttachment[];
    mediaAttachments: XMAAttachment[];
}
export default function parseAttachments(attachments: any[]): Attachments;
