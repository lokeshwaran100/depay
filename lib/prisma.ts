import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { createClient } from "@libsql/client"

// Parse Turso URL and extract auth token from query string if present
function getTursoConfig() {
    const urlString = process.env.TURSO_DATABASE_URL
    if (!urlString) return null

    try {
        // Extract authToken from URL if present (format: libsql://...?authToken=xxx)
        const url = new URL(urlString)
        const authTokenFromUrl = url.searchParams.get("authToken")

        // Remove the authToken from URL for libsql client (it expects clean URL)
        url.searchParams.delete("authToken")
        const cleanUrl = url.toString()

        // Use auth token from URL or fall back to env variable
        const authToken = authTokenFromUrl || process.env.TURSO_AUTH_TOKEN

        if (!authToken) return null

        return { url: cleanUrl, authToken }
    } catch {
        // If URL parsing fails, fall back to env variables
        if (!process.env.TURSO_AUTH_TOKEN) return null
        return { url: urlString, authToken: process.env.TURSO_AUTH_TOKEN }
    }
}

const tursoConfig = getTursoConfig()

let prisma: PrismaClient

if (tursoConfig) {
    const libsql = createClient({
        url: tursoConfig.url,
        authToken: tursoConfig.authToken,
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
