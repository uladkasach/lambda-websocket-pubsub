import { Consumer } from '../../types';
import { pushDataToConsumerThroughWebsocket } from './pushDataToConsumerThroughWebsocket';

describe('pushDataToConsumerThroughWebsocket', () => {
  it('should throw an expected message when trying to push to a fake websocket', async () => {
    const exampleConsumer = new Consumer({
      domainName: '__fake__.execute-api.us-east-1.amazonaws.com',
      stage: 'dev',
      connectionId: '__fake_connection_id__',
    });
    try {
      await pushDataToConsumerThroughWebsocket({ consumer: exampleConsumer, data: 'test test' });
      throw new Error('should not reach here');
    } catch (error) {
      expect(error.message).toContain('Inaccessible host');
    }
  });
});
