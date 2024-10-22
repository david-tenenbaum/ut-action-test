import { describe, expect, it, beforeEach, vi } from "vitest";
import RawEventProcessingConsumer from "../../utils/rawEventProcessingConsumer";

describe("RawEventProcessingConsumer", () => {
  let event;
  let rawEvent;

  beforeEach(() => {
    rawEvent = {
      category: "category",
      sub_category: "sub_category",
      event: "event",
      url: "http://www.someurl.com",
      event_name: "event_name",
    };

    event = {
      properties: {
        v1_event: JSON.stringify({
          app_name: "ezrails",
          created_at: 1541172617,
          raw_event: {
            ...rawEvent,
          },
        }),
        tracking_id: "769f653b-40e3-428c-a493-ad3b43f1dded",
        legacy_event: JSON.stringify({
          application: "ezrails",
          misc_json: JSON.stringify({ key: "value" }),
        }),
      },
    };
  });

  const getProcessedEvent = () => RawEventProcessingConsumer.process(event);

  describe("process", () => {
    describe("with an invalid payload", () => {
      it("returns undefined", () => {
        event.properties.v1_event = {
          app_name: "ezrails",
          created_at: 1541172617,
        };
        const processedEvent = getProcessedEvent();

        expect(processedEvent).toBeUndefined();
      });
    });

    describe("with a valid event", () => {
      it("returns the transformed event with merged raw event payload", () => {
        const processedEvent = getProcessedEvent();

        expect(processedEvent).toEqual({
          app_name: "ezrails",
          category: "category",
          sub_category: "sub_category",
          event: "event",
          url: "http://www.someurl.com",
          event_name: "event_name",
          created_at: "2018-11-02T15:30:17.000Z",
        });
      });

      it("removes the raw_event key", () => {
        const processedEvent = getProcessedEvent();

        expect(processedEvent.raw_event).toBeUndefined();
      });

      describe("when both event payload and raw_event payload has the same key", () => {
        it("raw_event payload takes precedence", () => {
          event.properties.v1_event = JSON.stringify({
            app_name: "ezrails",
            created_at: 1541172617,
            raw_event: {
              ...rawEvent,
              event_name: "new_event_name",
            },
          });
          const processedEvent = getProcessedEvent();

          expect(processedEvent.event_name).toBe("new_event_name");
        });
      });

      describe("when we receive a 10 digit integer", () => {
        it("transforms to iso8601", () => {
          const processedEvent = getProcessedEvent();

          expect(processedEvent.created_at).toBe("2018-11-02T15:30:17.000Z");
        });
      });

      describe("when we receive a 13 digit integer", () => {
        it("transforms to an iso8601 maintaining the milliseconds", () => {
          event.properties.v1_event = JSON.stringify({
            app_name: "ezrails",
            created_at: 1541172617678,
            raw_event: rawEvent,
          });
          const processedEvent = getProcessedEvent();

          expect(processedEvent.created_at).toBe("2018-11-02T15:30:17.678Z");
        });
      });

      describe("when we receive an string", () => {
        it("transforms to iso8601(3)", () => {
          event.properties.v1_event = JSON.stringify({
            app_name: "ezrails",
            created_at: "2018-10-26T09:32:07.709-0400",
            raw_event: rawEvent,
          });
          const processedEvent = getProcessedEvent();

          expect(processedEvent.created_at).toBe("2018-10-26T13:32:07.709Z");
        });
      });

      describe("when we receive a string that looks like an integer", () => {
        it("transforms to iso8601", () => {
          event.properties.v1_event = JSON.stringify({
            app_name: "ezrails",
            created_at: "1541172617678",
            raw_event: rawEvent,
          });
          const processedEvent = getProcessedEvent();

          expect(processedEvent.created_at).toBe("2018-11-02T15:30:17.678Z");
        });
      });

      describe("when we receive a time string in Arabic", () => {
        it("transforms to iso8601", () => {
          event.properties.v1_event = JSON.stringify({
            app_name: "ezrails",
            created_at: "٢٠١٨-٠٨-١٤T٠١:٣٧:١٥+0300",
            raw_event: rawEvent,
          });
          const processedEvent = getProcessedEvent();

          expect(processedEvent.created_at).toBe("2018-08-13T22:37:15.000Z");
        });
      });

      // describe("when we receive a class other than integer or string", () => {
      //   it("transforms to the current time in iso8601", () => {
      //     vi.useFakeTimers();
      //     vi.setSystemTime(new Date(2024, 9, 16, 7, 40, 40, 20));

      //     event.properties.v1_event = JSON.stringify({
      //       app_name: "ezrails",
      //       created_at: 0.02,
      //       raw_event: rawEvent,
      //     });
      //     const processedEvent = getProcessedEvent();
      //     console.log("processedEvent.created_at:", processedEvent.created_at)
      //     expect(processedEvent.created_at).toBe("2024-10-16T07:40:40.020Z");

      //     vi.useRealTimers();
      //   });
      // });
    });
  });
});
