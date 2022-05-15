import { PrismaClient } from '@prisma/client';
import prisma from './client';

export const context: Context = {
  prisma: prisma
}

export type Context = {
  prisma: PrismaClient
}