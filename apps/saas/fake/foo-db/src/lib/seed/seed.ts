import * as f from '@ngneat/falso';

import { foodb } from '../foodb';
import {
  commitmentTypeEnum,
  engagementTypeEnum,
  genderEnum,
  jobTypeEnum,
  type orgMemberRoleEnum,
} from '../schema/enums';

import {
  addresses,
  candidateProfiles,
  departments,
  employeeProfiles,
  jobApplications,
  jobPosts,
  orgMembers,
  orgs,
  personalDetails,
  skills,
  skillsetSkills,
  skillsets,
  users,
} from './../schema/schema';

//---------------------------------

const SOFT_SKILLS = [
  'Communication',
  'Leadership',
  'Teamwork',
  'Problem Solving',
  'Time Management',
  'Adaptability',
  'Critical Thinking',
  'Creativity',
  'Emotional Intelligence',
  'Conflict Resolution',
  'Negotiation',
  'Public Speaking',
  'Active Listening',
  'Empathy',
  'Collaboration',
  'Decision Making',
  'Stress Management',
  'Mentoring',
  'Cultural Awareness',
  'Customer Service',
] as const;

const TECHNICAL_SKILLS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'React',
  'Node.js',
  'Angular',
  'Vue.js',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Git',
  'Jenkins',
  'Terraform',
  'Linux',
  'Bash',
  'GraphQL',
  'REST APIs',
  'Microservices',
  'Machine Learning',
  'Data Analysis',
  'SQL',
  'NoSQL',
  'DevOps',
] as const;

const MIN_DATE = new Date('2020-01-01');
const MAX_DATE = new Date();

async function main() {
  await seedSkills();
  await Promise.all([...Array(3)].map(createOrganization));
}

async function createOrganization() {
  console.debug('createOrganization');

  const [org] = await foodb
    .insert(orgs)
    .values({ name: f.randCompanyName() })
    .returning();

  await createOrgUser(org.id, 'ADMIN');
  await createOrgUser(org.id, 'MANAGER');
  await createOrgUser(org.id, 'MANAGER');

  await makeRandomNumberOf(2, 3, () =>
    createDepartment(org.id, f.randDepartment()),
  );

  await makeRandomNumberOf(5, 10, () => createJobPost(org.id));

  return org;
}

