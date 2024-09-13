const { faker } = require("@faker-js/faker");

const prisma = require("../prisma");

const user = Array.from({ length: 30 }).map(() => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  userName: faker.person.firstName() + faker.person.lastName(),
  email: faker.internet.email(),
  bio: faker.person.bio(),
}));

const destinationData = Array.from({ length: 30 }).map(() => ({
  destinationName: faker.location.city({ skipDuplication: true }),
}));

const seed = async () => {
  await prisma.user.createMany({ data: user });
  await prisma.destination.createMany({ data: destinationData });
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
