import { describe, expect, it } from 'vitest';
import { addLandingEvent } from '../addLandingEvent.js';
import v1EventFactory from '../factories/v1EventFactory.js';
import v1EventFactory from '../factories/v1EventFactory.js';

describe('addLandingEvent', () => {
  
  it('should add a landing event when it is a touch event, is not a web landing event, and has an external referrer', () => {
    const event = ({
      event: 'not-web-landing',
      category: 'touch',
      referrer_url: 'https://www.happydog.com/woofbakery'
    });
    
    const result = addLandingEvent(event);
    
    // Check that the landing event is added
    expect(result).toHaveLength(2);
    
    // Check the structure of the added landing event
    const landingEvent = result[1];
    expect(landingEvent).toHaveProperty('event', 'web-landing');
    expect(landingEvent).toHaveProperty('unique_record_id');
    expect(typeof landingEvent.unique_record_id).toBe('string'); // Ensure it's a string
    expect(landingEvent.category).toBe('touch'); // Ensure it retains the original category
  });

  it('should not add a landing event when it is not a touch event', () => {
    const event = v1EventFactory({
      event: 'some event',
      category: 'non-touch',
    });
    
    const result = addLandingEvent(event);
    expect(result).toHaveLength(1);
  });

  it('should not add a landing event when it is a web landing event', () => {
    const event = v1EventFactory({
      event: 'web-landing',
      category: 'touch',
    });
    
    const result = addLandingEvent(event);
    expect(result).toHaveLength(1);
  });

  it('should not add a landing event when referrer_url is undefined', () => {
    const event = v1EventFactory({
      event: 'not-web-landing',
      category: 'touch',
      referrer_url: undefined,
    });
    
    const result = addLandingEvent(event);
    expect(result).toHaveLength(1);
  });

  describe('External Referrer Scenarios', () => {
    it('should add a landing event for a valid external referrer', () => {
      const event = v1EventFactory({
        event: 'not-web-landing',
        category: 'touch',
        referrer_url: 'https://www.externalwebsite.com/somepage',
      });
      
      const result = addLandingEvent(event);
      expect(result).toHaveLength(2);
      expect(result[1].event).toBe('web-landing');
    });

    it('should not add a landing event for a referrer from the same domain', () => {
      const event = v1EventFactory({
        event: 'not-web-landing',
        category: 'touch',
        referrer_url: 'https://www.ezcater.com/somepage',
      });
      
      const result = addLandingEvent(event);
      expect(result).toHaveLength(1);
    });

    it('should not add a landing event for a subdomain referrer', () => {
      const event = v1EventFactory({
        event: 'not-web-landing',
        category: 'touch',
        referrer_url: 'https://sub.ezcater.com/somepage',
      });
      
      const result = addLandingEvent(event);
      expect(result).toHaveLength(1);
    });
  });
});
