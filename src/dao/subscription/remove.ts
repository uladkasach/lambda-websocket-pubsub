import { DynamoDB } from 'aws-sdk';
import { Config, Subscription } from '../../types';
import { getConsumerIdFromConsumer } from './utils/getConsumerIdFromConsumer';

export const remove = async ({ config, subscription }: { config: Config; subscription: Subscription }) => {
  // get config
  const dynamodbDocClient = new DynamoDB.DocumentClient();
  const tableName = config.dynamodbTableName;
  const consumerId = getConsumerIdFromConsumer({ consumer: subscription.consumer });

  // save the record
  await dynamodbDocClient
    .delete({
      TableName: tableName,
      Key: {
        p: subscription.topicId,
        u: consumerId,
      },
    })
    .promise();

  // return the subscription
  return subscription;
};
