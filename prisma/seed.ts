import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Hash passwords
  const hashedAdminPassword = await bcrypt.hash('DeaTH199124', 10)
  const hashedCustomerPassword = await bcrypt.hash('customer123', 10)
  const hashedDesignerPassword = await bcrypt.hash('designer123', 10)
  const hashedSeamstressPassword = await bcrypt.hash('seamstress123', 10)

  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'theunseendev@gmail.com' },
    update: {},
    create: {
      id: 'admin_001',
      email: 'theunseendev@gmail.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isAdmin: true,
    }
  })

  const customerUser = await prisma.user.upsert({
    where: { email: 'sarah.customer@example.com' },
    update: {},
    create: {
      email: 'sarah.customer@example.com',
      password: hashedCustomerPassword,
      name: 'Sarah Customer',
      role: 'CUSTOMER',
    }
  })

  const designerUser = await prisma.user.upsert({
    where: { email: 'emma.designer@example.com' },
    update: {},
    create: {
      id: 'designer_001',
      email: 'emma.designer@example.com',
      password: hashedDesignerPassword,
      name: 'Emma Designer',
      role: 'DESIGNER',
    }
  })

  const seamstressUser = await prisma.user.upsert({
    where: { email: 'maria.seamstress@example.com' },
    update: {},
    create: {
      id: 'seamstress_001',
      email: 'maria.seamstress@example.com',
      password: hashedSeamstressPassword,
      name: 'Maria Seamstress',
      role: 'SEAMSTRESS',
    }
  })

  // Create seamstress profile
  await prisma.seamstress.upsert({
    where: { userId: seamstressUser.id },
    update: {},
    create: {
      id: 'seamstress_001',
      userId: seamstressUser.id,
      specialty: JSON.stringify(['Wedding', 'Evening Wear', 'Casual']),
      rating: 4.5,
      completedOrders: 25,
      location: 'New York, NY',
      bio: 'Experienced seamstress specializing in custom dresses',
      image: null,
      basePrice: 150,
      estimatedDays: '7-14',
      isActive: true,
    }
  })

  // Demo design can be created separately if needed

  console.log('Database seeded with demo accounts!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })