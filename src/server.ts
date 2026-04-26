import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("An error occured: ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

export default app;
