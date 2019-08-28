import dotenv from 'dotenv';
import uuid from 'uuid';
import { Config, Consumer, Subscription } from '../../types';
import { add } from './add';
import { findAllForTopic } from './findAllForTopic';
import { remove } from './remove';

dotenv.config(); // load the .env vars into process.env

const config: Config = {
  dynamodbTableName: process.env.DYNAMO_TABLE_NAME_FOR_TESTING!,
};

describe('remove', () => {
  it('should be able to remove a subscription', async () => {
    const subscription = new Subscription({
      consumer: new Consumer({
        domainName: '__DOMAIN_NAME__',
        stage: '__STAGE__',
        connectionId: uuid(),
      }),
      topicId: uuid(),
    });
    await add({ config, subscription });

    // prove that we can find it
    const subscriptionsFound = await findAllForTopic({ config, topicId: subscription.topicId });
    expect(subscriptionsFound.length).toEqual(1);
    expect(subscriptionsFound[0]).toEqual(subscription);

    // remove it
    await remove({ config, subscription });

    // prove that we can no longer find it
    const subscriptionsFoundNow = await findAllForTopic({ config, topicId: subscription.topicId });
    expect(subscriptionsFoundNow.length).toEqual(0);
  });
});
