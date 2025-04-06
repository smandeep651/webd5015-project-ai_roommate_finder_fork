import { Prisma, PrismaClient } from "@prisma/client";
import { users } from "./users.js"; // Ensure you include `.js` for ESM
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedDatabase() {
    console.log(" Seeding database...");

    for (const user of users) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            await prisma.user.create({
                data: {
                    name: user.name, // Remove `id`
                    email: user.email,
                    password: hashedPassword,
                    createdAt: new Date(user.createdAt),
                    preferences: {
                        create: {
                            ethnicity: user.ethnicity,
                            religion: user.religion,
                            minAge: user.ageRange.min,
                            maxAge: user.ageRange.max,
                            sex: user.sex,
                            genderPreference: user.genderPreference,
                            occupation: user.occupation,
                            preferredLocation: user.preferredLocation,
                            hasPets: user.pets.hasPets,
                            petType: user.pets.type,
                            minBudget: user.budget.min,
                            maxBudget: user.budget.max,
                            accommodationType: user.accommodationType,
                            sleepPattern: user.habits.sleepPattern,
                            drinking: user.habits.drinking,
                            smoking: user.habits.smoking,
                            cooking: user.cooking,
                        }   as Prisma.PreferencesCreateWithoutUserInput
                    } 
                }
            });
            console.log(` Added user: ${user.name}`);
        } catch (error) {
            console.error(` Error adding user ${user.name}:`, error);
        }
    }

    console.log(" Seeding complete!");
    await prisma.$disconnect();
}

seedDatabase();