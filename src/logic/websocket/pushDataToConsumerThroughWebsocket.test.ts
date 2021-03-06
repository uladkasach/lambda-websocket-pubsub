import { ApiGatewayManagementApi } from 'aws-sdk';
import { Consumer } from '../../types';
import { pushDataToConsumerThroughWebsocket } from './pushDataToConsumerThroughWebsocket';

jest.mock('aws-sdk', () => {
  const promisePostToConnectionMock = jest.fn();
  const postToConnectionMock = jest.fn().mockImplementation(() => ({ promise: promisePostToConnectionMock }));
  return {
    ApiGatewayManagementApi: jest.fn().mockImplementation(() => ({
      postToConnection: postToConnectionMock,
    })),
  };
});

const constructorMock = (ApiGatewayManagementApi as any) as jest.Mock;
const postToConnectionMock = new ApiGatewayManagementApi().postToConnection as jest.Mock;
const promisePostToConnectionMock = new ApiGatewayManagementApi().postToConnection().promise as jest.Mock;

describe('pushDataToConsumerThroughWebsocket', () => {
  beforeEach(() => jest.clearAllMocks());
  const exampleConsumer = new Consumer({
    domainName: '__URL__',
    stage: '__STAGE__',
    connectionId: '__CONN_ID__',
  });
  const exampleData = {
    hey: 'there',
  };
  it('should instantiate the client accurately', async () => {
    await pushDataToConsumerThroughWebsocket({ consumer: exampleConsumer, data: exampleData });
    expect(constructorMock).toHaveBeenCalledTimes(1);
    expect(constructorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: `https://${exampleConsumer.domainName}/${exampleConsumer.stage}`,
      }),
    );
  });
  it('should send data to the client accurately', async () => {
    await pushDataToConsumerThroughWebsocket({ consumer: exampleConsumer, data: exampleData });
    expect(postToConnectionMock).toHaveBeenCalledTimes(1);
    expect(postToConnectionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        Data: exampleData,
      }),
    );
  });
  it('should call the promise method, to ensure message is sent with aws-sdk syntax', async () => {
    await pushDataToConsumerThroughWebsocket({ consumer: exampleConsumer, data: exampleData });
    expect(promisePostToConnectionMock).toHaveBeenCalledTimes(1);
  });
});
