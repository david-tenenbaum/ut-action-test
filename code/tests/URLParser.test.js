import { describe, it, expect } from 'vitest';
import { UrlParser } from '../URLParser';

describe('UrlParser', () => {
  it('parses the domain correctly', () => {
    const url = 'https://www.ezcater.com/catering/thai-delight';
    const parser = new UrlParser(url);
    expect(parser.domain()).toBe('ezcater');
  });

  it('returns null for domain if host is invalid', () => {
    const url = 'invalid:url';
    const parser = new UrlParser(url);
    expect(parser.domain()).toBeNull;
  });

  it('parses the host correctly', () => {
    const url = 'https://www.ezcater.com/catering';
    const parser = new UrlParser(url);
    expect(parser.host()).toBe('www.ezcater.com');
  });

  it('returns null for host if URL is invalid', () => {
    const url = 'foo:bar';
    const parser = new UrlParser(url);
    expect(parser.host()).toBeNull;
  });

  it('parses the path correctly', () => {
    const url = 'https://www.ezcater.com/catering/thai-delight';
    const parser = new UrlParser(url);
    expect(parser.path()).toBe('/catering/thai-delight');
  });

  it('returns an empty string for path if URL is invalid', () => {
    const url = 'invalid';
    const parser = new UrlParser(url);
    expect(parser.path()).toBe('');
  });

  it('parses query params correctly', () => {
    const url = 'https://www.ezcater.com/catering?utm_source=google&utm_medium=cpc';
    const parser = new UrlParser(url);
    expect(parser.queryParams()).toEqual({
      utm_source: 'google',
      utm_medium: 'cpc',
    });
  });

  it('returns an empty object if URL has no query params', () => {
    const url = 'https://www.ezcater.com/catering';
    const parser = new UrlParser(url);
    expect(parser.queryParams()).toEqual({});
  });

  it('returns an empty object for query params if URL is invalid', () => {
    const url = 'foo:bar';
    const parser = new UrlParser(url);
    expect(parser.queryParams()).toEqual({});
  });

  it('parses the source domain correctly', () => {
    const url = 'https://subdomain.ezcater.com/catering';
    const parser = new UrlParser(url);
    expect(parser.sourceDomain()).toBe('ezcater.com');
  });

  it('returns null for source domain if host is invalid', () => {
    const url = 'invalid:url';
    const parser = new UrlParser(url);
    expect(parser.sourceDomain()).toBe(undefined);
  });
});
