import { SEARCH_ENGINES } from "../constant";
import { UrlParser } from "../URLParser";

export class FallbackProperties {
  constructor(event) {
    this.event = event;
  }

  static properties(event) {
    return new FallbackProperties(event).properties;
  }

  get properties() {
    return (
      this.raf ||
      this.organic ||
      this.affiliate ||
      this.corpAccountSignup ||
      this.referral ||
      this.direct
    );
  }

  get affiliate() {
    if (/\/order\//.test(this.url)) {
      return {
        utm_medium: "affiliate",
        utm_source: this.referrerDomain,
      };
    }
  }

  get corpAccountSignup() {
    const match = /^\/store\/corp_account_signup\/(?<slug>.*)/.exec(this.path);

    if (match) {
      return {
        utm_medium: "corporate",
        utm_source: "enterprise",
        utm_campaign: match.groups.slug,
      };
    }
  }

  get raf() {
    if (/^\/raf\//.test(this.path)) {
      return {
        utm_medium: "viral",
        utm_source: "refer_a_friend",
      };
    }
  }

  get organic() {
    if (SEARCH_ENGINES.includes(this.referrerDomain)) {
      return {
        utm_medium: "organic",
        utm_source: this.referrerDomain,
      };
    }
  }

  get direct() {
    return { utm_medium: "direct", utm_source: "direct" };
  }

  get referral() {
    if (this.referrerDomain && this.referrerDomain !== "ezcater") {
      return { utm_medium: "referral", utm_source: this.referrerDomain };
    }
  }

  get url() {
    return this.event["url"];
  }

  get path() {
    return UrlParser.path(this.url);
  }

  get referrerUrl() {
    return this.event["referrer_url"];
  }

  get referrerDomain() {
    return UrlParser.domain(this.referrerUrl);
  }
}
