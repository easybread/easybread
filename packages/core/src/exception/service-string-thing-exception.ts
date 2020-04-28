import { ServiceException } from './service-exception';

export class ServiceStringThingException extends ServiceException {
  constructor(provider: string, schemaType: string) {
    super(provider, `${schemaType} is string`);
  }
}
