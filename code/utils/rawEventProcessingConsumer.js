import { formatEvent } from "../formatEvent";

export default class RawEventProcessingConsumer {
  constructor(event) {
    this.event = event;
  }

  static process(event) {
    const formattedEvent = formatEvent(event);

    if (formattedEvent) {
      return new RawEventProcessingConsumer(formattedEvent.v1_event).process;
    }
  }

  get process() {
    try {
      if (this.isInvalidPayload) return;

      let newEventPayload = {
        ...this.event,
        ...JSON.parse(this.event.raw_event),
      };

      delete newEventPayload.raw_event;

      this.event = newEventPayload;
      this.event.created_at = this.parseCreatedAt;

      return this.event;
    } catch (e) {
      console.log(e);
    }
  }

  get isInvalidPayload() {
    if (this.event.hasOwnProperty("raw_event")) return false;

    return true;
  }

  get parseCreatedAt() {
    const eventCreatedAt = this.event.created_at;

    if (Number.isInteger(eventCreatedAt) || /^\d+$/.test(eventCreatedAt)) {
      return this.parseIntegerTimestamp;
    } else if (typeof eventCreatedAt === "string") {
      const translated = this.translateTimeStrings;

      return new Date(translated).toISOString();
    } else {
      return new Date(Math.floor(Date.now())).toISOString();
    }
  }

  get parseIntegerTimestamp() {
    const eventCreatedAt = parseInt(this.event.created_at, 10);

    if (Math.log10(eventCreatedAt) > 10) {
      const seconds = Math.floor(eventCreatedAt / 1000);
      const milliseconds = eventCreatedAt % 1000;

      return new Date(seconds * 1000 + milliseconds).toISOString();
    } else {
      return new Date(eventCreatedAt * 1000).toISOString();
    }
  }

  get translateTimeStrings() {
    const eventCreatedAt = this.event.created_at;
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    const westernNumerals = "0123456789";

    let translatedString = eventCreatedAt
      .split("")
      .map((char) => {
        const index = arabicNumerals.indexOf(char);
        return index !== -1 ? westernNumerals[index] : char;
      })
      .join("");

    return translatedString;
  }
}
