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
import { APIGatewayEvent } from 'aws-lambda';
import { extractConsumerFromApiGatewayEvent, subscribeToTopic, unsubscribeFromAllTopics } from 'lambda-websocket-pubsub';

export enum WebSocketEventType {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  DEFAULT = 'DEFAULT',
}

const lwpConfig = {
  dynamodbTableName: 'super-important-subscriptions',
};

const websocketHandler = async (event: APIGatewayEvent) => {
  // extract relevant data from the event
  const consumer = extractConsumerFromApiGatewayEvent({ event });
  const eventType = event.requestContext.eventType as WebSocketEventType;

  // handle each event type
  if (eventType === WebSocketEventTypes.CONNECT) {
    // do nothing
  } else if (eventType === WebSocketEventTypes.DISCONNECT) {
    await unsubscribeFromAllTopics({ consumer, config: lwpConfig });
  } else {
    // extract the payload
    const payload = JSON.parse(event.body);
    if (payload.action !== 'SUBSCRIBE') return; // don't do anything unless the client explicitly asked to 'subscribe'

    // since the user asked to subscribe, check that the payload includes the topicId
    const topicId = payload.topicId; // note: in practice, you should probably have the user pass this value as a property that has more meaning for your use case (e.g., `chatThreadUuid` instead of `topicId`)
    if (!topicId) throw new Error('subscription requests must include topicId'); // note: this only checks that the topicId is defined, but additional validation may be useful

    // given the consumer and the topic id are well defined, lets subscribe them
    await subscribeToTopic({ consumer, topicId, config: lwpConfig });
  }
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
