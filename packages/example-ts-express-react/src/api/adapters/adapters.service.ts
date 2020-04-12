import { AdaptersStateDto, AdapterStateDto } from '../../dtos';
import { stateAdapter } from '../shared';

export class AdaptersService {
  static async adaptersState(): Promise<AdaptersStateDto> {
    const google = await stateAdapter.read<AdapterStateDto>(
      'adapters:state:google'
    );

    const bamboo = await stateAdapter.read<AdapterStateDto>(
      'adapters:state:bamboo'
    );

    return { google, bamboo };
  }

  static async setConfigured(
    adapter: 'google' | 'bamboo'
  ): Promise<AdapterStateDto> {
    return await stateAdapter.write<AdapterStateDto>(
      `adapters:state:${adapter}`,
      { configured: true }
    );
  }
}
