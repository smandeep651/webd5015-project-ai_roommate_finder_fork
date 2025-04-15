const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

test('creates a user', async () => {
  const timestamp = Date.now();
  const email = `john.doe+${timestamp}@example.com`;

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: email,
      password: 'password123'
    }
  });

  expect(user).toHaveProperty('id');
  expect(user.name).toBe('John Doe');
  expect(user.email).toBe(email); 
});
