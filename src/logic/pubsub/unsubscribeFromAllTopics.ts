import { subscriptionDao } from '../../dao';
import { Config, Consumer } from '../../types';

export const unsubscribeFromAllTopics = async ({ config, consumer }: { config: Config; consumer: Consumer }) => {
  // 1. find all subscriptions for the consumer
  const currentSubscriptions = await subscriptionDao.findAllForConsumer({ config, consumer });

  // 2. remove each subscription
  await Promise.all(currentSubscriptions.map((subscription) => subscriptionDao.remove({ config, subscription })));
};
