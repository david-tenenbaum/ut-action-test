// import { PIPELINE_VERSION } from 'constant';

export function formatEvent(payload, pipelineVersion) {
  const args = payload.properties;

  // Check if v1_event is null or "null"
  if (!args.v1_event || args.v1_event === 'null') {
    // Process legacy event (similar to Rails process_raw_event)
    const rawEvent = processRawEvent(args.legacy_event);
    return {
      v1_event: {
        tracking_id: args.tracking_id.toString(),
        app_name: rawEvent.application || args.sub_category, // Can be either application or sub_category
        pipeline_version: pipelineVersion,
        created_at: Math.floor(Date.now()), // Ensure its an integer in milliseconds
        raw_event: JSON.stringify(rawEvent), // Convert to JSON format
      },
    };
  }

  let processedV1Event = processRawEvent(args.v1_event);
  let newV1Event = {
    ...processedV1Event,
  };

  if (
    processedV1Event.raw_event &&
    typeof processedV1Event.raw_event === 'object'
  ) {
    newV1Event.raw_event = JSON.stringify(processedV1Event.raw_event);
  }

  return {
    v1_event: newV1Event,
  };
}

function processRawEvent(rawEvent) {
  try {
    // Parse the raw event
    let jsonEvent = JSON.parse(rawEvent);

    // If misc_json exists and is not empty, parse it
    if (jsonEvent.misc_json && jsonEvent.misc_json !== 'null') {
      jsonEvent.misc_json = JSON.parse(jsonEvent.misc_json);
    }

    // Return the processed event as a JSON object
    return jsonEvent;
  } catch (e) {
    // If parsing fails, return the raw event
    return rawEvent;
  }
}
