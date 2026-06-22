import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// The two admin accounts. Passwords are bcrypt-hashed before storage and each
// admin is forced to change their password on first login (mustChangePassword).
const ADMINS = [
  {
    email: 'stalin@vertex',
    fullName: 'Stalin',
    password: process.env.SEED_ADMIN1_PASSWORD || 'Stalin@Vrtx#2026!Kx9',
  },
  {
    email: 'yash@vertex',
    fullName: 'Yash',
    password: process.env.SEED_ADMIN2_PASSWORD || 'Yash@Vrtx#2026!Qm7',
  },
];

async function main() {
  // Remove ALL existing admins so only the two below remain.
  const removed = await prisma.user.deleteMany({ where: { role: Role.ADMIN } });
  console.log(`Removed ${removed.count} existing admin(s).`);

  for (const admin of ADMINS) {
    const passwordHash = await bcrypt.hash(admin.password, 12);
    await prisma.user.create({
      data: {
        email: admin.email,
        fullName: admin.fullName,
        passwordHash,
        role: Role.ADMIN,
        mustChangePassword: true,
        isActive: true,
      },
    });
    console.log(`Created admin: ${admin.email}`);
  }

  console.log('\nSeed complete. Initial admin passwords (must be changed on first login):');
  for (const admin of ADMINS) {
    console.log(`  ${admin.email}  ->  ${admin.password}`);
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
