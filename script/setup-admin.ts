import { authStorage } from "../server/auth/storage";
import { db } from "../server/db";

/**
 * Setup script to create an admin user
 * Usage: tsx script/setup-admin.ts <email> <password> [firstName] [lastName]
 */

async function setupAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error("Usage: tsx script/setup-admin.ts <email> <password> [firstName] [lastName]");
    console.error("Example: tsx script/setup-admin.ts admin@umedhfoundation.org mypassword123 Admin User");
    process.exit(1);
  }

  const [email, password, firstName, lastName] = args;

  if (!email || !password) {
    console.error("Error: Email and password are required");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Error: Password must be at least 8 characters long");
    process.exit(1);
  }

  try {
    console.log("Creating admin user...");
    const user = await authStorage.createAdminUser(
      email,
      password,
      firstName || "Admin",
      lastName || "User"
    );
    
    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`ID: ${user.id}`);
    console.log("\nYou can now log in at http://localhost:5000/login");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

setupAdmin();
