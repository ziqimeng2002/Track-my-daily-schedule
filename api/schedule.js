# `api/Schedule.js`

```javascript
let schedules = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: schedules });
  }

  if (req.method === 'POST') {
    const { taskName, dueDate, estimatedTime, priority } = req.body;

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
```

---

# `package.json`

```json
{
  "name": "schedule-tracker-api",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "start": "vercel dev"
  },
  "dependencies": {}
}
```

---

# `vercel.json`

```json
{
  "version": 2,
  "functions": {
    "api/Schedule.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

---

# `index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Schedule Tracker API</title>
</head>
<body>
  <h1>Schedule Tracker API</h1>
  <p>This API is deployed on Vercel and supports GET and POST requests at <code>/api/Schedule</code>.</p>
</body>
</html>
```

    });
  }
};
