export function getTransformedEvent(event) {
  // Create a shallow copy of the event to avoid mutating the input object
  const transformedEvent = { ...event };

  // Ensure properties exist and alphabetize them
  if (transformedEvent.properties) {
    transformedEvent.properties = Object.keys(transformedEvent.properties)
      .sort()
      .reduce((obj, key) => {
        obj[key] = transformedEvent.properties[key];
        return obj;
      }, {});
  }

  // Standardize the event name
  transformedEvent.event = "transformed-event";

  return transformedEvent;
}
