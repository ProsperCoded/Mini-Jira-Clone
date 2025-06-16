import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      username: 'johndev',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Developer',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      username: 'janedesigner',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Designer',
    },
  });

  console.log('✅ Created demo users');

  // Create demo teams
  const team1 = await prisma.team.create({
    data: {
      name: 'Frontend Development Team',
      description: 'Team responsible for building amazing user interfaces',
      type: 'PUBLIC',
      ownerId: user1.id,
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: 'Backend API Team',
      description: 'Team building scalable backend services',
      type: 'PRIVATE',
      joinCode: 'BACKEND2024',
      ownerId: user1.id,
    },
  });

  console.log('✅ Created demo teams');

  // Add team members
  await prisma.teamMember.create({
    data: {
      userId: user1.id,
      teamId: team1.id,
      role: 'ADMIN',
    },
  });

  await prisma.teamMember.create({
    data: {
      userId: user2.id,
      teamId: team1.id,
      role: 'MEMBER',
    },
  });

  await prisma.teamMember.create({
    data: {
      userId: user3.id,
      teamId: team1.id,
      role: 'MEMBER',
    },
  });

  await prisma.teamMember.create({
    data: {
      userId: user1.id,
      teamId: team2.id,
      role: 'ADMIN',
    },
  });

  await prisma.teamMember.create({
    data: {
      userId: user2.id,
      teamId: team2.id,
      role: 'MEMBER',
    },
  });

  console.log('✅ Created team memberships');

  // Create demo tasks
  await prisma.task.create({
    data: {
      title: 'Design login page wireframes',
      description:
        'Create wireframes for the user authentication flow including login and registration pages',
      priority: 'HIGH',
      status: 'TODO',
      teamId: team1.id,
      creatorId: user1.id,
      assigneeId: user3.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Implement user authentication API',
      description:
        'Build JWT-based authentication endpoints for login, registration, and token refresh',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      teamId: team2.id,
      creatorId: user1.id,
      assigneeId: user2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Setup project documentation',
      description:
        'Create comprehensive documentation for the project setup and API endpoints',
      priority: 'MEDIUM',
      status: 'DONE',
      teamId: team1.id,
      creatorId: user1.id,
      assigneeId: user1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Build task board component',
      description: 'Create a drag-and-drop Kanban board for task management',
      priority: 'MEDIUM',
      status: 'TODO',
      teamId: team1.id,
      creatorId: user2.id,
      assigneeId: user2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Database optimization',
      description: 'Optimize database queries and add necessary indexes',
      priority: 'LOW',
      status: 'TODO',
      teamId: team2.id,
      creatorId: user1.id,
    },
  });

  console.log('✅ Created demo tasks');
  console.log('🎉 Database seeding completed successfully!');
  console.log('\nDemo Accounts:');
  console.log('📧 admin@example.com (password: password123)');
  console.log('📧 john@example.com (password: password123)');
  console.log('📧 jane@example.com (password: password123)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
