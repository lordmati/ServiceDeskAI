import mongoose from "mongoose";
import User from "../models/User.js";
import Office from "../models/Office.js";
import dotenv from "dotenv";

dotenv.config();

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Limpiar usuarios de prueba anteriores (opcional)
    await User.deleteMany({ 
      email: { 
        $in: [
          "admin@servicedesk.com", 
          "servicedesk@servicedesk.com",
          "standard@servicedesk.com"
        ] 
      } 
    });

    console.log("🗑️  Cleaned old test users\n");

    // Crear usuarios de prueba
    const admin = await User.create({
      name: "Admin User",
      email: "admin@servicedesk.com",
      password: "admin123",
      role: "admin",
      phone: "000000000",
    });

    const servicedesk = await User.create({
      name: "Service Desk Agent",
      email: "servicedesk@servicedesk.com",
      password: "servicedesk123",
      role: "servicedesk",
      phone: "111111111",
    });

    const standard = await User.create({
      name: "Standard User",
      email: "standard@servicedesk.com",
      password: "test132",
      role: "standard",
      phone: "222222222",
    });

    console.log("✅ Test users created successfully:\n");
    console.log("📋 ADMIN:");
    console.log("   Email: admin@servicedesk.com");
    console.log("   Password: admin123");
    console.log("   Role: admin\n");

    console.log("📋 SERVICE DESK:");
    console.log("   Email: servicedesk@servicedesk.com");
    console.log("   Password: servicedesk123");
    console.log("   Role: servicedesk\n");

    console.log("📋 STANDARD USER:");
    console.log("   Email: standard@servicedesk.com");
    console.log("   Password: standard123");
    console.log("   Role: standard\n");

    // Crear oficinas de prueba
    const office1 = await Office.create({
      name: "Madrid Office",
      address: "Calle Gran Vía 123",
      city: "Madrid",
      country: "Spain",
      workstations: [
        { id: "WS-001", name: "Desk 1", floor: "1st Floor" },
        { id: "WS-002", name: "Desk 2", floor: "1st Floor" },
        { id: "WS-003", name: "Desk 3", floor: "2nd Floor" },
      ],
    });

    const office2 = await Office.create({
      name: "Barcelona Office",
      address: "Passeig de Gràcia 456",
      city: "Barcelona",
      country: "Spain",
      workstations: [
        { id: "WS-004", name: "Desk 4", floor: "Ground Floor" },
        { id: "WS-005", name: "Desk 5", floor: "Ground Floor" },
      ],
    });

    console.log("✅ Test offices created:");
    console.log(`   - ${office1.name} (${office1.workstations.length} workstations)`);
    console.log(`   - ${office2.name} (${office2.workstations.length} workstations)\n`);

    console.log("🎉 All test data created successfully!");
    console.log("\n🚀 You can now login with any of the test users above");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createTestData();