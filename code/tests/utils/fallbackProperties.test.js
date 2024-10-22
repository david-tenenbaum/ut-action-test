import { describe, expect, it, beforeEach } from "vitest";
import { FallbackProperties } from "../../utils/fallbackProperties";
import { SEARCH_ENGINES } from "../../constant";

describe("FallbackProperties", () => {
  let url;
  let referrer_url;

  beforeEach(() => {
    url = null;
    referrer_url = null;
  });

  const getFallbackProps = () =>
    FallbackProperties.properties({ url, referrer_url });

  describe("properties", () => {
    it("with no landing or referrer data", () => {
      expect(getFallbackProps()).toEqual({
        utm_medium: "direct",
        utm_source: "direct",
      });
    });

    it("with a refer-a-friend URL", () => {
      url = "https://ezcater.com/raf/123";

      expect(getFallbackProps()).toEqual({
        utm_medium: "viral",
        utm_source: "refer_a_friend",
      });
    });

    it('with a non-refer-a-friend URL that contains "/raf"', () => {
      url = "https://ezcater.com/catering/rafaels";

      expect(getFallbackProps()).toEqual({
        utm_medium: "direct",
        utm_source: "direct",
      });
    });

    SEARCH_ENGINES.forEach((domain) => {
      it(`with a referrer domain of ${domain}`, () => {
        referrer_url = `https://${domain}.com/some/path`;

        expect(getFallbackProps()).toEqual({
          utm_medium: "organic",
          utm_source: domain,
        });
      });
    });

    it("with a referral", () => {
      referrer_url = "https://affiliate.example.com";

      expect(getFallbackProps()).toEqual({
        utm_medium: "referral",
        utm_source: "example",
      });
    });

    it("with an ezcater.com referral", () => {
      referrer_url = "https://www.ezcater.com";

      expect(getFallbackProps()).toEqual({
        utm_medium: "direct",
        utm_source: "direct",
      });
    });

    it("with an affiliate", () => {
      url = "https://www.ezcater.com/order/123";
      referrer_url = "https://www.example.com";

      expect(getFallbackProps()).toEqual({
        utm_medium: "affiliate",
        utm_source: "example",
      });
    });

    it("with a corporate account signup url", () => {
      url =
        "https://www.ezcater.com/store/corp_account_signup/veridian-technologies";
      referrer_url = "https://www.veridian-technologies.com";

      expect(getFallbackProps()).toEqual({
        utm_medium: "corporate",
        utm_source: "enterprise",
        utm_campaign: "veridian-technologies",
      });
    });
  });
});
