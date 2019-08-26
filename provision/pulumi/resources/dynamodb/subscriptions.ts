import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const env = pulumi.getStack();

// table name
const name = 'cool-app-subscriptions';

// create the subscriptions table
const subscriptionsTableConfig: aws.dynamodb.TableArgs = {
  billingMode: 'PAY_PER_REQUEST',

  attributes: [
    {
      name: 'p', // p = partition key
      type: 'S', // string
    },
    {
      name: 'u', // u = unique data in partition sort key; for idempotency (i.e., on conflict overwrite)
      type: 'S', // string
    },
    {
      name: 's', // s = secondary index key
      type: 'S', // string
    },
  ],

  hashKey: 'p', // partition key
  rangeKey: 'u', // the data that makes the row unique per partition, for idempotency

  globalSecondaryIndexes: [
    {
      // define another range key, the sort key - for querying against (since the default sort key can't solve our timestamp queries)
      name: 'SecondaryIndex',
      hashKey: 's',
      projectionType: 'ALL', // TODO: see if we should move to projectionType KEYS to reduce cost
    },
  ],
};
export const subscriptionsTable = new aws.dynamodb.Table(`${name}-${env}`, subscriptionsTableConfig);
export const subscriptionsTestTable = env === 'dev' ? new aws.dynamodb.Table(`${name}-test`, subscriptionsTableConfig) : undefined;
