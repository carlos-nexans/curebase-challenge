import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create 3 trials
  const trials = await Promise.all([
    prisma.trial.create({
      data: {
        name: 'Diabetes Prevention Study',
      },
    }),
    prisma.trial.create({
      data: {
        name: 'COVID Recovery Research',
      },
    }),
    prisma.trial.create({
      data: {
        name: 'General Health Assessment',
      },
    }),
  ]);

  // Create participants for each trial
  for (const trial of trials) {
    const participantCount = Math.floor(Math.random() * 3) + 2; // 2-4 participants per trial
    
    for (let i = 0; i < participantCount; i++) {
      await prisma.participant.create({
        data: {
          name: faker.person.fullName(),
          height: 65 + Math.random() * 10, // Heights between 65-75 inches
          weight: 120 + Math.random() * 100, // Weights between 120-220 pounds
          hasDiabetes: Math.random() > 0.8, // 20% chance of having diabetes
          hadCovid: Math.random() > 0.7, // 30% chance of having had COVID
          trialId: trial.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });