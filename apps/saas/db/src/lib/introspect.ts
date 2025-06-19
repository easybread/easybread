import { load } from 'ts-dotenv';

async function mainTwo() {
  import { connector } from '@dbml/connector';
  const databaseSchema = await connector.fetchSchemaJson(
    load({ POSTGRES_FOO_CONN_URL: String }).POSTGRES_FOO_CONN_URL,
    'postgres',
  );

  console.log(JSON.stringify(databaseSchema));
  // process schema
}

//  NOT GOOD
// async function mainThree() {
// const inspector = await PostgreSQL.create(
//   load({
//     POSTGRES_FOO_CONN_URL: String,
//   }).POSTGRES_FOO_CONN_URL,
// );

// console.log(JSON.stringify(inspector));
// console.log(inspector.relations);
// console.log(inspector.deps);
// }

mainOne();
