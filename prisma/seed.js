const { faker } = require("@faker-js/faker");

const prisma = require("../prisma");

//seeds users
const user = Array.from({ length: 30 }).map(() => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  bio: faker.person.bio(),
  profileImg: faker.image.urlLoremFlickr({
    width: 300,
    height: 300,
    category: "profile pictures",
  }),
  //tried to seed followedBy and following- can't grab followData seed nums to do so accurately.
}));

//seeds follows
const followData = Array.from({ length: 20 }).map(() => ({
  followedById: faker.number.int({ min: 1, max: 15 }),
  //different numerical ranges so seeded users can't follow themselves
  followingId: faker.number.int({ min: 16, max: 30 }),
}));

//seeds destinations
const destinationData = Array.from({ length: 30 }).map(() => ({
  destinationName: faker.location.city({ skipDuplication: false }),
  destinationImg: faker.image.urlLoremFlickr({
    width: 300,
    height: 300,
    category: "cities",
  }),
}));

//seeds trips
const tripsData = Array.from({ length: 5 }).map(() => ({
  userId: faker.number.int({ min: 1, max: 30 }),
  destinationId: faker.number.int({ min: 1, max: 30 }),
  tripName: faker.word.words(),
  startDate: faker.date.soon(),
  endDate: faker.date.soon(),
}));

//seeds posts
const postData = Array.from({ length: 30 }).map(() => ({
  userId: faker.number.int({ min: 1, max: 30 }),
  text: faker.lorem.sentences(3),
  postImg: faker.image.urlLoremFlickr({
    width: 300,
    height: 300,
    category: "cities",
  }),
  destinationId: faker.number.int({ min: 1, max: 30 }),
}));

//seeds comments
const commentData = Array.from({ length: 30 }).map(() => ({
  userId: faker.number.int({ min: 1, max: 30 }),
  text: faker.lorem.sentences(1),
  postId: faker.number.int({ min: 1, max: 30 }),
}));

//seeds likes
const likeData = Array.from({ length: 30 }).map(() => ({
  userId: faker.number.int({ min: 1, max: 30 }),
  postId: faker.number.int({ min: 1, max: 30 }),
}));

const seed = async () => {
  await prisma.users.createMany({ data: user });
  await prisma.destinations.createMany({ data: destinationData });
  await prisma.trips.createMany({ data: tripsData });
  await prisma.posts.createMany({ data: postData });
  await prisma.comments.createMany({ data: commentData });
  await prisma.likes.createMany({ data: likeData });
  await prisma.follows.createMany({ data: followData });
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
