import Joi from 'joi';
import SchematicJoiModel from 'schematic-joi-model';
import { Consumer } from './Consumer';

const subscriptionSchema = Joi.object().keys({
  consumer: Consumer.schema.required(),
  topicId: Joi.string().required(),
});
interface SubscriptionConstructorProps {
  consumer: Consumer;
  topicId: string;
}
export class Subscription extends SchematicJoiModel<SubscriptionConstructorProps> {
  public consumer!: Consumer;
  public topicId!: string;
  public static schema = subscriptionSchema;
}
