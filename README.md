# Travel App Capstone | Team 4: Jordan Harris, Mathew Correa, Maisy Capps

The purpose of this app is to allow registered users to create and manage travel plans or “trips”. Trips can have multiple users associated with them, allowing users to collaborate and manage their trip planning. Users may also view each other's profiles, which display user information and past trip destinations that user has visited (which the viewing user may comment on or ‘like’).

Our team intends to build an API to manage users, destinations, and trips. We would like to integrate one or more external public API that allows users to grab relevant information for their trip such as the weather based on trip dates/destination. The overall goal is to provide the client with a product that allows them to coordinate their travel plans, whether traveling alone or with a group, and to gain useful insights regarding their trip to make travel planning easy and seamless.

Scalability: could be used to plan a trip as simple as going to the grocery store, all the way up to planning a business trip involving multiple employees.

# WITH INITIAL CLONE INSTALL PACKAGES EX. PRISMA, EXPRESS, MORGAN, FAKER, JSONWEBTOKEN, REACT, BCRYPT

# ------ Database Notes ------

# Routes

auth.js (logged in user)

LOGIN & REGISTER
- POST /api/auth/register (register)
- POST /api/auth/login (login)

ACCOUNT
- GET /api/auth/account (view account)
- PATCH /api/auth/account (edit account)
- DELETE /api/auth/account (delete account)

TRIPS
- POST /api/auth/account/trips (create trip)
- GET /api/auth/account/trips (get trips)
- PATCH /api/auth/account/trips/:id (edit trip)
- DELETE /api/auth/account/trips/:id (delete trip)

POSTS
- POST /api/auth/account/posts (create post)
- GET /api/auth/account/posts (get posts)
- PATCH /api/auth/account/posts/:id (edit post)
- DELETE /api/auth/account/posts/:id (delete post)

COMMENTS
- POST /api/auth/account/posts/:id/comments (create a comment on a specific post)
- PATCH /api/auth/account/posts/:id/comments/:id (edit auth user's specific comment on a specific post)
- DELETE /api/auth/account/posts/:id/comments/:id (delete auth user's specific comment on a specific post)

LIKES
- POST /api/auth/account/posts/:id/likes (create a like on a specific post)
- DELETE /api/auth/account/posts/:id/likes/:id (delete auth user's like on a specific post)

ADMIN ONLY?
- POST /api/auth/account/destinations (create destination)
- DELETE /api/auth/account/destinations/:id (delete destination)
- GET /api/auth/account/users/:id/trips (view a specific user's trips)
- GET /api/auth/account/users/:id/trips/:id (view a specific user's specific trip)

user.js (not logged in user)

- GET /api/users (view all users)
- GET /api/users/:id (view a specific user)
- GET /api/users/:id/posts (view a specific user's posts)
- GET /api/users/:id/posts/:id (view a specific user's specific post)

destinations.js (not logged in user)

- GET /api/destinations (view all destinations)
- GET /api/destinations/:id (view a specific destination)

posts.js (not logged in user)

- GET /api/posts (view all posts)
- GET /api/posts/:id (view a specific post)
- GET /api/posts/:id/comments (view a specific post's comments)
- GET /api/posts/:id/likes (view a specific post's likes)

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

General Q's:
- Is our package-lock.json supposed to be so long....? 

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
