import { Consumer } from '../../../types';

export const getConsumerIdFromConsumer = ({ consumer }: { consumer: Consumer }) => `${consumer.domainName}/${consumer.stage}/${consumer.connectionId}`;
