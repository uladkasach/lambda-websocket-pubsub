import Joi from 'joi';
import SchematicJoiModel from 'schematic-joi-model';

const consumerSchema = Joi.object().keys({
  domainName: Joi.string().required(),
  stage: Joi.string().required(),
  connectionId: Joi.string().required(),
});
interface ConsumerConstructorProps {
  domainName: string;
  stage: string;
  connectionId: string;
}
export class Consumer extends SchematicJoiModel<ConsumerConstructorProps> {
  public domainName!: string;
  public stage!: string;
  public connectionId!: string;
  public static schema = consumerSchema;
}
