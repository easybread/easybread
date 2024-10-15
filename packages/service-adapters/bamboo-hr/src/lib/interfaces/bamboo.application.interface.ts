export type BambooApplication = {
  id: number;
  appliedDate: string;
  status: {
    id: number;
    label: string;
  };
  rating: number | null;
  applicant: {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    source: string | null;
  };
  job: {
    id: number;
    title: {
      id: number | null;
      label: string;
    };
  };
};
