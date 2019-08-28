import dotenv from 'dotenv';
import uuid from 'uuid';
import { Config, Consumer, Subscription } from '../../types';
import { add } from './add';
import { findAllForTopic } from './findAllForTopic';

dotenv.config(); // load the .env vars into process.env

const config: Config = {
  dynamodbTableName: process.env.DYNAMO_TABLE_NAME_FOR_TESTING!,
};

describe('findAllForTopic', () => {
  it('should be able to find all subscriptions for a topic', async () => {
    const topicId = uuid();
    const subscriptionA = new Subscription({
      topicId,
      consumer: new Consumer({
        domainName: '__DOMAIN_NAME__',
        stage: '__STAGE__',
        connectionId: uuid(),
      }),
    });
    const subscriptionB = new Subscription({
      topicId,
      consumer: new Consumer({
        domainName: '__DOMAIN_NAME__',
        stage: '__STAGE__',
        connectionId: uuid(),
      }),
    });
    await add({ config, subscription: subscriptionA });
    await add({ config, subscription: subscriptionB });
    const subscriptionsFound = await findAllForTopic({ config, topicId });

    // expect that it found both of the subscriptions for the topic
    expect(subscriptionsFound.length).toEqual(2);
    expect(subscriptionsFound).toContainEqual(subscriptionA);
    expect(subscriptionsFound).toContainEqual(subscriptionB);
  });
  it('should not find any subscriptions for the wrong topic', async () => {
    const topicId = uuid();
    const subscriptionA = new Subscription({
      topicId,
      consumer: new Consumer({
        domainName: '__DOMAIN_NAME__',
        stage: '__STAGE__',
        connectionId: uuid(),
      }),
    });
    const subscriptionB = new Subscription({
      topicId: uuid(), // different topic id
      consumer: new Consumer({
        domainName: '__DOMAIN_NAME__',
        stage: '__STAGE__',
        connectionId: uuid(),
      }),
    });
    await add({ config, subscription: subscriptionA });
    await add({ config, subscription: subscriptionB });
    const subscriptionsFound = await findAllForTopic({ config, topicId });

    // expect that it found both of the subscriptions for the topic
    expect(subscriptionsFound.length).toEqual(1);
    expect(subscriptionsFound).toContainEqual(subscriptionA);
    expect(subscriptionsFound).not.toContainEqual(subscriptionB);
  });
});
