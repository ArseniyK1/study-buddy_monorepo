import { faker } from '@faker-js/faker';
import { PrismaClient, auth_user } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const createUsers = async (quantity: number) => {
  const users: auth_user[] = [];

  for (let i = 0; i < quantity; i++) {
    const user = await prisma.auth_user.create({
      data: {
        first_name: faker.person.firstName(),
        second_name: faker.person.lastName(),
        middle_name: faker.person.middleName(),
        password: faker.lorem.word(),
        email: faker.internet.email(),
        role_id: faker.number.int({ min: 1, max: 3 }),
      },
    });

    users.push(user);
  }

  console.log(`Created ${users.length} users`);
};

async function main() {
  console.log('Start seeding...');

  await createUsers(10000);
}

main()
  .catch((error) => console.error(error))
  .finally(async () => await prisma.$disconnect());
