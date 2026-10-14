import "dotenv/config";
import { createPrismaClient } from "../lib/prisma-factory";

const prisma = createPrismaClient();

async function backupDatabase() {
  try {
    console.log("📦 Backing up database...");

    // Fetch all data
    const users = await prisma.user.findMany();
    const categories = await prisma.category.findMany();
    const posts = await prisma.blogPost.findMany();
    const inquiries = await prisma.contactInquiry.findMany();

    console.log("\n📊 Database Contents:");
    console.log(`- Users: ${users.length}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Blog Posts: ${posts.length}`);
    console.log(`- Inquiries: ${inquiries.length}`);

    // Output as JSON
    const backup = {
      users,
      categories,
      posts,
      inquiries,
      backedUpAt: new Date().toISOString(),
    };

    console.log("\n📄 Backup Data (copy this to seed.ts):\n");
    console.log(JSON.stringify(backup, null, 2));

    await prisma.$disconnect();
  } catch (error) {
    console.error("Error backing up database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

backupDatabase();
