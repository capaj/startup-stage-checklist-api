## startup-stage-checklist-api

### Implementation notes

- requirement to store the data in memory actually made it a little bit harder for me to implement as I am used to working on top of a database in day to day work.

- I have used prisma to model the schema. Requirement did not specify the format for the DB schema, so I hope prisma file is alright. It can be found [here](prisma/schema.prisma).

### How to run

Install node modules with `yarn`.

- to run the API: `yarn dev`
- to run specs: `yarn test`

### Note on usage of Decapi

keep in mind that for a production grade project, I would not choose decapi. It's my own personal project and I enjoy working with it, but it doesn't have the necessary community and battle proofing needed for a big scale production deployment yet.
So while it serves well for a small use case like this, for production I would choose one of these three GQL frameworks:

- https://pothos-graphql.dev/
- https://nexusjs.org/
- https://typegraphql.com/
