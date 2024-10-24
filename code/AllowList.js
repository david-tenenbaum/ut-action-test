export class Allowlist {
    static ENTRIES = [
        'account_source',
        'account_type',
        'action',
        'advocate_email',
        'api_version',
        'app_name',
        'app_version',
        'begin_on',
        'brand_id',
        'browser_height',
        'browser_width',
        'call_sid',
        'call_sid_source',
        'call_status',
        'category',
        'caterer_count',
        'caterer_id',
        'caterer_uuid',
        'client',
        'close_order_ids',
        'closest_order_id',
        'controller',
        'created_at',
        'delivery_id',
        'device_name',
        'device_os_version',
        'digits',
        'direction',
        'driver_id',
        'email',
        'email_body',
        'email_subject',
        'event',
        'event_name',
        'event_source',
        'experiment_result',
        'experiment_test',
        'expire_on',
        'filter_name',
        'filter_value',
        'focus',
        'from',
        'from_city',
        'from_country',
        'from_state',
        'from_zip',
        'address_string',
        'group_tracking_id',
        'id',
        'instance',
        'invite_first_name',
        'invite_last_name',
        'invite_name',
        'ip_address',
        'key',
        'landing_url',
        'language',
        'lead_channel',
        'lead_upload_id',
        'loadtime',
        'location_enabled_status',
        'menu_item_id',
        'method',
        'minutes_to_event',
        'misc_json',
        'name_override',
        'order_id',
        'order_source',
        'origin',
        'original_user_agent',
        'other_tracking_id',
        'page',
        'page_interactive',
        'params_action',
        'params_controller',
        'pipeline_version',
        'pixel_ratio',
        'platform_name',
        'pmt_id',
        'pmt_type',
        'private_store',
        'project',
        'promo_code',
        'promo_name',
        'question_response',
        'rate_change',
        'record_created_at',
        'referral_code',
        'referral_date',
        'referred_email',
        'referrer_url',
        'reg_source',
        'result',
        'revenue',
        'rid',
        'screen_size',
        'search_id',
        'search_keyword',
        'search_result_count',
        'server_response',
        'sort_user_type',
        'sort_weights',
        'source',
        'staples_partnership',
        'state',
        'status',
        'street',
        'sub_category',
        'subscription_locked',
        'subscription_plan_rate',
        'subscription_reason',
        'to',
        'tracking_id',
        'type',
        'ui_element_name',
        'unique_record_id',
        'url',
        'user_agent',
        'user_created_at',
        'user_properties',
        'user_type',
        'utm_adgroup_name',
        'utm_spid',
        'value',
        'variant',
    ];

    static process(hash) {
        return Object.keys(hash)
            .filter(key => Allowlist.ENTRIES.includes(key))
            .reduce((acc, key) => {
                acc[key] = hash[key];
                return acc;
            }, {});
    }
}
