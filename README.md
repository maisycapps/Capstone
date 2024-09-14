# Travel App Capstone | Team 4: Jordan Harris, Mathew Correa, Maisy Capps

The purpose of this app is to allow registered users to create and manage travel plans or “trips”. Trips can have multiple users associated with them, allowing users to collaborate and manage their trip planning. Users may also view each other's profiles, which display user information and past trip destinations that user has visited (which the viewing user may comment on or ‘like’).

Our team intends to build an API to manage users, destinations, and trips. We would like to integrate one or more external public API that allows users to grab relevant information for their trip such as the weather based on trip dates/destination. The overall goal is to provide the client with a product that allows them to coordinate their travel plans, whether traveling alone or with a group, and to gain useful insights regarding their trip to make travel planning easy and seamless.

Scalability: could be used to plan a trip as simple as going to the grocery store, all the way up to planning a business trip involving multiple employees.

# WITH INITIAL CLONE INSTALL PACKAGES EX. PRISMA, EXPRESS, MORGAN, FAKER, JSONWEBTOKEN, REACT, BCRYPT

# ------ Database Notes ------

# Routes

- auth.js
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/account

- user.js
- GET /api/users
- GET /api/users/:id/trips
- GET /api/users/:id/trips/:id
- GET /api/users/:id/posts
- GET /api/users/:id/posts/:id

- destinations.js
- GET /api/destinations
- GET /api/destinations/:id

- posts.js
- GET /api/posts
- GET /api/posts/:id
- GET /api/posts/:id/comments

- ^ not final ^

# Database revisions/discussion

- New schema, fix relations for post, trips, destinations. Add relations for comments and posts.
* MC added comments, fixed posts, trips, destinations.

 Cant seed trips, schema needs fixing. Potentially friends?
 
- /auth/account GET, POST, DELETE needs review
- Trips GET, POST, DELETE is only for AUTH USER so no need for individual route?
  Same for Likes?

# ------ ^ Database Notes ^ ------
