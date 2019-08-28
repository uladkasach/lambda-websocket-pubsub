import { ApiGatewayManagementApi } from 'aws-sdk';
import { Consumer } from '../../types';

export const pushDataToConsumerThroughWebsocket = async ({ consumer, data }: { consumer: Consumer; data: any }) => {
  // 1. define the client
  const client = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `https://${consumer.domainName}/${consumer.stage}`,
  });

  // 2. send data w/ the client
  await client.postToConnection({ ConnectionId: consumer.connectionId, Data: data });
};
