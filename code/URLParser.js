import psl from 'psl';
import { URL } from 'url';

export class UrlParser {
  constructor(url) {
    this.url = url;
  }

  static domain(url) {
    return new UrlParser(url).domain();
  }

  static host(url) {
    return new UrlParser(url).host();
  }

  static path(url) {
    return new UrlParser(url).path();
  }

  static queryParams(url) {
    return new UrlParser(url).queryParams();
  }

  domain() {
    const host = this.host();
    const sourceDomain = this.sourceDomain();

    if (!host || !sourceDomain) {
      return null;
    }

    return sourceDomain.split('.').shift();
  }

  host() {
    try {
      return new URL(this.url).hostname.toLowerCase();
    } catch (error) {
      console.debug(`Invalid host in URL: ${this.url}`);

      return null;
    }
  }

  path() {
    try {
      return new URL(this.url).pathname || '';
    } catch (error) {
      console.debug(`Invalid path in URL: ${this.url}`);
      return '';
    }
  }

  queryParams() {
    try {
      const queryString = new URL(this.url).search;
      return this.parseQueryString(queryString);
    } catch (error) {
      if (error.message === 'Invalid URL') {
        return {};
      }
      return {};
    }
  }

  parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value || null;
    }
    return result;
  }

  sourceDomain() {
    try {
      const host = this.host();
      const parsedUrl = psl.parse(host);
      return parsedUrl.domain;
    } catch (error) {
      return null;
    }
  }
}

