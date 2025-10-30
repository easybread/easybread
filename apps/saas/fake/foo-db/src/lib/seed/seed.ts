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

// Helper to create short identifiers for better log tracing
function shortId(id: string): string {
  return id.slice(-8);
}

async function main() {
  console.log('🌱 Starting seed process');

  await seedSkills();

  console.log('📦 Creating 3 organizations in parallel...');
  await Promise.all([...Array(3)].map((_, i) => createOrganization(i + 1)));

  console.log('✅ Seed process completed');
}

async function createOrganization(orgIndex: number) {
  const orgName = f.randCompanyName();
  console.log(`🏢 [ORG-${orgIndex}] Creating organization: ${orgName}`);

  const [org] = await foodb.insert(orgs).values({ name: orgName }).returning();

  const orgId = shortId(org.id);
  console.log(
    `🏢 [ORG-${orgIndex}:${orgId}] Organization created, setting up structure...`,
  );

  await createOrgUser(org.id, 'ADMIN', `ORG-${orgIndex}:${orgId}`);
  await createOrgUser(org.id, 'MANAGER', `ORG-${orgIndex}:${orgId}`);
  await createOrgUser(org.id, 'MANAGER', `ORG-${orgIndex}:${orgId}`);

  await makeRandomNumberOf(2, 3, () =>
    createDepartment(org.id, f.randDepartment(), `ORG-${orgIndex}:${orgId}`),
  );

  await makeRandomNumberOf(5, 10, () =>
    createJobPost(org.id, `ORG-${orgIndex}:${orgId}`),
  );

  console.log(`✅ [ORG-${orgIndex}:${orgId}] Organization setup completed`);
  return org;
}

async function createOrgUser(
  orgId: string,
  role: (typeof orgMemberRoleEnum.enumValues)[number],
  context: string,
) {
  const email = f.randEmail();
  console.log(`👤 [${context}] Creating ${role.toLowerCase()}: ${email}`);

  const [user] = await foodb
    .insert(users)
    .values({
      email,
      passwordHash: '123456',
      passwordSalt: '123456',
    })
    .returning();

  await foodb.insert(orgMembers).values({
    orgId,
    userId: user.id,
    role,
  });

  console.log(`✓ [${context}] User created: ${shortId(user.id)}`);
  return user;
}

async function createDepartment(orgId: string, name: string, context: string) {
  console.log(`🏬 [${context}] Creating department: ${name}`);

  const [department] = await foodb
    .insert(departments)
    .values({ name, orgId })
    .returning();

  const deptId = shortId(department.id);
  const deptContext = `${context}/DEPT:${deptId}`;
  console.log(`🏬 [${deptContext}] Department created, adding employees...`);

  await makeRandomNumberOf(1, 10, () =>
    createEmployee(orgId, department.id, deptContext),
  );

  console.log(`✓ [${deptContext}] Department setup completed`);
  return department;
}

async function createEmployee(
  orgId: string,
  departmentId: string,
  context: string,
) {
  const jobTitle = f.randJobTitle();
  console.log(`👷 [${context}] Creating employee: ${jobTitle}`);

  const user = await createOrgUser(orgId, 'EMPLOYEE', context);

  const address = await createAddress(context);
  const skillset = await createSkillset(context);
  const personalDetails = await createPersonalDetails(context);

  const [employeeProfile] = await foodb
    .insert(employeeProfiles)
    .values({
      userId: user.id.toString(),
      orgId,
      departmentId,
      jobTitle,
      commitmentType: f.rand(commitmentTypeEnum.enumValues),
      engagementType: f.rand(engagementTypeEnum.enumValues),
      startedAt: f.randBetweenDate({ from: MIN_DATE, to: MAX_DATE }),
      addressId: address.id,
      skillsetId: skillset.id,
      personalDetailsId: personalDetails.id,
    })
    .returning();

  console.log(
    `✓ [${context}] Employee profile created: ${shortId(employeeProfile.id)}`,
  );
  return employeeProfile;
}

async function seedSkills() {
  console.log('🎯 Seeding skills...');

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

  console.log(
    `✓ Skills seeded: ${SOFT_SKILLS.length} soft + ${TECHNICAL_SKILLS.length} technical`,
  );
}

async function createSkillset(context?: string) {
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

  if (context) {
    console.log(`🎯 [${context}] Skillset created: ${numberOfSkills} skills`);
  }
  return skillset;
}

async function createAddress(context?: string) {
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

  if (context) {
    console.log(`📍 [${context}] Address created: ${address.city}`);
  }
  return address;
}

async function createJobPost(orgId: string, context: string) {
  const title = f.randJobTitle();
  console.log(`💼 [${context}] Creating job post: ${title}`);

  const skillset = await createSkillset(context);
  const address = await createAddress(context);

  const [jobPost] = await foodb
    .insert(jobPosts)
    .values({
      orgId,
      title,
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

  const jobId = shortId(jobPost.id);
  const jobContext = `${context}/JOB:${jobId}`;
  console.log(`💼 [${jobContext}] Job post created, adding applications...`);

  await makeRandomNumberOf(1, 10, () =>
    createJobApplication(orgId, jobPost.id, jobContext),
  );

  console.log(`✓ [${jobContext}] Job post setup completed`);
  return jobPost;
}

async function createJobApplication(
  orgId: string,
  jobPostId: string,
  context: string,
) {
  console.log(`📝 [${context}] Creating job application`);
  const candidateProfile = await createCandidate(orgId, context);

  const [jobApplication] = await foodb
    .insert(jobApplications)
    .values({
      orgId,
      jobPostId,
      candidateProfileId: candidateProfile.id,
    })
    .returning();

  console.log(
    `✓ [${context}] Application created: ${shortId(jobApplication.id)}`,
  );
  return jobApplication;
}

async function createCandidate(orgId: string, context: string) {
  const title = f.randJobTitle();
  console.log(`🎯 [${context}] Creating candidate: ${title}`);

  const user = await createOrgUser(orgId, 'CANDIDATE', context);

  const address = await createAddress(context);
  const skillset = await createSkillset(context);
  const personalDetails = await createPersonalDetails(context);

  const [candidateProfile] = await foodb
    .insert(candidateProfiles)
    .values({
      orgId,
      userId: user.id,
      title,
      addressesId: address.id,
      skillsetId: skillset.id,
      personalDetailsId: personalDetails.id,
      cvUrl: f.randUrl(),
    })
    .returning();

  console.log(
    `✓ [${context}] Candidate profile created: ${shortId(candidateProfile.id)}`,
  );
  return candidateProfile;
}

async function createPersonalDetails(context?: string) {
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

  if (context) {
    console.log(
      `👤 [${context}] Personal details created: ${data.firstName} ${data.lastName}`,
    );
  }
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
