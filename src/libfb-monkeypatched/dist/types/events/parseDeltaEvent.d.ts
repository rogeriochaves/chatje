import { Event, EventType } from '../Events';
export default function parseDeltaEvent(event: any): {
    type: EventType;
    event: Event;
};
export declare function getEventMetadata(delta: any): {
    id: any;
    threadId: any;
    authorId: any;
    message: any;
};
