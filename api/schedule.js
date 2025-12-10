export const config = {
runtime: 'edge' // super simple & always works
};


let schedules = [];


export default async function handler(req) {
const { method } = req;


if (method === 'GET') {
return new Response(JSON.stringify({ success: true, data: schedules }), {
status: 200,
headers: { 'Content-Type': 'application/json' }
});
}


if (method === 'POST') {
const body = await req.json().catch(() => null);


if (!body) {
return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
status: 400,
headers: { 'Content-Type': 'application/json' }
});
}


const { taskName, dueDate, estimatedTime, priority } = body;


if (!taskName || !dueDate || !estimatedTime || !priority) {
return new Response(JSON.stringify({
success: false,
error: 'Missing required fields: taskName, dueDate, estimatedTime, priority'
}), {
status: 400,
headers: { 'Content-Type': 'application/json' }
});
}


const newItem = {
id: schedules.length + 1,
taskName,
dueDate,
estimatedTime,
priority
};


schedules.push(newItem);


return new Response(JSON.stringify({ success: true, data: newItem }), {
status: 201,
headers: { 'Content-Type': 'application/json' }
});
}


return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
status: 405,
headers: { 'Content-Type': 'application/json' }
});
}
