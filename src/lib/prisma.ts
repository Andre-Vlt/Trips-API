import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: ['query']
});


//NPX PRISMA STUDIO (NO TERMINAL) ABRE O NAVEGADOR PARA UMA VISUALIZAÇÃO DO BANCO DE DADOS 
