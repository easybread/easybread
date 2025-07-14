



```ts
const workflow = Workflow.Pipe(
  Workflow.Generator(
    'BambooPageGenerator',
    Step.Command('FetchEmployeesPage', client, 'BREAD/HR_EMPLOYEE_SEARCH'),
  )
    .check({lte: ['']}),
)
```