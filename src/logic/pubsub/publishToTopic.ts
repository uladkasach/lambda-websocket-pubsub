import { subscriptionDao } from '../../dao';
import { Config } from '../../types';
import { pushDataToConsumerThroughWebsocket } from '../websocket/pushDataToConsumerThroughWebsocket';

export const publishToTopic = async ({ config, topicId, data }: { config: Config; topicId: string; data: any }) => {
  // 1. get all consumers for a topic
  const subscriptionsForTopic = await subscriptionDao.findAllForTopic({ config, topicId });
  const consumersForTopic = subscriptionsForTopic.map((subscription) => subscription.consumer);

  // 2. send the data to each consumer
  await Promise.all(consumersForTopic.map((consumer) => pushDataToConsumerThroughWebsocket({ consumer, data })));
};
