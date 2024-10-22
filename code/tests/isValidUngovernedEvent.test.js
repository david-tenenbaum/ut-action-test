import { describe, expect, it } from 'vitest'
import { isValidUngovernedEvent } from '../isValidUngovernedEvent';
import UngovernedEventPayloadFactory from '../factories/UngovernedEventPayloadFactory'
import { IOS_ANONYMOUS_TRACKING_ID, KNOWN_BOT_FILTER_LIST, REQUIRED_PARAMS, BADUUID } from '../constant.js'
import v1EventFactory from '../factories/v1EventFactory.js';

describe('isValidUngovernedEvent', () => {
  describe('valid ungoverned event', () => {
    it('returns true when all checks pass for v1_event', () => {
      const event = v1EventFactory(); // Use default values
      const result = isValidUngovernedEvent(event);
      expect(result).toBe(true); // Assuming this is a valid event
    });

    it('returns true when all checks pass for legacy_event', () => {
      const legacyEvent = {
        tracking_id: "1231241412",
        event: "some event",
        category: "some catergory",
        original_user_agent: "some user agents",
        user_agent: "some user agents",
      }
      const result = isValidUngovernedEvent(legacyEvent);
      expect(result).toBe(true);
    })
  });

  describe('when userAgent is a known bot', () => {
    it('should return false', () => {
      KNOWN_BOT_FILTER_LIST.forEach(botName => {
        const payload = v1EventFactory({ userAgent: botName })
        expect(isValidUngovernedEvent(payload)).toEqual(false)
      });
    })

    it('with a non bot user agent', () => {
      const event = v1EventFactory({ userAgent: "Chrome" }); // Use default values
      const result = isValidUngovernedEvent(event);
      expect(result).toBe(true)
    });
  });

  describe('requiredParamsPresent', () => {
    it('when one or more params are NOT present, it should return false', () => {
      const eventWithMultipleMissingParams = v1EventFactory({
        tracking_id: 'valid-tracking-id',
        event: null,
        category: ""
      });
      const result = isValidUngovernedEvent(eventWithMultipleMissingParams);
      expect(result).toBe(false);
    })

    it('when tracking_id is NOT present, it should return false', () => {
      const eventWithMultipleMissingParams = v1EventFactory({
        tracking_id: null,
        event: "BarkPark",
        category: "woofing Around"
      });
      const result = isValidUngovernedEvent(eventWithMultipleMissingParams);
      expect(result).toBe(false);
    })

    it('when category is NOT present, it should return false', () => {
      const eventWithMultipleMissingParams = v1EventFactory({
        tracking_id: 'valid-tracking-id',
        event: "BarkPark",
        category: null
      });
      const result = isValidUngovernedEvent(eventWithMultipleMissingParams);
      expect(result).toBe(false);
    })

    it('when event is NOT present, it should return false', () => {
      const eventWithMultipleMissingParams = v1EventFactory({
        tracking_id: 'valid-tracking-id',
        event: null,
        category: "Woofing Around"
      });
      const result = isValidUngovernedEvent(eventWithMultipleMissingParams);
      expect(result).toBe(false);
    })

    it('when required params are present, it should return true', () => {
      const eventWithMultipleMissingParams = v1EventFactory({
        tracking_id: 'valid-tracking-id',
        event: "BarkPark",
        category: "Woofing Around"
      });
      const result = isValidUngovernedEvent(eventWithMultipleMissingParams);
      expect(result).toBe(true);
    })
  });

  describe('anonymous iOS', () => {
    it('when using an anonymous iOS tracking ID, event is invalid and returns false', () => {
      const payload = v1EventFactory({ tracking_id: IOS_ANONYMOUS_TRACKING_ID })
      expect(isValidUngovernedEvent(payload)).toEqual(false)
    });

    it('when NOT using an anonymous iOS tracking ID, event is valid and returns true', () => {
      const payload = v1EventFactory({ tracking_id: "769f653b-40e3-428c-a493-ad3b43f1dded" })
      expect(isValidUngovernedEvent(payload)).toEqual(true)
    });
  });

  describe('tracking ID UUID format', () => {
    it('when format is BAD UUID should return false', () => {
      const payload = v1EventFactory({ tracking_id: "123!!" });
      expect(isValidUngovernedEvent(payload)).toEqual(false);
    });

    it('when format has proper UUID should return true', () => {
      const payload = v1EventFactory({ tracking_id: "123asasdfasdfwer14123" });
      expect(isValidUngovernedEvent(payload)).toEqual(true);
    });

    it('when format is a hex, should return true', () => {
      // Generate a random hex string and use it in the payload
      const randomHex = (size = 10) => {
        return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      };
      const payload = v1EventFactory({ tracking_id: randomHex() });
      expect(isValidUngovernedEvent(payload)).toEqual(true);
    });

    it('with an Auto incrementing ID, should return true', () => {
      const randMath = Math.floor(Math.random() * 10000).toString();
      const payload = v1EventFactory({ tracking_id: randMath });
      expect(isValidUngovernedEvent(payload)).toEqual(true);
    });

    it('when format is a ref, should return true', () => {
      const payload = v1EventFactory({ tracking_id: "phone_18315559293" });
      expect(isValidUngovernedEvent(payload)).toEqual(true);
    });

    it('when format is a phone id, should return true', () => {
      const payload = v1EventFactory({ tracking_id: "raf_123456" });
      expect(isValidUngovernedEvent(payload)).toEqual(true);
    });

    it('when format is a cat_id, should return true', () => {
      const payload = v1EventFactory({ tracking_id: "cat_123456" });
      expect(isValidUngovernedEvent(payload)).toEqual(true);
    });
  });

});
