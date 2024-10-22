import { UrlParser } from "./URLParser.js";
import { v4 as uuidv4 } from 'uuid';

export function addLandingEvent(event) {
  const events = [event];

  if (isTouch(event) && !isWebLanding(event) && isExternalReferrer(event)) {
    const landingEvent = { ...event, event: "web-landing", unique_record_id: uuidv4() };
    events.push(landingEvent);
  }
  return events;
}

function isExternalReferrer(event) {
  return !UrlParser.host(event.referrer_url).includes('ezcater');
}

function isTouch(event) {
  return event.category === "touch";
}

function isWebLanding(event) {
  return event.event === "web-landing";
}
