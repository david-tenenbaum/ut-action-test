import { describe, expect, it } from 'vitest';
import { formatEvent } from '../formatEvent.js';
import UngovernedEventPayloadFactory from '../factories/UngovernedEventPayloadFactory.js';
import { PIPELINE_VERSION } from '../constant.js';

describe('formatEvent', () => {
  it('transforms legacy_event to v1_event when payload.v1_event is null', () => {
    const legacyEventPayload = UngovernedEventPayloadFactory({
        v1_event: null,
        tracking_id: 'test-tracking-id',
    });
    const result = formatEvent(legacyEventPayload);

    expect(result.v1_event).toBeDefined();
    expect(result.v1_event.tracking_id).toBe('test-tracking-id');
    expect(result.v1_event.app_name).toBe('ezrails');
    expect(result.v1_event.raw_event).not.toBe(null);
    expect(result.v1_event.pipeline_version).toBe(PIPELINE_VERSION);
  });

  it('transforms legacy_event to v1_event when payload.v1_event is "null"', () => {
    const legacyEventPayload = UngovernedEventPayloadFactory({
      v1_event: "null",
      tracking_id: 'test-tracking-id',
  });
  const result = formatEvent(legacyEventPayload);

  expect(result.v1_event).toBeDefined();
  expect(result.v1_event.tracking_id).toBe('test-tracking-id');
  expect(result.v1_event.app_name).toBe('ezrails');
  expect(result.v1_event.raw_event).not.toBe(null);
  expect(result.v1_event.pipeline_version).toBe(PIPELINE_VERSION);
});

  it('returns the v1_event when it is not null or "null"', () => {
    const v1EventPayload = UngovernedEventPayloadFactory({ tracking_id: 'v1_tracking_id'})
    const result = formatEvent(v1EventPayload);

    expect(result.v1_event.tracking_id).toEqual('v1_tracking_id');
    expect(result.v1_event.raw_event).toBeTypeOf('string');
  });

  it('parses misc_json in legacy_event correctly', () => {
    const legacyEventPayload = UngovernedEventPayloadFactory({
      v1_event: "null",
      tracking_id: 'test-tracking-id',
      legacy_event: JSON.stringify({
        application: 'ezrails',
        misc_json: JSON.stringify({ key: 'value' })
      })
    });

    const result = formatEvent(legacyEventPayload);

    expect(result.v1_event).toBeDefined();

    const rawEvent = JSON.parse(result.v1_event.raw_event);
    expect(rawEvent.misc_json).toEqual({ key: 'value' });
  });
});
