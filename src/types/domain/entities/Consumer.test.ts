import { Consumer } from './Consumer';

describe('Consumer', () => {
  it('should initialize with valid data', () => {
    const consumer = new Consumer({
      domainName: '__URL__',
      stage: '__STAGE__',
      connectionId: '__CONN_ID__',
    });
    expect(consumer.domainName).toEqual('__URL__'); // should be a uuid -> 36 char
  });
  it('should throw a validation error if invalid data', () => {
    try {
      new Consumer({
        domAynInName: '__URL__',
        stage: '__STAGE__',
        connectionId: '__CONN_ID__',
      } as any); // tslint:disable-line no-unused-expression
    } catch (error) {
      expect(error.constructor.name).toEqual('ValidationError');
    }
  });
});
