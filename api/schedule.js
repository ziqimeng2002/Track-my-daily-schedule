// api/Schedule.js

// 🚨 注意：在实际生产环境中，您应该使用数据库（如 MongoDB, PostgreSQL, FaunaDB）
// 来持久化数据。此处的内存数组仅用于演示 Serverless API 的基本功能。
const scheduleData = [
  {
    id: 's1',
    taskName: '完成 Vercel 部署文档',
    dueDate: '2025-12-15',
    estimatedTime: 120, // 分钟
    priority: 'High'
  },
];

/**
 * Serverless Function 入口
 * @param {import('@vercel/node').VercelRequest} req 
 * @param {import('@vercel/node').VercelResponse} res
 */
module.exports = (req, res) => {
  // 设置 CORS 头部，允许所有来源访问 (可选，但推荐用于前端调试)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求 (用于预检请求，确保跨域请求顺利)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- GET 请求: 获取所有日程 ---
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: scheduleData.length,
      schedules: scheduleData,
    });
  }

  // --- POST 请求: 添加新日程 ---
  if (req.method === 'POST') {
    const { taskName, dueDate, estimatedTime, priority } = req.body;

    // 🎯 错误处理: 检查必填字段
    if (!taskName || !dueDate || !estimatedTime || !priority) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: taskName, dueDate, estimatedTime, and priority are required.',
      });
    }

    const newSchedule = {
      id: `s${scheduleData.length + 1}`, // 简单生成 ID
      taskName,
      dueDate,
      estimatedTime: parseInt(estimatedTime, 10),
      priority,
    };

    scheduleData.push(newSchedule);

    return res.status(201).json({
      success: true,
      message: 'Schedule added successfully.',
      schedule: newSchedule,
    });
  }

  // --- 其他方法 (例如 PUT, DELETE) ---
  return res.status(405).json({
    success: false,
    message: `Method ${req.method} Not Allowed`,
  });
};
