import { PrismaClient } from '@prisma/client'
import path from 'path'

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:.')) {
    return envUrl;
  }
  const dbDir = process.env.PERSISTENT_DIR || path.join(process.cwd(), 'prisma');
  const dbPath = path.join(dbDir, 'dev.db');
  const formattedPath = dbPath.replace(/\\/g, '/');
  return `file:${formattedPath}`;
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
