import { Event, EventType } from '../Events';
export default function parsePlanEvent(delta: any): {
    type: EventType;
    event: Event;
};
