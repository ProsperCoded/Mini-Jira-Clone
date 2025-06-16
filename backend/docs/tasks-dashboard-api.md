# Tasks Dashboard API

## Dashboard Statistics Endpoint

### GET /api/tasks/dashboard

Retrieves dashboard statistics and important tasks for the authenticated user.

#### Query Parameters

| Parameter             | Type   | Default | Description                                |
| --------------------- | ------ | ------- | ------------------------------------------ |
| `importantTasksLimit` | number | 5       | Number of important tasks to return (1-20) |

#### Response

```typescript
{
  data: {
    totalTasks: number;        // Total tasks assigned to user
    completedTasks: number;    // Completed tasks count
    activeTeams: number;       // Number of teams user is member of
    importantTasks: TaskResponse[]; // High priority pending tasks
  },
  message: string;
  success: boolean;
}
```

#### Important Tasks Logic

The important tasks are filtered by:

- **Assignee**: Only tasks assigned to the current user
- **Status**: Only TODO and IN_PROGRESS tasks
- **Teams**: Only from teams the user is a member of
- **Ordering**: Sorted by priority (HIGH first), then by order (ASC)
- **Limit**: Configurable via query parameter (max 20, default 5)

#### Example Request

```bash
GET /api/tasks/dashboard?importantTasksLimit=10
Authorization: Bearer {jwt-token}
```

#### Example Response

```json
{
  "data": {
    "totalTasks": 15,
    "completedTasks": 8,
    "activeTeams": 3,
    "importantTasks": [
      {
        "id": "task-uuid",
        "title": "Fix critical bug",
        "description": "Priority bug fix needed",
        "priority": "HIGH",
        "status": "TODO",
        "order": 1,
        "dueDate": "2024-01-15T10:00:00Z",
        "createdAt": "2024-01-10T09:00:00Z",
        "updatedAt": "2024-01-10T09:00:00Z",
        "creator": {
          "id": "user-uuid",
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe"
        },
        "assignee": {
          "id": "user-uuid",
          "username": "jane_smith",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "team": {
          "id": "team-uuid",
          "name": "Development Team"
        }
      }
    ]
  },
  "message": "Dashboard statistics retrieved successfully",
  "success": true
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing JWT token
- **400 Bad Request**: Invalid query parameters

#### Notes

- If user is not a member of any team, returns zero stats and empty tasks array
- Important tasks are sorted by priority (HIGH > MEDIUM > LOW) then by order
- Only tasks from teams where user is a member are included
- Completed tasks count includes only tasks with status 'DONE'
