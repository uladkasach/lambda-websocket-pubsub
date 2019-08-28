import { DynamoDB } from 'aws-sdk';
import { Config, Subscription } from '../../types';
import { getConsumerIdFromConsumer } from './utils/getConsumerIdFromConsumer';

export const add = async ({ config, subscription }: { config: Config; subscription: Subscription }) => {
  // get config
  const dynamodbDocClient = new DynamoDB.DocumentClient();
  const tableName = config.dynamodbTableName;
  const consumerId = getConsumerIdFromConsumer({ consumer: subscription.consumer });

  // save the record
  await dynamodbDocClient
    .put({
      TableName: tableName,
      Item: {
        // primary index
        p: subscription.topicId, // partition key
        u: consumerId, // completes the "unique key" of a subscription; i.e., subscription is identifiable by p + u

        // secondary index
        p2: consumerId, // partition key

        // attributes
        topicId: subscription.topicId,
        connectionId: subscription.consumer.connectionId,
        domainName: subscription.consumer.domainName,
        stage: subscription.consumer.stage,
      },
    })
    .promise();

  // return the subscription
  return subscription;
};
