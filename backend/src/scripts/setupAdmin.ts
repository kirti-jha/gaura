import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { ensureServiceConfigSeed } from "../lib/ensureServiceConfigSeed";

const prisma = new PrismaClient();

const EMAIL = (process.env.ADMIN_EMAIL || "admin@123.com").trim().toLowerCase();
const PASSWORD = process.env.ADMIN_PASSWORD || "8368";
const FULL_NAME = process.env.ADMIN_FULL_NAME || "System Admin";

async function main() {
  console.log("Setting up admin user...");

  try {
    const existing = await prisma.authUser.findUnique({ where: { email: EMAIL } });
    if (existing) {
      const passwordHash = await bcrypt.hash(PASSWORD, 10);

      await prisma.authUser.update({
        where: { email: EMAIL },
        data: { passwordHash, isActive: true },
      });

      await prisma.profile.upsert({
        where: { userId: existing.userId },
        update: {
          fullName: FULL_NAME,
          status: "active",
          kycStatus: "verified",
          isMasterAdmin: true,
        },
        create: {
          userId: existing.userId,
          fullName: FULL_NAME,
          status: "active",
          kycStatus: "verified",
          isMasterAdmin: true,
        },
      });

      await prisma.userRole.upsert({
        where: { userId_role: { userId: existing.userId, role: "admin" } },
        update: {},
        create: { userId: existing.userId, role: "admin" },
      });

      await prisma.staffPermission.upsert({
        where: { userId: existing.userId },
        update: {
          canManageUsers: true,
          canManageFinance: true,
          canManageCommissions: true,
          canManageServices: true,
          canManageSupport: true,
          canCreateUsers: true,
          canEditUsers: true,
          canBlockUsers: true,
          canDeleteUsers: true,
          canManageUserServices: true,
          canChangeUserRoles: true,
          canResetUserPasswords: true,
          canViewUserDocs: true,
          canApproveFundRequests: true,
          canRejectFundRequests: true,
          canManageBankAccounts: true,
          canViewTransactions: true,
          canPerformWalletTransfer: true,
          canManageGlobalServices: true,
          canManageSettings: true,
          canManageSecurity: true,
          canReplySupportTickets: true,
          canViewReports: true,
          grantedBy: existing.userId,
        },
        create: {
          userId: existing.userId,
          canManageUsers: true,
          canManageFinance: true,
          canManageCommissions: true,
          canManageServices: true,
          canManageSupport: true,
          canCreateUsers: true,
          canEditUsers: true,
          canBlockUsers: true,
          canDeleteUsers: true,
          canManageUserServices: true,
          canChangeUserRoles: true,
          canResetUserPasswords: true,
          canViewUserDocs: true,
          canApproveFundRequests: true,
          canRejectFundRequests: true,
          canManageBankAccounts: true,
          canViewTransactions: true,
          canPerformWalletTransfer: true,
          canManageGlobalServices: true,
          canManageSettings: true,
          canManageSecurity: true,
          canReplySupportTickets: true,
          canViewReports: true,
          grantedBy: existing.userId,
        },
      });

      await prisma.wallet.upsert({
        where: { userId: existing.userId },
        update: {},
        create: { userId: existing.userId, balance: 0, eWalletBalance: 0 },
      });

      await ensureServiceConfigSeed(prisma);

      console.log(`Admin account updated successfully for ${EMAIL}`);
      return;
    }

    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    const userId = randomUUID();

    await prisma.authUser.create({
      data: { userId, email: EMAIL, passwordHash, isActive: true },
    });

    await prisma.profile.create({
      data: {
        userId,
        fullName: FULL_NAME,
        status: "active",
        kycStatus: "verified",
        isMasterAdmin: true,
      },
    });

    await prisma.userRole.create({
      data: { userId, role: "admin" },
    });

    await prisma.staffPermission.create({
      data: {
        userId,
        canManageUsers: true,
        canManageFinance: true,
        canManageCommissions: true,
        canManageServices: true,
        canManageSupport: true,
        canCreateUsers: true,
        canEditUsers: true,
        canBlockUsers: true,
        canDeleteUsers: true,
        canManageUserServices: true,
        canChangeUserRoles: true,
        canResetUserPasswords: true,
        canViewUserDocs: true,
        canApproveFundRequests: true,
        canRejectFundRequests: true,
        canManageBankAccounts: true,
        canViewTransactions: true,
        canPerformWalletTransfer: true,
        canManageGlobalServices: true,
        canManageSettings: true,
        canManageSecurity: true,
        canReplySupportTickets: true,
        canViewReports: true,
        grantedBy: userId,
      },
    });

    await prisma.wallet.create({
      data: { userId, balance: 0, eWalletBalance: 0 },
    });

    await ensureServiceConfigSeed(prisma);

    console.log(`Admin account created successfully for ${EMAIL}`);
  } catch (error) {
    console.error("Error setting up admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
