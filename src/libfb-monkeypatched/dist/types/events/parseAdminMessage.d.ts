import { Event, EventType } from '../Events';
export default function parseAdminMessage(delta: any): {
    type: EventType;
    event: Event;
};
