import { Consumer } from './Consumer';
import { Subscription } from './Subscription';

describe('Subscription', () => {
  it('should initialize with valid data', () => {
    const consumer = new Consumer({
      domainName: '__URL__',
      stage: '__STAGE__',
      connectionId: '__CONN_ID__',
    });
    const subscription = new Subscription({
      topicId: '__TOPIC_ID__',
      consumer,
    });
    expect(subscription.consumer.domainName).toEqual('__URL__'); // should be a uuid -> 36 char
  });
  it('should throw a validation error if invalid data', () => {
    try {
      new Subscription({
        consumer: 'some string and not the object',
        topicId: '__TOPIC_ID__',
      } as any); // tslint:disable-line no-unused-expression
    } catch (error) {
      expect(error.constructor.name).toEqual('ValidationError');
    }
  });
});
