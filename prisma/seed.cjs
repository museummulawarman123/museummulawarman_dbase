// prisma/seed.cjs
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const raw = process.env.ADMIN_PASS || "museum123";
  const hashed = await bcrypt.hash(raw, 10);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "museummulawarman01@gmail.com" },
    update: {}, // jangan update createdAt / updatedAt manual
    create: {
      email: process.env.ADMIN_EMAIL || "museummulawarman01@gmail.com",
      password: hashed,
      role: "ADMIN",
      name: "Super Admin",
    },
  });

  console.log("✅ Admin user created/updated");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
