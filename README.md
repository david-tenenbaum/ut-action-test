# Test and Publish RudderStack Transformations

Version control and test the transformations we use in Rudderstack.
[docs](https://github.com/rudderlabs/rudder-transformation-action)

## Transformations
To create a new transformation, create a transformation file and list it
in the transformations meta object.
Transformations are javascript objects that take an event and metadata
and return a key-value hash. For instance:
```
export function transformEvent(event, metadata) {
   return {
    email: event.properties?.email,
    city: getCity(event.context?.traits?.address || {}),
    compliment: "nice place to live!",
  }
} # i haven't tested this, it might not work
```

## Libraries
A library is a collection of JavaScript utility objects. For instance,
to enrich your event with a `city` attribute built from an `address`
attribute:
```
export function getCity(address) {
  return (address && address.city) || "no data found";
}
```

## Examples
For examples, see code/examples and code/example_meta.json.
# ut-action-test
