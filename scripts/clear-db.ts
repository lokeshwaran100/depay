import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function clearDatabase() {
    try {
        console.log('Clearing database...');

        // Delete in order of dependencies
        await prisma.transaction.deleteMany({});
        console.log('✓ Cleared transactions');

        await prisma.wallet.deleteMany({});
        console.log('✓ Cleared wallets');

        await prisma.session.deleteMany({});
        console.log('✓ Cleared sessions');

        await prisma.account.deleteMany({});
        console.log('✓ Cleared accounts');

        await prisma.user.deleteMany({});
        console.log('✓ Cleared users');

        await prisma.verificationToken.deleteMany({});
        console.log('✓ Cleared verification tokens');

        console.log('\n✅ Database cleared successfully!');
    } catch (error) {
        console.error('Error clearing database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
