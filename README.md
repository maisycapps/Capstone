# Copilot  
### Developed by Jordan Harris, Mathew Correa, and Maisy Capps

Copilot is a user-friendly social media app designed for travelers. Register for an account to create and manage trips, and create posts to document and share your experiences. Curious about what other travelers are doing? Follow other users, view their posts, and leave a comment or like. Go places with Copilot.


## Database Routes

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