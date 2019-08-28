import { DynamoDB } from 'aws-sdk';
import { Config, Consumer, Subscription } from '../../types';
import { getConsumerIdFromConsumer } from './utils/getConsumerIdFromConsumer';

export const findAllForConsumer = async ({ config, consumer }: { config: Config; consumer: Consumer }) => {
  // get config
  const dynamodbDocClient = new DynamoDB.DocumentClient();
  const tableName = config.dynamodbTableName;
  const consumerId = getConsumerIdFromConsumer({ consumer });

  // save the record
  const result = await dynamodbDocClient
    .query({
      // select *
      Select: 'ALL_ATTRIBUTES',

      // from :table
      TableName: tableName,
      IndexName: 'SecondaryIndex', // use the alternate partition key

      // where
      KeyConditionExpression: 'p2 = :secondaryPartitionKey',
      ExpressionAttributeValues: {
        ':secondaryPartitionKey': consumerId, // the subscriptions are for this topic
      },
    })
    .promise();

  // cast result into subscription objects
  if (!result.Items) return [];
  const subscriptions = result.Items.map(
    (item) =>
      new Subscription({
        topicId: item.topicId,
        consumer: new Consumer({
          domainName: item.domainName,
          stage: item.stage,
          connectionId: item.connectionId,
        }),
      }),
  );

  // return the subscriptions
  return subscriptions;
};
