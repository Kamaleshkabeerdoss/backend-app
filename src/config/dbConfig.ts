import knex from 'knex';
import { Model } from 'objection'; // Model is the base class for all Objection models
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'mssql',
  connection: {
    server: process.env.DB_SERVER!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      instanceName: process.env.DB_INSTANCE!,//CHANGED FROM OLD
    },
  },
});

// Bind all Models to this Knex instance- Tell Objection to use this Knex instance
Model.knex(db);//CHANGED FROM OLD

export default db;












// // import Knex from 'knex'; // Correct Knex import
// import { knex } from 'knex';
// import { Model } from 'objection';
// import * as dotenv from 'dotenv';

// dotenv.config();  // Load environment variables

// const knexInstance = knex({
//   client: 'mssql',
//   connection: {
//     server: process.env.DB_SERVER,
//     database: process.env.DB_DATABASE,
//     port: Number(process.env.DB_PORT),
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     options: {
//       encrypt: false,
//       trustServerCertificate: true,
//     },
//   },
//   // pool: {
//   //   min: 0,
//   //   max: 10,
//   // },
// });

// // Bind the Knex instance to Objection models
// Model.knex(knexInstance);

// console.log('✅ Connected to SQL Server with Knex');

// export default knexInstance;
