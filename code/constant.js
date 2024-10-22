export const IOS_ANONYMOUS_TRACKING_ID = "00000000-0000-0000-0000-000000000000";
export const KNOWN_BOT_FILTER_LIST = [
  "kube-probe/1.10",
  "teracent-feed-processing",
  "Datadog Agent/0.0.0",
  "weborama-fetcher (+http://www.weborama.com)",
  "BrightEdge Crawler/1.0 (crawler@brightedge.com)",
  "ezLandingsBot",
];
export const REQUIRED_PARAMS = ["category", "event", "tracking_id"];
export const BAD_UUID = /^[a-zA-Z0-9\-_]{1,255}$/;
export const OTHER_INTERESTING_UTMS = [
  "utm_ad_expt",
  "utm_adgroup",
  "utm_adgroup_id",
  "utm_adgroup_name",
  "utm_campaign",
  "utm_campaign_id",
  "utm_content",
  "utm_device",
  "utm_exprt",
  "utm_exprt_ad",
  "utm_file",
  "utm_geo",
  "utm_keyword_format",
  "utm_matchtype",
  "utm_rematchtype",
  "utm_spid",
  "utm_upload_version",
  "gclid",
];
export const SEARCH_ENGINES = [
  "aol",
  "ask",
  "bing",
  "duckduckgo",
  "google",
  "yahoo",
];
export const PIPELINE_VERSION = "2";
