import { ADAPTER_NAME } from '../../../common';
import { AdapterStateDto } from './adapter-state.dto';

export interface AdaptersStateDto {
  [ADAPTER_NAME.GOOGLE]: AdapterStateDto | undefined;
  [ADAPTER_NAME.BAMBOO]: AdapterStateDto | undefined;
}
