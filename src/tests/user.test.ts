const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

test('creates a user', async () => {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    }
  });

  expect(user).toHaveProperty('id');
  expect(user.name).toBe('John Doe');
  expect(user.email).toBe('john.doe@example.com');
});
