import { subscriptionDao } from '../../dao';
import { Consumer, Subscription } from '../../types';
import { subscribeToTopic } from './subscribeToTopic';

jest.mock('../../dao/subscription');
const addMock = subscriptionDao.add as jest.Mock;

describe('subscribeToTopic', () => {
  const exampleConsumer = new Consumer({
    domainName: '__URL__',
    stage: '__STAGE__',
    connectionId: '__CONN_ID__',
  });
  it('should add the subscription accurately', async () => {
    await subscribeToTopic({
      config: '__CONFIG__' as any,
      consumer: exampleConsumer,
      topicId: '__TOPIC_ID__',
    });
    expect(addMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledWith(
      expect.objectContaining({
        config: '__CONFIG__',
        subscription: new Subscription({
          consumer: exampleConsumer,
          topicId: '__TOPIC_ID__',
        }),
      }),
    );
  });
});
