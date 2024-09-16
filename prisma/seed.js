const { faker } = require("@faker-js/faker");

const prisma = require("../prisma");

// seeds users
const user = Array.from({ length: 30 }).map(() => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  bio: faker.person.bio(),
  following: {
    //random users
  },
  follower: {
    //random users
  }
}));

//seeds destinations
const destinationData = Array.from({ length: 30 }).map(() => ({
  destinationName: faker.location.city({ skipDuplication: true }),
}));

//trips seed
// const tripsData = Array.from({ length: 5 }).map(() => ({
//   userId: 10,
//   destinationId: 25,
//   tripName: faker.company.name(),
//   end: faker.date.soon(),
// }));

const seed = async () => {
  await prisma.user.createMany({ data: user });
  await prisma.destination.createMany({ data: destinationData });
  // await prisma.trips.createMany({ data: tripsData });
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
