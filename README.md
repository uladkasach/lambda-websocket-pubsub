# lambda-websocket-pubsub

a library for managing websocket communication for aws lambdas + api gateway in a pubsub way

# features

- subscribe a consumer to a topic
- unsubscribe a consumer from a topic
- publish data to all consumers of a topic

# installation

to use this package, you'll need to both install the module and provision a dynamodb table

### installing the package

```
npm install --save lambda-websocket-pubsub
```

### provisioning the dynamodb table

please provision a dynamodb table which has the following settings:

```js
{
  billingMode: 'PAY_PER_REQUEST',

  attributes: [
    {
      name: 'p', // p = partition key: the lookup index
      type: 'S', // string
    },
    {
      name: 'u', // u = "secondary key": defines the unique key of this entity, in conjunction w/ the partition key
      type: 'S', // string
    },
    {
      name: 'p2', // p2 = secondary index partition key: a different lookup index
      type: 'S', // string
    },
  ],

  hashKey: 'p', // partition key
  rangeKey: 'u', // "secondary key"; defines "uniqueness" (p + u = unique entity)

  globalSecondaryIndexes: [
    {
      name: 'SecondaryIndex',
      hashKey: 'p2', // define a second index, for alternate table lookups
      projectionType: 'ALL',
    },
  ],
}
```

Note: the above syntax is targeted towards pulumi and the naming convention reflects that of both pulumi and terraform. If you are provisioning the database manually, AWS calls the `hashKey` the `partitionKey` and the `rangeKey` the `sortKey`.

Note: to see the actual pulumi configuration that provisioned the integration test database, please see the `provision/pulumi` directory

# usage

this module is designed to plug directly into your business logic - and potentially even your lambda handlers for some cases.

### managing subscriptions w/ websocket events

the example below sets up a handler that:

- subscribes a websocket connection (i.e., consumer) to messages from a topic when they send a message through the websocket with the data `{ action: 'SUBSCRIBE', topicId: 'some-uuid-or-other-identifier' }`
- unsubscribes a websocket connection (i.e., consumer) from all of its subscriptions, on disconnect

the result is that any time a message is published to the topic the consumer subscribed to, the consumer will get pushed that message pushed to them through the websocket connection.

```ts
import { APIGatewayEvent, Context } from 'aws-lambda';
import { extractConsumerFromApiGatewayEvent, subscribeToTopic, unsubscribeFromAllTopics } from 'lambda-websocket-pubsub';

export enum WebSocketEventType {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  DEFAULT = 'DEFAULT',
}

const lwpConfig = {
  dynamodbTableName: 'super-important-subscriptions',
};

const response = {
  badRequest: { statusCode: 400 },
  success: { statusCode: 200 },
};

const websocketHandler = async (event: APIGatewayEvent, context: Context) => {
  // extract relevant data from the event
  const consumer = extractConsumerFromApiGatewayEvent({ event });
  const eventType = event.requestContext.eventType as WebSocketEventType;

  // handle each event type
  if (eventType === WebSocketEventType.CONNECT) {
    // do nothing
  } else if (eventType === WebSocketEventType.DISCONNECT) {
    await unsubscribeFromAllTopics({ consumer, config: lwpConfig });
  } else {
    // 1. parse and validate the request
    const payload = (() => {
      // define payload in an immediately invoked function to use a try catch while still ensuring that its a `const`
      try {
        if (!event.body) throw new Error('no body');
        return JSON.parse(event.body);
      } catch (error) {
        logger.warn(context, 'error extracting payload from message', { body: event.body, error });
        return null;
      }
    })();
    it (!payload) return response.badRequest; // if no payload, bad request
    if (payload.action !== 'SUBSCRIBE') return response.badRequest; // if not a supported action, bad request
    if (!payload.topicId) return response.badRequest; // if the topicId is not defined, bad request;
    // NOTE: you may want to add additional validation for your use case here

    // 2. given the consumer and the topic id are well defined, lets subscribe them
    await subscribeToTopic({ consumer, topicId, config: lwpConfig });
  }

  // return successful response if reached here
  return response.success;
};
```

### sending messages to subscribers

Now that we have subscriptions to topics being handled with the example above, the last piece is to send data to consumers.

Good news, its super simple. Just run the `publishToTopic` method anywhere in your code and it will publish any `data` to all consumers subscribed to that same `topicId`.

```ts
import { publishToTopic } from 'lambda-websocket-pubsub';
const lwpConfig = {
  dynamodbTableName: 'super-important-subscriptions',
};
await publishToTopic({ topicId, data, config: lwpConfig });
```
