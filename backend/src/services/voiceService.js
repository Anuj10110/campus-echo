import prisma from '../config/database.js';

export const processQuery = async (userId, query) => {
  try {
    // Save query to database
    const voiceQuery = await prisma.voiceQuery.create({
      data: {
        userId,
        query,
        queryType: detectQueryType(query),
        processedAt: new Date()
      }
    });

    // Generate AI response based on query
    const response = generateResponse(query);

    // Save response
    await prisma.voiceQuery.update({
      where: { id: voiceQuery.id },
      data: { response }
    });

    return {
      success: true,
      data: {
        query,
        response,
        queryId: voiceQuery.id
      }
    };
  } catch (error) {
    console.error('Process query error:', error);
    return {
      success: false,
      message: 'Failed to process query',
      error: error.message
    };
  }
};

export const getQueryHistory = async (userId) => {
  try {
    const queries = await prisma.voiceQuery.findMany({
      where: { userId },
      orderBy: { processedAt: 'desc' },
      take: 20
    });

    return {
      success: true,
      data: queries
    };
  } catch (error) {
    console.error('Get history error:', error);
    return {
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    };
  }
};

const detectQueryType = (query) => {
  const q = query.toLowerCase();
  if (q.includes('notice')) return 'NOTICE';
  if (q.includes('deadline') || q.includes('due')) return 'DEADLINE';
  if (q.includes('exam')) return 'EXAM';
  if (q.includes('schedule') || q.includes('class')) return 'SCHEDULE';
  if (q.includes('event')) return 'EVENT';
  return 'GENERAL';
};

const generateResponse = (query) => {
  const q = query.toLowerCase();

  if (q.includes('notice')) {
    return 'You have 3 new campus notices. The latest is about the upcoming hackathon next month. Check your dashboard for details.';
  }
  if (q.includes('deadline') || q.includes('due')) {
    return 'You have 2 upcoming deadlines: CS Assignment due tomorrow at 5 PM, and Math Project due on Friday. Start working on them!';
  }
  if (q.includes('exam')) {
    return 'Your next exam is Data Structures on February 15th. You have 12 days to prepare. Good luck!';
  }
  if (q.includes('schedule') || q.includes('class')) {
    return 'Today\'s schedule: Programming at 9 AM, Data Structures at 11 AM, and Web Development at 2 PM.';
  }
  if (q.includes('event')) {
    return 'There are several upcoming events: Annual Fest on Feb 20, Tech Summit on Mar 5, and Sports Day on Mar 12.';
  }

  return `I understood: "${query}". How can I help you with campus information?`;
};
