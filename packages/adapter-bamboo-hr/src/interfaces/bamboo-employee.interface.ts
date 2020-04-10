export interface BambooEmployee {
  id: string;
  canUploadPhoto: boolean | number;
  department: string | null;
  displayName: string | null;
  division: string | null;
  firstName: string | null;
  gender: string | null;
  jobTitle: string | null;
  lastName: string | null;
  linkedIn: string | null;
  location: string | null;
  mobilePhone: string | null;
  photoUploaded: boolean;
  photoUrl: string;
  preferredName: string | null;
  workEmail: string | null;
  workPhone: string | null;
  workPhoneExtension: string | null;
}
