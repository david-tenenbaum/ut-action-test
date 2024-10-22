import { describe, expect, it } from 'vitest'
import { UtmPropsEvent } from '../UtmPropsEvent';
import v1EventFactory from '../factories/v1EventFactory';

describe('UtmPropsEvent', () => {
  describe('valid ungoverned event', () => {
    it('turns ppc to cpc', () => {
      const event = v1EventFactory({
        url: "https://www.ezcater.com?mcx=gf1&utm_medium=ppc&ads_id=4&cname=520-grill&ftype=grill&ads_cmpid=310044204&ads_adid=22600834164&ads_matchtype=e&ads_network=s&ads_creative=84745688244&ads_kw=520%20%20grill%20%20aspen&ads_targetid=kwd-127649039604&gclid=CNfW-vbe1MsCFQYuaQodV90FEg",
        referrer_url: null
      })
      const result = UtmPropsEvent(event)
      
      expect(result).toEqual({
        utm_medium: "cpc", utm_term: "520  grill  aspen",
        gclid: "cnfw-vbe1mscfqyuaqodv90feg"
      })
    })
  });

  describe('private store', () => {
    it('caterer link', () => {
      const event = v1EventFactory({
        url: "https://www.ezcater.com/catering/pvt/atlanta-bread-company-buford",
        referrer_url: "http://atlantabread.com/locations/?zip=30041"
      })
      const result = UtmPropsEvent(event)
      expect(result).toEqual({
        utm_medium: "private_store", utm_source: "atlantabread"
      })
    })

    it('brand link', () => {
      const event = v1EventFactory({
        url: "https://www.ezcater.com/brand/pvt/atlanta-bread-company",
        referrer_url: "http://atlantabread.com/locations/?zip=30041"
      })
      const result = UtmPropsEvent(event)
      expect(result).toEqual({
        utm_medium: "private_store", utm_source: "atlantabread"
      })
    })

    it('promo link', () => {
      const event = v1EventFactory({
        url: "https://www.ezcater.com/brand/pvt/atlanta-bread-company?afp=1234&utm_medium=comarketing&utm_source=ezo&utm_campaign=fakepromo1",
        referrer_url: "http://atlantabread.com/locations/?zip=30041"
      })
      const result = UtmPropsEvent(event)
      expect(result).toEqual({
        utm_medium: "comarketing", utm_campaign: "fakepromo1", utm_source: "ezo"
      })
    })
  })

  it('adds utms when fbclid is present', () => {
    const event = v1EventFactory({
      url: "https://www.ezcater.com?fbclid=12345",
      event: "web-landing"
    })
    const result = UtmPropsEvent(event)
    expect(result).toEqual({
      utm_source: "facebook"
    })
  })

  it('does not overwrite source without a medium', () => {
    const event = v1EventFactory({
      url: "https://www.ezcater.com?utm_source=refer_a_friend",
      event: "web-landing"
    })
    const result = UtmPropsEvent(event)
    expect(result).toEqual({
      utm_source: "refer_a_friend"
    });
  });

  it('falls back to landing_url when url is absent for web-landing events', () => {
    const event = v1EventFactory({
      event: "web-landing",
      url: null,
      referrer_url: null,
      landing_url: "https://www.ezcater.com/brand/boloco?utm_medium=display"
    })
    const webLandingEvent = UtmPropsEvent(event)
    expect(webLandingEvent).toEqual({
      utm_medium: "display"
    });

    const event_two = v1EventFactory({
      event: "some other event",
      url: null,
      landing_url: "https://www.ezcater.com/brand/boloco?utm_medium=display"
    })
    const result_two = UtmPropsEvent(event_two)
    expect(result_two).toEqual({});
  });

  it('handles an invalid url string', () => {
    const event_two = v1EventFactory({
      event: "anything",
      url: "foo:bar"
    });
    const result = UtmPropsEvent(event_two)
    expect(result).toEqual({});
  });
});
