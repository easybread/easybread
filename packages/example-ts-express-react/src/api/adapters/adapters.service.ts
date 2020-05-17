import { BambooBasicAuthPayload } from '@easybread/adapter-bamboo-hr';
import { GoogleContactsAuthScopes } from '@easybread/adapter-google-contacts';
import { GsuiteAdminAuthScope } from '@easybread/adapter-gsuite-admin';
import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOauth2StartOperation,
  GoogleCommonOperationName
} from '@easybread/google-common';
import {
  BreadOperationName,
  SetupBasicAuthOperation
} from '@easybread/operations';

import { ADAPTER_NAME } from '../../common';
import {
  bambooHrClient,
  googleContactsClient,
  gsuiteAdminClient,
  stateAdapter
} from '../shared';
import {
  AdaptersStateDto,
  AdapterStateDto,
  CompleteGoogleOauth2Dto,
  CompleteGsuiteAdminOauth2Dto,
  SetupBambooDto
} from './dtos';

export class AdaptersService {
  static async adaptersState(breadId: string): Promise<AdaptersStateDto> {
    const google = await stateAdapter.read<AdapterStateDto>(
      this.createAdapterStateKey(breadId, ADAPTER_NAME.GOOGLE_CONTACTS)
    );
    const bamboo = await stateAdapter.read<AdapterStateDto>(
      this.createAdapterStateKey(breadId, ADAPTER_NAME.BAMBOO)
    );
    const gsuiteAdmin = await stateAdapter.read<AdapterStateDto>(
      this.createAdapterStateKey(breadId, ADAPTER_NAME.GSUITE_ADMIN)
    );

    return { google, bamboo, gsuiteAdmin };
  }

  static async resetConfiguration(
    breadId: string,
    adapter: ADAPTER_NAME
  ): Promise<AdapterStateDto> {
    return await stateAdapter.write<AdapterStateDto>(
      this.createAdapterStateKey(breadId, adapter),
      { configured: false }
    );
  }

  static async setConfigured(
    breadId: string,
    adapter: ADAPTER_NAME
  ): Promise<AdapterStateDto> {
    return await stateAdapter.write<AdapterStateDto>(
      this.createAdapterStateKey(breadId, adapter),
      { configured: true }
    );
  }

  static async createBambooConfiguration(
    breadId: string,
    dto: SetupBambooDto
  ): Promise<SetupBasicAuthOperation<BambooBasicAuthPayload>['output']> {
    const { apiKey, companyName } = dto;
    const result = await bambooHrClient.invoke<
      SetupBasicAuthOperation<BambooBasicAuthPayload>
    >({
      name: BreadOperationName.SETUP_BASIC_AUTH,
      breadId,
      payload: { apiKey, companyName }
    });

    if (result.rawPayload.success) {
      await this.setConfigured(breadId, ADAPTER_NAME.BAMBOO);
    }

    return result;
  }

  static async startGoogleOAuthFlow(
    breadId: string
  ): Promise<
    GoogleCommonOauth2StartOperation<GoogleContactsAuthScopes>['output']
  > {
    return googleContactsClient.invoke<
      GoogleCommonOauth2StartOperation<GoogleContactsAuthScopes>
    >({
      name: GoogleCommonOperationName.AUTH_FLOW_START,
      breadId,
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

  static async startGSuiteAdminOAuthFlow(
    breadId: string
  ): Promise<GoogleCommonOauth2StartOperation<GsuiteAdminAuthScope>['output']> {
    return gsuiteAdminClient.invoke<
      GoogleCommonOauth2StartOperation<GsuiteAdminAuthScope>
    >({
      name: GoogleCommonOperationName.AUTH_FLOW_START,
      breadId,
      payload: {
        prompt: ['consent'],
        includeGrantedScopes: true,
        scope: ['https://www.googleapis.com/auth/admin.directory.user']
      }
    });
  }

  static async completeGoogleOAuthFlow(
    breadId: string,
    dto: CompleteGoogleOauth2Dto
  ): Promise<GoogleCommonOauth2CompleteOperation['output']> {
    const { code } = dto;

    const output = await googleContactsClient.invoke<
      GoogleCommonOauth2CompleteOperation
    >({
      name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
      breadId,
      payload: { code }
    });

    if (output.rawPayload.success) {
      await this.setConfigured(breadId, ADAPTER_NAME.GOOGLE_CONTACTS);
    }

    return output;
  }

  static async completeGsuiteAdminOAuthFlow(
    breadId: string,
    dto: CompleteGsuiteAdminOauth2Dto
  ): Promise<GoogleCommonOauth2CompleteOperation['output']> {
    const { code } = dto;

    const output = await gsuiteAdminClient.invoke<
      GoogleCommonOauth2CompleteOperation
    >({
      name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
      breadId,
      payload: { code }
    });

    if (output.rawPayload.success) {
      await this.setConfigured(breadId, ADAPTER_NAME.GSUITE_ADMIN);
    }

    return output;
  }

  private static createAdapterStateKey(
    breadId: string,
    adapter: ADAPTER_NAME
  ): string {
    return `${breadId}:adapters:state:${adapter}`;
  }
}
