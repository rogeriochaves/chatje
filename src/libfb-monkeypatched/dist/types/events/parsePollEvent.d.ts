import { Event, EventType } from '../Events';
export default function parsePollEvent(delta: any): {
    type: EventType;
    event: Event;
};
