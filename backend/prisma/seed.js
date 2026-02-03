import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    await prisma.refreshToken.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.student.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.user.deleteMany();

    // Hash password for test users
    const hashedPassword = await bcrypt.hash('Test@1234', 10);

    // Create test student
    const student = await prisma.user.create({
      data: {
        email: 'student@college.edu',
        passwordHash: hashedPassword,
        userType: 'STUDENT',
        isVerified: true,
        isActive: true,
        student: {
          create: {
            fullName: 'John Doe',
            rollNumber: '2024CS001',
            department: 'Computer Science',
            year: '2nd Year',
            phone: '+919876543210'
          }
        }
      },
      include: { student: true }
    });

    console.log('✅ Test Student created:', student.email);

    // Create test faculty
    const faculty = await prisma.user.create({
      data: {
        email: 'faculty@college.edu',
        passwordHash: hashedPassword,
        userType: 'FACULTY',
        isVerified: true,
        isActive: true,
        faculty: {
          create: {
            fullName: 'Dr. Jane Smith',
            employeeId: 'FAC2024001',
            department: 'Computer Science',
            designation: 'Assistant Professor',
            phone: '+919876543211'
          }
        }
      },
      include: { faculty: true }
    });

    console.log('✅ Test Faculty created:', faculty.email);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Student:');
    console.log('  Email: student@college.edu');
    console.log('  Password: Test@1234');
    console.log('\nFaculty:');
    console.log('  Email: faculty@college.edu');
    console.log('  Password: Test@1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
