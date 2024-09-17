# Travel App Capstone | Team 4: Jordan Harris, Mathew Correa, Maisy Capps

The purpose of this app is to allow registered users to create and manage travel plans or “trips”. Trips can have multiple users associated with them, allowing users to collaborate and manage their trip planning. Users may also view each other's profiles, which display user information and past trip destinations that user has visited (which the viewing user may comment on or ‘like’).

Our team intends to build an API to manage users, destinations, and trips. We would like to integrate one or more external public API that allows users to grab relevant information for their trip such as the weather based on trip dates/destination. The overall goal is to provide the client with a product that allows them to coordinate their travel plans, whether traveling alone or with a group, and to gain useful insights regarding their trip to make travel planning easy and seamless.

Scalability: could be used to plan a trip as simple as going to the grocery store, all the way up to planning a business trip involving multiple employees.

# WITH INITIAL CLONE INSTALL PACKAGES EX. PRISMA, EXPRESS, MORGAN, FAKER, JSONWEBTOKEN, REACT, BCRYPT

# ------ Database Notes ------

# Routes

auth.js

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/account

user.js

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
  Cant seed trips, schema needs fixing. Potentially friends?

- /auth/account GET, POST, DELETE needs review
- Trips GET, POST, DELETE is only for AUTH USER so no need for individual route?
  Same for Likes?

# ------ ^ Database Notes ^ ------

<!-- MC notes -->

# MC topics. Need team go-ahead before doing:

# MC notes

Social: User friendships

Frontend: Following / Follower

- Logged in users should have access to a seach bar to search other users by name
  -Can follow another user
- Can follow another user (maybe a frontend button "follow" w/ onClick callback that sets the clicked-on user's id as a followingId in the auth user's following array && makes the auth user set to followerId in the receiving user's followers array)

Social: Trips with multiple users

- If both users follow eachother, they can add eachother to trips (also modeled after tripDestinations relationship)

"Friends" Query

- MC todo: implement query to determine if users follow one another. If mutual, either considered a "friend" and can be displayed as such (will ref db schema: if followedBy === following)

Optimization?

- Best practices thought: Make all "update" functions PATCH instead of PUT? Ie, in auth.js, router.put"/account/trips/:id" lines 222-230 wouldn't need || statements
