const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function makeAdmin() {
    try {
        const user = await prisma.user.update({
            where: {
                email: 'maicontsuda@gmail.com'
            },
            data: {
                role: 'ADMIN'
            }
        })

        console.log('✅ Usuário atualizado para ADMIN:', user.email)
        console.log('Nome:', user.name)
        console.log('Role:', user.role)
    } catch (error) {
        console.error('❌ Erro ao atualizar usuário:', error)
    } finally {
        await prisma.$disconnect()
    }
}

makeAdmin()
