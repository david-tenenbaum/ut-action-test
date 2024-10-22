
// Suppose to mimic https://github.com/ezcater/ez-tracking-service/blob/48b0293ce275be0a67b72d9b866b1c0de05fc9ad/app/models/raw_processor.rb#L32
import { UtmPropsEvent } from "./UtmPropsEvent";
import { Allowlist } from "./AllowList";
import { browserProps } from "./browserProps";
import { isValidUngovernedEvent } from "./isValidUngovernedEvent";
import { addLandingEvent } from "./addLandingEvent";
import { v4 as uuidv4 } from 'uuid';

export function processEvent(event) {
    if (!isValidUngovernedEvent(event)) {
        return [];
    }

    const events = addLandingEvent(event);

    return events.map(evt => {
        let props = UtmPropsEvent(evt);

        let eventName = buildEventName(evt);
        if (/Store modal: locations-modal-.*/.test(eventName)) {
            const [, eventNamePart, location] = eventName.split(/(Store modal: locations-modal)-/);
            eventName = eventNamePart;

            props.misc_json = {
                ...props.misc_json,
                modal_location: location
            };
        }
        const opts = {
            ...Allowlist.process(evt),
            ...props,
            ...browserProps(evt),
            unique_record_id: event.unique_record_id || uuidv4(),
            event_name: eventName
        }        
        return opts;
    });
}

function buildEventName(event) {
    const subcat = event.sub_category ? ` ${event.sub_category}` : '';
    const instance = event.instance ? `-${event.instance}` : '';
    const focus = event.focus ? ` ${event.focus}` : '';
    const category = event.category ? event.category.replace(/\b\w/g, char => char.toUpperCase()) : '';

    return `${category}${subcat}${focus}: ${event.event}${instance}`;
}
