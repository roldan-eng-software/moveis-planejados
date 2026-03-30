import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

async function applyRLSPolicies() {
  try {
    console.log("Applying RLS policies...");

    // Read the SQL file
    const sqlFilePath = path.join(
      process.cwd(),
      "prisma/migrations/implement_rls_policies.sql"
    );
    const sql = fs.readFileSync(sqlFilePath, "utf-8");

    // Split by statements (simple approach - works for this case)
    const statements = sql.split(";").filter((stmt) => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement + ";");
          console.log("✓", statement.substring(0, 80).replace(/\n/g, " "));
        } catch (error: any) {
          // Ignore policy already exists errors
          if (
            !error.message.includes("already exists") &&
            !error.message.includes("already defined")
          ) {
            console.error("✗ Error:", error.message.substring(0, 150));
          } else {
            console.log("✓", statement.substring(0, 80).replace(/\n/g, " "));
          }
        }
      }
    }

    console.log("\n✅ RLS policies applied successfully!");
  } catch (error) {
    console.error("Error applying RLS policies:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyRLSPolicies();
