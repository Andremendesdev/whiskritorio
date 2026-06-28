import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SALT_ROUNDS = 10;

export const userService = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  },

  /** Valida e-mail + senha contra o hash salvo no banco. */
  async verifyCredentials(email: string, password: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  },

  /** Cria ou atualiza o admin (usado pelo seed). */
  async upsertAdmin(email: string, password: string, name?: string) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { password: hash, name, role: "ADMIN" },
      create: { email: email.toLowerCase(), password: hash, name, role: "ADMIN" },
    });
  },
};
