import dotenv from 'dotenv';
import uuid from 'uuid';
import { Config, Consumer, Subscription } from '../../types';
import { add } from './add';

dotenv.config(); // load the .env vars into process.env

const config: Config = {
  dynamodb: {
    subscriptions: {
      name: process.env.DYNAMO_TABLE_NAME_FOR_TESTING!,
    },
  },
};

describe('add', () => {
  it('should be able to add a subscription', async () => {
    const subscription = new Subscription({
      consumer: new Consumer({
        domainName: '__DOMAIN_NAME__',
        stage: '__STAGE__',
        connectionId: uuid(),
      }),
      topicId: uuid(),
    });
    await add({ config, subscription });
  });
});
