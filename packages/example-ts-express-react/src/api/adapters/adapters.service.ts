import { BambooBasicAuthPayload } from '@easybread/adapter-bamboo-hr';
import {
  GoogleOauth2CompleteOperation,
  GoogleOauth2StartOperation,
  GoogleOperationName
} from '@easybread/adapter-google';
import {
  BreadOperationName,
  SetupBasicAuthOperation
} from '@easybread/operations';

import { bambooHrClient, googleClient, stateAdapter } from '../shared';
import {
  AdaptersStateDto,
  AdapterStateDto,
  CompleteGoogleOauth2Dto,
  SetupBambooDto
} from './dtos';

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

  static async createBambooConfiguration(
    dto: SetupBambooDto
  ): Promise<SetupBasicAuthOperation<BambooBasicAuthPayload>['output']> {
    const { apiKey, companyName } = dto;
    const result = await bambooHrClient.invoke<
      SetupBasicAuthOperation<BambooBasicAuthPayload>
    >({
      name: BreadOperationName.SETUP_BASIC_AUTH,
      breadId: '1',
      payload: { apiKey, companyName }
    });

    if (result.rawPayload.success) {
      await this.setConfigured('bamboo');
    }

    return result;
  }

  static async startGoogleOAuthFlow(): Promise<
    GoogleOauth2StartOperation['output']
  > {
    return googleClient.invoke<GoogleOauth2StartOperation>({
      name: GoogleOperationName.AUTH_FLOW_START,
      breadId: '1',
      payload: {
        prompt: ['consent'],
        includeGrantedScopes: true,
        scope: [
          'https://www.google.com/m8/feeds/',
          'https://www.googleapis.com/auth/contacts.readonly'
        ]
      }
    });
  }

  static async completeGoogleOAuthFlow(
    dto: CompleteGoogleOauth2Dto
  ): Promise<GoogleOauth2CompleteOperation['output']> {
    const { code } = dto;

    const output = await googleClient.invoke<GoogleOauth2CompleteOperation>({
      name: GoogleOperationName.AUTH_FLOW_COMPLETE,
      breadId: '1',
      payload: { code }
    });

    if (output.rawPayload.success) {
      await this.setConfigured('google');
    }

    return output;
  }
}
