import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/authMiddleware";

async function seedAdmin() {
  try {
    // check user exist in db or not
    const adminData = {
      name: "Admin",
      email: "admin@admin.com",
      role: UserRole.ADMIN,
      password: "Admin12345",
    };
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("User already exist!");
    }
    const signupAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Origin: "http://localhost:5000",
        },
        body: JSON.stringify(adminData),
      },
    );
    if (signupAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
    console.log(signupAdmin);
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
