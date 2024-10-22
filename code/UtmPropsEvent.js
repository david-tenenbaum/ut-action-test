
// Suppose to mimic https://github.com/ezcater/ez-tracking-service/blob/main/app/models/raw_processor.rb#L58-L118
import { UrlParser } from "./URLParser";
import { OTHER_INTERESTING_UTMS } from "./constant";

export function UtmPropsEvent(event) {
  let eventProps = event['raw_event']['event_props']

  const referrerDomain = UrlParser.domain(eventProps.referrer_url)
  let query_params = utmQueryParams(eventProps)

  if (referrerDomain == "ezcater") {
    const queryParamsReferrerUrl = UrlParser.queryParams(eventProps.referer_url)
    query_params = { ...queryParamsReferrerUrl, ...query_params }
  }
  let medium = query_params.utm_medium
  let source = query_params.utm_source

  if (query_params.utm_medium === "ppc") medium = "cpc";
  if (query_params.utm_source === "adwords") source = "google";

  if (!medium) {
    if ("gclid" in query_params) {
      medium = "cpc";
      source = "google";
    } else if ("aff" in query_params) {
      medium = "affiliate";
      source = referrerDomain;
    } else if (privateStoreUrl(eventProps.url)) {
      medium = "private_store";
      source = referrerDomain;
    } else if ("fbclid" in query_params) {
      source = "facebook";
    }
  }

  let marketingProperties = {
    utm_medium: medium,
    utm_source: source,
    utm_term: query_params.utm_term || query_params.ads_kw,
    utm_account: query_params.utm_account,
    h1_title: query_params.h1title,
  }

  let extraMarketingQueryParams = sliceQueryParams(query_params, OTHER_INTERESTING_UTMS)
  marketingProperties = { ...extraMarketingQueryParams, ...marketingProperties }
  let compactedMarketingProperties = compactObject(marketingProperties)
  let transformedMarketingProperties = lowercaseValues(compactedMarketingProperties)

  return transformedMarketingProperties
}

const lowercaseValues = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value.toLowerCase()
    ])
  );

function compactObject(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));
}

function sliceQueryParams(queryParams, keys) {
  const result = {};
  for (const key of keys) {
    if (key in queryParams) {
      result[key] = queryParams[key];
    }
  }
  return result;
}

function utmQueryParams(event) {
  if (!event.url && event.event === "web-landing") {
    return UrlParser.queryParams(event.landing_url);
  }

  return UrlParser.queryParams(event.url);
}

function privateStoreUrl(landingUrl) {
  const path = UrlParser.path(landingUrl);

  return path.startsWith("/catering/pvt/") || path.startsWith("/brand/pvt/");
}