async function createOrgUser(
  orgId: string,
  role: (typeof orgMemberRoleEnum.enumValues)[number],
) {
  console.debug(`createOrgUser orgId: ${orgId} role: ${role}`);

  const [user] = await foodb
    .insert(users)
    .values({
      email: f.randEmail(),
      passwordHash: '123456',
      passwordSalt: '123456',
    })
    .returning();

  await foodb.insert(orgMembers).values({
    orgId,
    userId: user.id,
    role,
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return user!;
}

async function createDepartment(orgId: string, name: string) {
  console.debug(`createDepartment orgId: ${orgId} name: ${name}`);

  const [department] = await foodb
    .insert(departments)
    .values({ name, orgId })
    .returning();

  await makeRandomNumberOf(1, 10, () => createEmployee(orgId, department.id));

  return department;
}

async function createEmployee(orgId: string, departmentId: string) {
  console.debug(`createEmployee orgId: ${orgId} departmentId: ${departmentId}`);

  const user = await createOrgUser(orgId, 'EMPLOYEE');

  const address = await createAddress();
  const skillset = await createSkillset();
  const personalDetails = await createPersonalDetails();

  const [employeeProfile] = await foodb
    .insert(employeeProfiles)
    .values({
      userId: user.id.toString(),
      orgId,
      departmentId,
      jobTitle: f.randJobTitle(),
      commitmentType: f.rand(commitmentTypeEnum.enumValues),
      engagementType: f.rand(engagementTypeEnum.enumValues),
      startedAt: f.randBetweenDate({ from: MIN_DATE, to: MAX_DATE }),
      addressId: address.id,
      skillsetId: skillset.id,
      personalDetailsId: personalDetails.id,
    })
    .returning();

  return employeeProfile;
}

async function seedSkills() {
  console.debug('seedSkills');

  // Create soft skills
  await foodb.insert(skills).values(
    SOFT_SKILLS.map(skill => ({
      label: skill,
      type: 'SOFT' as const,
      description: `${skill} soft skill`,
    })),
  );

  // Create technical skills
  await foodb.insert(skills).values(
    TECHNICAL_SKILLS.map(skill => ({
      label: skill,
      type: 'TECHNICAL' as const,
      description: `${skill} technical skill`,
    })),
  );
}

async function createSkillset() {
  const [skillset] = await foodb.insert(skillsets).values({}).returning();

  // Get all available skills
  const allSkills = await foodb.select().from(skills);

  // Randomly select 3-8 skills for this skillset
  const numberOfSkills = f.randNumber({ min: 3, max: 8 });
  const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
  const selectedSkills = shuffled.slice(0, numberOfSkills);

  // Insert skillset-skill relationships
  await foodb.insert(skillsetSkills).values(
    selectedSkills.map(skill => ({
      skillId: skill.id,
      skillsetId: skillset.id,
      experienceMonths: f.randNumber({ min: 1, max: 20 }),
      isEssential: f.randBoolean(),
    })),
  );

  return skillset;
}

async function createAddress() {
  const [address] = await foodb
    .insert(addresses)
    .values({
      street1: f.randStreetAddress(),
      street2: f.randStreetAddress(),
      city: f.randCity(),
      countryCode: 'US',
      state: f.randState(),
      createdAt: f.randBetweenDate({ from: MIN_DATE, to: MAX_DATE }),
      updatedAt: f.randBetweenDate({ from: MIN_DATE, to: MAX_DATE }),
      postalCode: f.randZipCode(),
    })
    .returning();

  return address;
}

async function createJobPost(orgId: string) {
  console.debug(`createJobPost orgId: ${orgId}`);

  const skillset = await createSkillset();
  const address = await createAddress();

  const [jobPost] = await foodb
    .insert(jobPosts)
    .values({
      orgId,
      title: f.randJobTitle(),
      text: f.randText({ charCount: 1000 }),
      skillsetId: skillset.id,
      jobType: f.rand(jobTypeEnum.enumValues),
      engagementType: f.rand(engagementTypeEnum.enumValues),
      commitmentType: f.rand(commitmentTypeEnum.enumValues),
      createdAt: f.randBetweenDate({ from: MIN_DATE, to: MAX_DATE }),
      addressesId: address.id,
      currency: f.randCurrencyCode(),
      minSalary: f.randNumber({ min: 20000, max: 40000 }),
      maxSalary: f.randNumber({ min: 40000, max: 100000 }),
    })
    .returning();

  await makeRandomNumberOf(1, 10, () =>
    createJobApplication(orgId, jobPost.id),
  );

  return jobPost;
}

async function createJobApplication(orgId: string, jobPostId: string) {
  console.debug(`createJobApplication orgId: ${orgId} jobPostId: ${jobPostId}`);
  const candidateProfile = await createCandidate(orgId);

  const [jobApplication] = await foodb
    .insert(jobApplications)
    .values({
      orgId,
      jobPostId,
      candidateProfileId: candidateProfile.id,
    })
    .returning();

  return jobApplication;
}

async function createCandidate(orgId: string) {
  console.debug(`createCandidate orgId: ${orgId}`);

  const user = await createOrgUser(orgId, 'CANDIDATE');

  const address = await createAddress();
  const skillset = await createSkillset();
  const personalDetails = await createPersonalDetails();

  const [candidateProfile] = await foodb
    .insert(candidateProfiles)
    .values({
      orgId,
      userId: user.id,
      title: f.randJobTitle(),
      addressesId: address.id,
      skillsetId: skillset.id,
      personalDetailsId: personalDetails.id,
      cvUrl: f.randUrl(),
    })
    .returning();

  return candidateProfile;
}

async function createPersonalDetails() {
  const [data] = await foodb
    .insert(personalDetails)
    .values({
      firstName: f.randFirstName(),
      lastName: f.randLastName(),
      gender: f.rand(genderEnum.enumValues),
      dateOfBirth: f.randBetweenDate({
        from: new Date('1950-01-01'),
        to: new Date('2007-12-31'),
      }),
      nationality: f.randCountry(),
      phone: f.randPhoneNumber(),
    })
    .returning();

  return data;
}

async function makeRandomNumberOf(
  min: number,
  max: number,
  fn: () => Promise<unknown>,
) {
  await Promise.all([...Array(f.randNumber({ min, max }))].map(fn));
}

//---------------------------------

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
