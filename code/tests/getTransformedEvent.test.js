import { describe, expect, it, test } from 'vitest'
import { getTransformedEvent } from '../getTransformedEvent';

describe('getTransformedEvent', () => {
  const originalEvent = { event: 'original-event', properties: { b: 'value1', a: 'value2' }, otherField: 'otherValue' };
  const expectedTransformedEvent = { event: 'transformed-event', properties: { a: 'value2', b: 'value1' }, otherField: 'otherValue' };

  // All in one
  it('transforms event name to "transformed-event"', () => {
    const transformedEvent = getTransformedEvent(originalEvent);
    expect(transformedEvent).toEqual(expectedTransformedEvent);
  });

  // Vs individual tests
  it('transforms event name to "transformed-event"', () => {
    const inputEvent = { event: 'original-event', properties: {} };
    const transformedEvent = getTransformedEvent(inputEvent);
    expect(transformedEvent.event).toBe('transformed-event');
  });

  it('retains original properties', () => {
    const inputEvent = { event: 'original-event', properties: { key1: 'value1', key2: 'value2' } };
    const transformedEvent = getTransformedEvent(inputEvent);
    expect(transformedEvent.properties).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('alphabetizes properties', () => {
    const inputEvent = { event: 'original-event', properties: { b: 'value2', a: 'value1' } };
    const transformedEvent = getTransformedEvent(inputEvent);
    expect(transformedEvent.properties).toEqual({ a: 'value1', b: 'value2' });
  });

  it('handles empty properties object', () => {
    const inputEvent = { event: 'original-event', properties: {} };
    const transformedEvent = getTransformedEvent(inputEvent);
    expect(transformedEvent.properties).toEqual({});
  });

  it('does not modify other event fields', () => {
    const inputEvent = { event: 'original-event', properties: { key1: 'value1' }, otherField: 'otherValue' };
    const transformedEvent = getTransformedEvent(inputEvent);
    expect(transformedEvent.otherField).toBe('otherValue');
  });
});
