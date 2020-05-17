import { ADAPTER_NAME } from '../../../common';
import { AdapterStateDto } from './adapter-state.dto';

export interface AdaptersStateDto {
  [ADAPTER_NAME.GOOGLE_CONTACTS]: AdapterStateDto | undefined;
  [ADAPTER_NAME.BAMBOO]: AdapterStateDto | undefined;
  [ADAPTER_NAME.GSUITE_ADMIN]: AdapterStateDto | undefined;
}
