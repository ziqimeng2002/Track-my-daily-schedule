let schedules = [];


export default async function handler(req, res) {
if (req.method === 'GET') {
return res.status(200).json({ success: true, data: schedules });
}


if (req.method === 'POST') {
let body = req.body;


// Handle raw string body (Vercel sometimes sends as string)
if (typeof body === 'string') {
try {
body = JSON.parse(body);
} catch (e) {
return res.status(400).json({ success: false, error: 'Invalid JSON format' });
}
}


const { taskName, dueDate, estimatedTime, priority } = body || {};


if (!taskName || !dueDate || !estimatedTime || !priority) {
return res.status(400).json({
success: false,
error: 'Missing required fields: taskName, dueDate, estimatedTime, priority'
});
}


const newSchedule = {
id: schedules.length + 1,
taskName,
dueDate,
estimatedTime,
priority
};


schedules.push(newSchedule);


return res.status(201).json({ success: true, data: newSchedule });
}


return res.status(405).json({ success: false, error: 'Method not allowed' });
}
