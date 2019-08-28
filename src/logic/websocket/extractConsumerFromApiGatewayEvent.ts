import { APIGatewayEvent } from 'aws-lambda';
import { Consumer } from '../../types';

export const extractConsumerFromApiGatewayEvent = ({ event }: { event: APIGatewayEvent }) => {
  return new Consumer({
    domainName: event.requestContext.domainName!,
    stage: event.requestContext.stage,
    connectionId: event.requestContext.connectionId!,
  });
};
