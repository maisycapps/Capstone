# Travel App Capstone | Team 4: Jordan Harris, Mathew Correa, Maisy Capps

The purpose of this app is to allow registered users to create and manage travel plans or “trips”. Trips can have multiple users associated with them, allowing users to collaborate and manage their trip planning. Users may also view each other's profiles, which display user information and past trip destinations that user has visited (which the viewing user may comment on or ‘like’).

Our team intends to build an API to manage users, destinations, and trips. We would like to integrate one or more external public API that allows users to grab relevant information for their trip such as the weather based on trip dates/destination. The overall goal is to provide the client with a product that allows them to coordinate their travel plans, whether traveling alone or with a group, and to gain useful insights regarding their trip to make travel planning easy and seamless.

Scalability: could be used to plan a trip as simple as going to the grocery store, all the way up to planning a business trip involving multiple employees.

# ------ Database Notes ------

# Routes

### auth.js 
#### user (not logged in)

LOGIN & REGISTER
- POST /api/auth/register (register)
- POST /api/auth/login (login)

#### user (logged in)

ACCOUNT
- GET /api/auth/account (get token payload)
- GET /api/auth/account/users (view user's entire dataset aka account)
- PATCH /api/auth/account (edit account)
- DELETE /api/auth/account (delete account)

FOLLOWS
- POST /api/auth/account/users/:id/follows (create a follow)
- GET /api/auth/account/follows (view all follow data)
- PATCH /api/auth/account/follows/:id (edit follow - prob best used to 'unfollow')
- DELETE /api/auth/account/follows/:id (delete follow - this is unfollows AND removes the other user as a follower if they are)

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
- GET /api/auth/account/posts (get posts)
- PATCH /api/auth/account/posts/:id/comments/:id (edit auth user's specific comment on a specific post)
- DELETE /api/auth/account/posts/:id/comments/:id (delete auth user's specific comment on a specific post)

LIKES
- POST /api/auth/account/posts/:id/likes (create a like on a specific post)
- GET /api/auth/account/likes (get likes)
- DELETE /api/auth/account/posts/:id/likes/:id (delete auth user's like on a specific post)

#### admin (logged in)
- POST /api/auth/account/destinations (create destination)
- PATCH /api/auth/account/destinations/:id (edit specific destination)
- DELETE /api/auth/account/destinations/:id (delete destination)


### user.js 
#### user (not logged in)
- GET /api/users (view all users)
- GET /api/users/:id (view a specific user)
- GET /api/users/:id/posts (view a specific user's posts)
- GET /api/users/:id/posts/:id (view a specific user's specific post)


### destinations.js
#### user (not logged in)
- GET /api/destinations (view all destinations)
- GET /api/destinations/:id (view a specific destination)


### posts.js
#### user (not logged in)
- GET /api/posts (view all posts)
- GET /api/posts/:id (view a specific post)
- GET /api/posts/:id/comments (view a specific post's comments)
- GET /api/posts/:id/likes (view a specific post's likes)