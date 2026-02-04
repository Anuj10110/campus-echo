import prisma from '../config/database.js';

const LCPS_AI_URL = process.env.LCPS_AI_URL;
const LCPS_AI_TIMEOUT_MS = parseInt(process.env.LCPS_AI_TIMEOUT_MS || '15000', 10);

const mapIntentToQueryType = (intent) => {
  if (!intent) return null;
  const t = String(intent).trim();
  if (!t) return null;
  return t.toUpperCase();
};

const callLcpsAi = async (userId, query) => {
  if (!LCPS_AI_URL) return null;

  const baseUrl = LCPS_AI_URL.replace(/\/+$/, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LCPS_AI_TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, query }),
      signal: controller.signal
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`LCPS AI error ${res.status}: ${text}`);
    }

    const json = await res.json();
    const data = json?.data ?? json;

    const response = data?.response;
    const intent = data?.intent;

    if (typeof response !== 'string' || response.trim() === '') {
      throw new Error('LCPS AI returned an empty response');
    }

    return { response, intent };
  } catch (err) {
    console.warn(
      '[voiceService] LCPS AI service unavailable, falling back to local responses:',
      err?.message || err
    );
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

export const processQuery = async (userId, query) => {
  try {
    // Save query to database (best-effort type; may be upgraded after AI returns)
    const voiceQuery = await prisma.voiceQuery.create({
      data: {
        userId,
        query,
        queryType: detectQueryType(query),
        processedAt: new Date()
      }
    });

    const aiResult = await callLcpsAi(userId, query);
    const response = aiResult?.response ?? generateResponse(query);
    const upgradedQueryType = mapIntentToQueryType(aiResult?.intent);

    // Save response (and optionally overwrite queryType if AI provided an intent)
    await prisma.voiceQuery.update({
      where: { id: voiceQuery.id },
      data: {
        response,
        ...(upgradedQueryType ? { queryType: upgradedQueryType } : {})
      }
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

  if (q.includes('task')) return 'TASK';
  if (q.includes('weather')) return 'WEATHER';
  if (q.includes('calculate') || q.includes('solve')) return 'CALCULATE';
  if (q.includes('summarize')) return 'SUMMARIZE';
  if (q.includes('youtube')) return 'YOUTUBE';
  if (q.includes('joke')) return 'JOKE';

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
    return "Today's schedule: Programming at 9 AM, Data Structures at 11 AM, and Web Development at 2 PM.";
  }
  if (q.includes('event')) {
    return 'There are several upcoming events: Annual Fest on Feb 20, Tech Summit on Mar 5, and Sports Day on Mar 12.';
  }

  return `I understood: "${query}". How can I help you with campus information?`;
};
