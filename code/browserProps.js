import UAParser from 'ua-parser-js';
import { isBot } from './isValidUngovernedEvent';

export function browserProps(event) {
    const userAgent = event["original_user_agent"] || event["user_agent"];
    
    // Check if the event is from a bot or if there is no user agent available
    if (isBot(event) || !userAgent) {
        return {};
    } else {
        return getBrowserProps(event, userAgent);
    }
}

function getBrowserProps(event, userAgent) {
    // Initialize UAParser with the user agent
    const parser = new UAParser();
    parser.setUA(userAgent);
    const result = parser.getResult();

    const browserName = getbrowserName(event, result);
    const browserVersion = getBrowserVersion(event, result);
    // Return browser properties, prioritizing event data over parsed results
    return {
        browser_name: browserName,
        browser_version: browserVersion,
        browser: `${browserName} ${browserVersion}`,
        browser_full_version: event.browser_full_version || result.browser.version,
        device_name: event.device_name || result.device.type || 'Unknown',
        platform_name: event.raw_event?.event_props?.platform_name || result.os?.name || 'Unknown',
        user_agent: userAgent, 
        language: event.language || result.language || 'en-US',
        client:  getDeviceType(result), // need to figure out at what level event_props is accessible
    };
}

function  getbrowserName(event, result) {
    return event.browser_name || result.browser.name
}

function getBrowserVersion(event, result) {
    return event.browser_version || result.browser?.version?.split?.('.')[0]
}

function getDeviceType (result) {
    if (result.device.type == ('mobile' || 'tablet')) {
        return "APP"
    }
    else {
        return "WEB"
    }
}