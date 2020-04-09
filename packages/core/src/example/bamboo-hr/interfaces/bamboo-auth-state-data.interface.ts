import { BreadBasicAuthStateData } from '../../../auth-strategy/interfaces';

export interface BambooAuthStateData extends BreadBasicAuthStateData {
  companyName: string;
}
