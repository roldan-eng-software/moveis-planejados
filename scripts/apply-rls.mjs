import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: dbUrl,
});

async function applyRLSPolicies() {
  try {
    console.log("Applying RLS policies...\n");

    // Read the SQL file
    const sqlFile = path.join(
      path.dirname(__dirname),
      "prisma/migrations/implement_rls_policies_v2.sql"
    );
    const sql = fs.readFileSync(sqlFile, "utf-8");

    // Execute the entire script
    const client = await pool.connect();
    try {
      await client.query(sql);
      console.log("✅ All RLS policies applied successfully!");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

applyRLSPolicies();
