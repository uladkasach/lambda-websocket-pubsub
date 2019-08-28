import { DynamoDB } from 'aws-sdk';
import { Config, Consumer, Subscription } from '../../types';

export const findAllForTopic = async ({ config, topicId }: { config: Config; topicId: string }) => {
  // get config
  const dynamodbDocClient = new DynamoDB.DocumentClient();
  const tableName = config.dynamodbTableName;

  // save the record
  const result = await dynamodbDocClient
    .query({
      // select *
      Select: 'ALL_ATTRIBUTES',

      // from :table
      TableName: tableName,

      // where
      KeyConditionExpression: 'p = :partitionKey',
      ExpressionAttributeValues: {
        ':partitionKey': topicId, // the subscriptions are for this topic
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
