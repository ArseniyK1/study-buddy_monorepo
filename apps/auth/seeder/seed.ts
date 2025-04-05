import { faker } from '@faker-js/faker';
import { PrismaClient, auth_user, role } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const createUsers = async (quantity: number) => {
  const users: auth_user[] = [];
  const salt = await genSalt(10); // С помощью библиотеки bycrypt создаём соль
  const hashPassword = await hash('test', salt); // bycrypt создаёт хеш пароля

  for (let i = 0; i < quantity; i++) {
    const user = await prisma.auth_user.create({
      data: {
        first_name: faker.person.firstName(),
        second_name: faker.person.lastName(),
        middle_name: faker.person.middleName(),
        password: hashPassword,
        email: faker.internet.email(),
        role_id: faker.number.int({ min: 1, max: 3 }),
      },
    });

    users.push(user);
  }

  console.log(`Created ${users.length} users`);
};

const createRoles = async () => {
  const roles: role[] = [];
  const roles_values = [
    {
      value: 'USER',
      description: 'Пользователь',
    },
    {
      value: 'ADMIN',
      description: 'Администратор',
    },
    {
      value: 'MANAGER',
      description: 'Менеджер',
    },
  ];
  for (let i = 0; i < 3; i++) {
    const role = await prisma.role.create({
      data: {
        value: roles_values[i].value,
        description: roles_values[i].description,
      },
    });

    roles.push(role);
  }

  console.log(`Created ${roles.length} roles`);
};

async function main() {
  console.log('Start seeding...');

  await createRoles();
  await createUsers(1000);
}

main()
  .catch((error) => console.error(error))
  .finally(async () => await prisma.$disconnect());
