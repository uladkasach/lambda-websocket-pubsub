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
      name: 'p', // p = partition key: the lookup index
      type: 'S', // string
    },
    {
      name: 'u', // u = "secondary key": defines the unique key of this entity, in conjunction w/ the partition key
      type: 'S', // string
    },
  ],

  hashKey: 'p', // partition key
  rangeKey: 'u', // "secondary key"; defines "uniqueness" (p + u = unique entity)

  globalSecondaryIndexes: [
    {
      name: 'SecondaryIndex',
      hashKey: 'p2', // define a second index, for alternate table lookups
      projectionType: 'ALL', // TODO: see if we should move to projectionType KEYS to reduce cost
    },
  ],
};
export const subscriptionsTable = new aws.dynamodb.Table(`${name}-${env}`, subscriptionsTableConfig);
export const subscriptionsTestTable = env === 'dev' ? new aws.dynamodb.Table(`${name}-test`, subscriptionsTableConfig) : undefined;
