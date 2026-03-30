import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

async function applyRLSPolicies() {
  try {
    console.log("Applying RLS policies...");

    // Read the SQL file
    const sqlFile = path.join(process.cwd(), "prisma/migrations/implement_rls_policies.sql");
    const sql = fs.readFileSync(sqlFile, "utf-8");

    // Split by semicolons
    const statements = sql.split(";").filter((stmt) => stmt.trim());

    let successCount = 0;
    let skippedCount = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement + ";");
          successCount++;
          const preview = statement.substring(0, 60).replace(/\n/g, " ");
          console.log("✓", preview);
        } catch (error) {
          if (
            error.message &&
            (error.message.includes("already exists") ||
              error.message.includes("already defined"))
          ) {
            skippedCount++;
          } else {
            console.error("✗", error.message?.substring(0, 100) || "Unknown error");
          }
        }
      }
    }

    console.log(`\n✅ Applied ${successCount} statements (${skippedCount} already existed)`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyRLSPolicies();
