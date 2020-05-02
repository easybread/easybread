import { AdapterStateDto } from './adapter-state.dto';

export interface AdaptersStateDto {
  google: AdapterStateDto | undefined;
  bamboo: AdapterStateDto | undefined;
}
