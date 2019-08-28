import { subscriptionDao } from '../../dao';
import { pushDataToConsumerThroughWebsocket } from '../websocket/pushDataToConsumerThroughWebsocket';
import { publishToTopic } from './publishToTopic';

jest.mock('../../dao/subscription');
const findAllForTopicMock = subscriptionDao.findAllForTopic as jest.Mock;
const exampleSubscriptions = [{ consumer: '__CON_1__' }, { consumer: '__CON_2__' }];
findAllForTopicMock.mockResolvedValue(exampleSubscriptions);

jest.mock('../websocket/pushDataToConsumerThroughWebsocket');
const pushDataToConsumerThroughWebsocketMock = pushDataToConsumerThroughWebsocket as jest.Mock;

describe('publishToTopic', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should find all subscriptions for topic', async () => {
    await publishToTopic({ config: '__CONFIG__' as any, topicId: '__TOPIC_ID__', data: '__DATA__' });
    expect(findAllForTopicMock).toHaveBeenCalledTimes(1);
    expect(findAllForTopicMock).toHaveBeenCalledWith(
      expect.objectContaining({
        config: '__CONFIG__' as any,
        topicId: '__TOPIC_ID__',
      }),
    );
  });
  it('should pushDataToConsumerThroughWebsocket for each subscription', async () => {
    await publishToTopic({ config: '__CONFIG__' as any, topicId: '__TOPIC_ID__', data: '__DATA__' });
    expect(pushDataToConsumerThroughWebsocketMock).toHaveBeenCalledTimes(exampleSubscriptions.length);
    expect(pushDataToConsumerThroughWebsocketMock).toHaveBeenCalledWith(
      expect.objectContaining({
        consumer: exampleSubscriptions[0].consumer,
        data: '__DATA__',
      }),
    );
    expect(pushDataToConsumerThroughWebsocketMock).toHaveBeenCalledWith(
      expect.objectContaining({
        consumer: exampleSubscriptions[1].consumer,
        data: '__DATA__',
      }),
    );
  });
});
