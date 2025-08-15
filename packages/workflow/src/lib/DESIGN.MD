



```ts
const workflow = Workflow.Pipe(
  Workflow.Generator(
    'BambooPageGenerator',
    Step.Command('FetchEmployeesPage', client, 'BREAD/HR_EMPLOYEE_SEARCH'),
  )
    .check({lte: ['']}),
)


const events = {
  { 
    execId: '1234',
    type: 'StepStarted',
    producerPath: [ '...', 'step.Command/GoogleAdminDirectoryUserSearch' ],
    payload: {},
  },
  { 
    type: 'StepSucceeded',
    producerPath: [ '...', 'step.Command/GoogleAdminDirectoryUserSearch' ],
    payload: {}
  },
  {
    type: 'Started',
    producerPath: [ '...', 'step.Function/ExtractPayload' ]
  },
  {
    type: 'Data',
    producerPath: [ '...', 'step.Function/ExtractPayload' ]
  },
  {
    type: 'Success',
    producerPath: [ '...', 'step.Function/ExtractPayload' ]
  }
}




// INSIGHTS:
// - executable should know its path
// - executable emit events with executable path


// GET EMPLOYEE DATA FROM MULTIPLE SOURCES, DEDUPE, AND WRITE TO INTERNAL DATABASE
// Sources: 
// - Bamboo
// - Google Admin Directory
const employeeWorkflow = {
  'workflow.Pipe/Root': {
    'workflow.Parallel/GetData': {
      'workflow.Pipe/GetBambooData': {
        'step.Command/EmployeeSearch': {},
        'step.Command/ExtractPayload': {}
      },
      'workflow.Pipe/GetGoogleData': {
        'workflow.Paginated/UserPageGenerator': { // emits {data: T, done: true} | {data: T, }
          'step.Command/GoogleAdminDirectoryUserSearch': {},
          paginationType: 'CURSOR',
          operator: 'step.Command/GoogleAdminDirectoryUserSearch'
        }
        'step.Function/ExtractPayload': {}
      }
    },
    'workflow.flatMap/Transform': {}
    'workflow.flatMap/Write': {}
  },
  _seq: {}
}

// MERGE JOB POSTS FROM MULTIPLE SOURCES AND WRITE TO INTERNAL DATABASE
// - EXTRACT SKILLS FROM DESCRIPTIONS
// get job posts from an API and database apis,
// populate applicants in each job post,
// Merge data: 
// - dedupe job posts (use custom function to determine if the job post is the same or not)


const workflow = {
  _id: 'entry',
  _map: {
    'workfow/GetJobPosts': {}
    'workflow/WriteJobPosts'
  },
  _seq: [
    'workflow/GetJobPosts',
    'workflow/WriteJobPosts'
  ];
}

// AGGREGATE PRODUCT REVIEWS FROM CONNECTED PLATFORMS TO CREATE BLACK FRIDAY EFFERINGS:
// - HIGH SALE FOR WORST PERFORMERS + TAILORED MARKETING MATERIALS
// - LOWER SALE FOR BEST PERFORMERS + TAILORED MARKETING MATERIALS
// - ESTIMATE RE-STOCK AMMOUNTS AND CREATE ORDERS ON SUPPLIER PLATFORMS (each supplier has different order method)
```