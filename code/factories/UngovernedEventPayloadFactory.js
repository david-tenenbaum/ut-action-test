import v1EventFactory from './v1EventFactory.js';
import legacyEventFactory from './legacyEventFactory.js';

const UngovernedEventPayloadFactory = ({
    event = "some event",
    category = "some category",
    tracking_id = "769f653b-40e3-428c-a493-ad3b43f1dded",
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    url = "https://www.ezcater.com/store/checkout/place_order/1d48ae6f-8897-4075-942b-3f7a4852db60",
    referrer_url = "https://www.ezcater.com/catering/panera-bread-charlotte-city-park-dr/2024-10-09?cartId=1d48ae6f-8897-4075-942b-3f7a4852db60",
    landing_url = "/store/checkout/place_order/1d48ae6f-8897-4075-942b-3f7a4852db60",
    platform_name = "Windows",
    v1_event = v1EventFactory({ event, category, tracking_id, userAgent, url, referrer_url, landing_url, platform_name }),
    legacy_event = legacyEventFactory({ event, category, tracking_id, userAgent, url, referrer_url, landing_url, platform_name })
} = {}) => {
    return {
        anonymousId: "2d6e242e-e955-4fd0-bdf8-c5d44fd68b7a",
        channel: "web",
        context: {
            userAgent: userAgent
        },
        properties: {
            event: event,
            category: category,
            tracking_id: tracking_id,
            legacy_event: legacy_event,
            v1_event: v1_event
        }
    };
};

export default UngovernedEventPayloadFactory;
