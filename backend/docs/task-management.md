# Task Management System API Documentation

## Overview

The Task Management System provides comprehensive CRUD operations for tasks with advanced features including drag-and-drop reordering, Kanban-style status management, sophisticated filtering, and search capabilities.

## Features

- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Kanban Board Support**: Drag-and-drop reordering with status changes
- **Advanced Filtering**: Filter by status, priority, assignee, creator, team, and date ranges
- **Search Functionality**: Search tasks by title and description
- **Permission System**: Role-based access control for task operations
- **Task Statistics**: Comprehensive analytics for team performance
- **Order Management**: Custom ordering for tasks within each status column

## Database Schema Updates

### Task Model Extensions

```prisma
model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  priority    TaskPriority @default(MEDIUM)
  status      TaskStatus   @default(TODO)
  order       Int          @default(0)      // NEW: For drag-and-drop ordering
  dueDate     DateTime?                     // NEW: Task due dates
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Relationships remain the same
  teamId      String
  team        Team         @relation(fields: [teamId], references: [id], onDelete: Cascade)
  creatorId   String
  creator     User         @relation("TaskCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  assigneeId  String?
  assignee    User?        @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)

  @@map("tasks")
}
```

## API Endpoints

### 1. Create Task

- **Endpoint**: `POST /tasks`
- **Description**: Creates a new task in the specified team
- **Permissions**: Team members only
- **Body**:

```typescript
{
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeId?: string;
  dueDate?: string; // ISO date string
  teamId: string;
}
```

### 2. Get Tasks (with Advanced Filtering)

- **Endpoint**: `GET /tasks`
- **Description**: Retrieves tasks with comprehensive filtering and pagination
- **Permissions**: Returns tasks from teams user is a member of
- **Query Parameters**:

```typescript
{
  page?: number;          // Default: 1
  limit?: number;         // Default: 20, Max: 100
  search?: string;        // Search in title and description
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId?: string;    // Filter by specific assignee
  creatorId?: string;     // Filter by task creator
  teamId?: string;        // Filter by specific team
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate' | 'order';
  sortOrder?: 'asc' | 'desc';
  dueFrom?: string;       // ISO date string
  dueTo?: string;         // ISO date string
}
```

### 3. Get Task by ID

- **Endpoint**: `GET /tasks/:id`
- **Description**: Retrieves a specific task with full details
- **Permissions**: Team members only

### 4. Update Task

- **Endpoint**: `PUT /tasks/:id`
- **Description**: Updates task properties
- **Permissions**: Task creator, assignee, or team admin
- **Body**:

```typescript
{
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeId?: string;
  order?: number;
  dueDate?: string; // ISO date string
}
```

### 5. Reorder Task (Drag & Drop)

- **Endpoint**: `PUT /tasks/:id/reorder`
- **Description**: Updates task order and optionally status for drag-and-drop functionality
- **Permissions**: Task creator, assignee, or team admin
- **Body**:

```typescript
{
  newOrder: number;
  newStatus?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}
```

### 6. Delete Task

- **Endpoint**: `DELETE /tasks/:id`
- **Description**: Deletes a task
- **Permissions**: Task creator or team admin

### 7. Get Task Statistics

- **Endpoint**: `GET /tasks/stats/:teamId`
- **Description**: Returns comprehensive task statistics for a team
- **Permissions**: Team members only
- **Response**:

```typescript
{
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
  highPriority: number;
  myTasks: number;
}
```

## Response Format

All endpoints return responses in the standardized format:

```typescript
{
  success: boolean;
  message: string;
  data: any;
  statusCode: number;
}
```

### Task Response Object

```typescript
{
  id: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  order: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  teamId: string;
  team: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  assignee?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}
```

## Permission System

### Task Creation

- Any team member can create tasks

### Task Modification

- Task creator can edit all properties
- Task assignee can edit status and order
- Team admin can edit all properties
- Other team members have read-only access

### Task Deletion

- Task creator can delete
- Team admin can delete
- Other users cannot delete

## Usage Examples

### Creating a Task

```bash
curl -X POST "/tasks" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system",
    "priority": "HIGH",
    "teamId": "team-123",
    "assigneeId": "user-456",
    "dueDate": "2024-02-15T09:00:00.000Z"
  }'
```

### Filtering Tasks

```bash
# Get high priority tasks assigned to specific user
curl "/tasks?priority=HIGH&assigneeId=user-456&teamId=team-123"

# Search for tasks with "auth" in title/description
curl "/tasks?search=auth&teamId=team-123"

# Get overdue tasks
curl "/tasks?dueTo=2024-01-01T00:00:00.000Z&status=TODO,IN_PROGRESS"
```

### Drag and Drop Reordering

```bash
curl -X PUT "/tasks/task-123/reorder" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newOrder": 5,
    "newStatus": "IN_PROGRESS"
  }'
```

## Integration Notes

- The system automatically manages task ordering within each status column
- When creating tasks, they are automatically assigned the next available order number
- The reorder endpoint supports both same-column reordering and cross-column moves
- All operations include proper permission checks and team membership validation
- Task statistics are calculated in real-time for accurate reporting

## Error Handling

Common error responses:

- `400 Bad Request`: Invalid input data or assignee not in team
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions or not a team member
- `404 Not Found`: Task or team not found
- `422 Unprocessable Entity`: Validation errors in request body
