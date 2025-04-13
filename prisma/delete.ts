import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteAllData() {
  try {
    console.log("🧹 Deleting all user-related data...");

    // Delete in order to avoid relation constraints
    await prisma.message.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.preferences.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("✅ All data deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllData();
