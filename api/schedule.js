// api/Schedule.js

// In a production application, data should be persisted in a database (e.g., Firestore, MongoDB, PostgreSQL).
// This in-memory array is for demonstration and basic testing purposes only.
const scheduleData = [
  {
    id: 's1',
    taskName: 'Review Vercel Deployment Guides',
    dueDate: '2025-12-15',
    estimatedTime: 120, // minutes
    priority: 'High'
  },
];

/**
 * Vercel Serverless Function entry point.
 * @param {import('@vercel/node').VercelRequest} req 
 * @param {import('@vercel/node').VercelResponse} res
 */
module.exports = (req, res) => {
  // Set CORS headers for safe cross-origin requests (essential for frontend testing)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS method (pre-flight request)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- GET Request: Retrieve all schedules ---
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: scheduleData.length,
      schedules: scheduleData,
    });
  }

  // --- POST Request: Add a new schedule item ---
  if (req.method === 'POST') {
    const { taskName, dueDate, estimatedTime, priority } = req.body;

    // Error Handling: Check for missing required fields
    if (!taskName || !dueDate || !estimatedTime || !priority) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. taskName, dueDate, estimatedTime, and priority are mandatory.',
      });
    }

    // Input validation (basic type checking)
    const timeInMinutes = parseInt(estimatedTime, 10);
    if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid estimatedTime. Must be a positive number.'
        });
    }

    const newSchedule = {
      id: `s${Date.now()}`, // Use timestamp for a unique ID
      taskName,
      dueDate,
      estimatedTime: timeInMinutes,
      priority,
    };

    scheduleData.push(newSchedule);

    return res.status(201).json({
      success: true,
      message: 'Schedule item added successfully.',
      schedule: newSchedule,
    });
  }

  // --- Fallback for unsupported methods ---
  return res.status(405).json({
    success: false,
    message: `Method ${req.method} Not Allowed. Only GET and POST are supported.`,
  });
};
