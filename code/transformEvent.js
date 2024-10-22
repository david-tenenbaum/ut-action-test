import { getTransformedEvent } from 'getTransformedEvent';

import { PIPELINE_VERSION } from 'pipelineVersion';
import { formatEvent } from 'formatEvent';

export function transformEvent(event, metadata) {
  return getTransformedEvent(event);
}
