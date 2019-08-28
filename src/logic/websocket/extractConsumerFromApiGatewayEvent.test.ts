import { extractConsumerFromApiGatewayEvent } from './extractConsumerFromApiGatewayEvent';

describe('extractConsumerFromApiGatewayEvent', () => {
  it('should accurately extract consumer', () => {
    const consumer = extractConsumerFromApiGatewayEvent({
      event: {
        requestContext: {
          domainName: '__DOMAIN_NAME__',
          stage: '__STAGE__',
          connectionId: '__CONN_ID__',
        },
      } as any,
    });
    expect(consumer).toMatchObject({
      domainName: '__DOMAIN_NAME__',
      stage: '__STAGE__',
      connectionId: '__CONN_ID__',
    });
  });
});
