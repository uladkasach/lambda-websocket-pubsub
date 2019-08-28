import { subscriptionDao } from '../../dao';
import { Consumer } from '../../types';
import { unsubscribeFromAllTopics } from './unsubscribeFromAllTopics';

jest.mock('../../dao/subscription');
const findAllForConsumerMock = subscriptionDao.findAllForConsumer as jest.Mock;
const exampleSubscriptions = ['__SUB_1__', '__SUB_2__', '__SUB_3__'];
findAllForConsumerMock.mockResolvedValue(exampleSubscriptions);
const removeMock = subscriptionDao.remove as jest.Mock;

describe('unsubscribeFromAllTopics', () => {
  beforeEach(() => jest.clearAllMocks());
  const exampleConfig = '__CONFIG__' as any;
  const exampleConsumer = new Consumer({
    domainName: '__URL__',
    stage: '__STAGE__',
    connectionId: '__CONN_ID__',
  });
  it('should get all subscriptions for consumer', async () => {
    await unsubscribeFromAllTopics({ config: exampleConfig, consumer: exampleConsumer });
    expect(findAllForConsumerMock).toHaveBeenCalledTimes(1);
    expect(findAllForConsumerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        config: exampleConfig,
        consumer: exampleConsumer,
      }),
    );
  });
  it('should remove each subscription returned for consumer', async () => {
    await unsubscribeFromAllTopics({ config: exampleConfig, consumer: exampleConsumer });
    expect(removeMock).toHaveBeenCalledTimes(exampleSubscriptions.length);
    expect(removeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        config: exampleConfig,
        subscription: exampleSubscriptions[0],
      }),
    );
    expect(removeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        config: exampleConfig,
        subscription: exampleSubscriptions[1],
      }),
    );
    expect(removeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        config: exampleConfig,
        subscription: exampleSubscriptions[2],
      }),
    );
  });
});
