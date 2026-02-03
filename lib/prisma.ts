import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { createClient } from "@libsql/client"

// Only use Turso adapter if credentials are available (production)
const useTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN

let prisma: PrismaClient

if (useTurso) {
    const libsql = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    })
    const adapter = new PrismaLibSQL(libsql)
    prisma = new PrismaClient({ adapter })
} else {
    // Fall back to local SQLite for development
    const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
    prisma = globalForPrisma.prisma || new PrismaClient()
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
}

export { prisma }
