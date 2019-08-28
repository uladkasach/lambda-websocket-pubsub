import { subscriptionDao } from '../../dao';
import { Config, Consumer, Subscription } from '../../types';

/*
  subscribing to a topic = making it possible for "publishToTopic" to be able to find this consumer and send message to consumer

  this can be done by persisting the consumer in the dynamo table
*/
export const subscribeToTopic = async ({ config, consumer, topicId }: { config: Config; consumer: Consumer; topicId: string }) => {
  // define the subscription
  const subscription = new Subscription({
    consumer,
    topicId,
  });

  // record the subscription in the dynamodb table
  await subscriptionDao.add({ config, subscription });
};
