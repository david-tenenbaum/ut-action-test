// Suppose to mimic https://github.com/ezcater/ez-tracking-service/blob/main/app/models/raw_processor.rb#L177-L179
import { IOS_ANONYMOUS_TRACKING_ID, KNOWN_BOT_FILTER_LIST, REQUIRED_PARAMS, BAD_UUID } from './constant.js'

export function isValidUngovernedEvent(event) {
  return !isBot(event) && requiredParamsPresent(event) && !isIOSAnonymous(event) && !hasBadUUID(event);
}

// return true if 1 or more known bot is present
export function isBot(event) {
  const userAgent = event["original_user_agent"] || event["user_agent"];
  return KNOWN_BOT_FILTER_LIST.some((botName) => userAgent.includes(botName));
}

// return true if all required params are present
function requiredParamsPresent(event) {
  return REQUIRED_PARAMS.every((param) => event[param]);
}

// return true if ios anonymous
function isIOSAnonymous(event) {
  return event["tracking_id"] === IOS_ANONYMOUS_TRACKING_ID;
}

// return true if uuid is bad or if trackingId is not valid
function hasBadUUID(event) {
  const trackingId = event["tracking_id"]?.toString();

  return !trackingId || !BAD_UUID.test(trackingId);
  // how do we treat this with MetricsReporter (Datadog) Rudderstack.track
}
