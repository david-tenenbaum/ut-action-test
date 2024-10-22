import { describe, it, expect } from 'vitest';
import { processEvent } from '../processEvent';
import v1EventFactory from '../factories/v1EventFactory';

describe("processEvent function", () => {
  it("should process a standard event", () => {
    const eventPayload = v1EventFactory({
      event: "some event",
      category: "some category",
    });

    const processedEvents = processEvent(eventPayload);
    expect(processedEvents[0].event_name).toEqual("Some Category: some event");
    expect(processedEvents[0].unique_record_id).toBeDefined();
  });

  it("should correctly handle modal events", () => {
    const eventPayload = v1EventFactory({
      event: "locations-modal-open",
      category: "store modal",
    });

    const processedEvents = processEvent(eventPayload);
    expect(processedEvents[0].event_name).toEqual("Store Modal: locations-modal-open");
  });

  it("should include browser properties from EzBrowser", () => {
    const eventPayload = v1EventFactory({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    });

    const processedEvents = processEvent(eventPayload);

    expect(processedEvents[0].platform_name).toEqual("Windows");
  });

  it("should include ezcater properties from EzBrowser", () => {
    const eventPayload = v1EventFactory({
      userAgent: "ezCater/1.4.1 (iPhone) iOS/10.2.0",
      platform_name: "mobile",
    });

    const processedEvents = processEvent(eventPayload);
    expect(processedEvents[0].platform_name).toEqual("mobile");
  });

  it("should include ezmanage properties from EzBrowser", () => {
    const eventPayload = v1EventFactory({
      userAgent: "ezManage/1.4.1 (iPad) iOS/10.2.0",
      platform_name: "tablet",
    });

    const processedEvents = processEvent(eventPayload);

    expect(processedEvents[0].platform_name).toEqual("tablet");
  });
});
