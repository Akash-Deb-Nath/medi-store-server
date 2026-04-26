// {
//   "name": "medi-store-server",
//   "version": "1.0.0",
//   "description": "MediStore Backend API",
//   "main": "api/server.js",
//   "type": "module",
//   "scripts": {
//     "dev": "tsx watch src/server.ts",
//     "seed:admin": "tsx src/scripts/seedAdmin.ts",
//     "migrate": "prisma migrate dev",
//     "generate": "prisma generate",
//     "studio": "prisma studio",
//     "push": "prisma db push",
//     "pull": "prisma db pull",
//     "stripe:webhook": "stripe listen --forward-to localhost:5000/webhook",
//     "build": "prisma generate && tsup src/server.ts --format esm --platform node --target node20 --outDir api --clean --external pg-native --external @prisma/client --external .prisma/client",
//     "postinstall": "prisma generate",
//     "vercel-build": "prisma generate && pnpm run build",
//     "start": "node api/server.js"
//   },
//   "keywords": [
//     "express",
//     "api",
//     "medistore"
//   ],
//   "author": "",
//   "license": "ISC",
//   "packageManager": "pnpm@10.28.0",
//   "engines": {
//     "node": ">=20.0.0",
//     "pnpm": ">=9.0.0"
//   },
//   "devDependencies": {
//     "@types/express": "^5.0.6",
//     "@types/node": "^25.1.0",
//     "@types/pg": "^8.16.0",
//     "prisma": "7.4.2",
//     "tsup": "^8.5.1",
//     "tsx": "^4.21.0",
//     "typescript": "^5.9.3"
//   },
//   "dependencies": {
//     "@better-auth/prisma-adapter": "^1.5.3",
//     "@prisma/adapter-pg": "^7.3.0",
//     "@prisma/client": "7.4.2",
//     "@types/cors": "^2.8.19",
//     "better-auth": "^1.4.18",
//     "cors": "^2.8.6",
//     "dotenv": "^17.2.3",
//     "express": "^5.2.1",
//     "pg": "^8.17.2",
//     "stripe": "^22.1.0"
//   }
// }