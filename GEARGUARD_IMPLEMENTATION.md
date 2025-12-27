# GearGuard: Maintenance Tracker Module - Implementation Guide

## Overview
GearGuard is a comprehensive maintenance management system for tracking company assets and managing maintenance requests. The system connects Equipment, Teams, and Requests to streamline maintenance workflows.

## Features Implemented

### 1. Equipment Management
- **CRUD Operations**: Create, read, update, delete equipment
- **Search & Filtering**: Search by name, serial number, location
- **Grouping**: Group equipment by department or category
- **Smart Buttons**: View maintenance requests for specific equipment with open request count
- **Status Tracking**: Mark equipment as Active or Scrap
- **Auto-Team Assignment**: Equipment is automatically linked to maintenance teams
- **Key Fields**:
  - Equipment Name & Serial Number (unique)
  - Purchase Date & Warranty Information
  - Location & Department
  - Assigned Team & Technician
  - Category (Electrical, Mechanical, IT, Other)

**Endpoint**: `GET /api/equipment`
**Features**:
- Search by name, serialNumber, location
- Filter by category, department, status
- Sort by recent or name
- Get maintenance requests: `GET /api/equipment/:id/maintenance`
- Mark as scrap: `PUT /api/equipment/:id/scrap`

### 2. Maintenance Team Management
- **CRUD Operations**: Create, read, update, delete teams
- **Member Management**: Add/remove team members
- **Team Assignment**: Assign teams to equipment
- **View Analytics**: See request count per team
- **Key Fields**:
  - Team Name (unique)
  - Team Members List
  - Request Count

**Endpoint**: `GET /api/team`
**Features**:
- Add members: `POST /api/team/:id/members`
- Remove members: `DELETE /api/team/:id/members/:memberId`
- Manage team members: `GET /api/team/:id/members`

### 3. Maintenance Request Management
**Two Types of Workflows**:

#### Flow 1: The Breakdown (Corrective Maintenance)
1. Any user creates a request for broken equipment
2. System auto-fills:
   - Equipment category
   - Assigned maintenance team (from equipment record)
3. Request starts in "New" stage
4. Manager/Technician assigns themselves
5. Status moves to "In Progress"
6. Upon completion, technician records hours and moves to "Repaired"

#### Flow 2: The Routine Checkup (Preventive Maintenance)
1. Manager creates preventive maintenance request
2. Set scheduled date (e.g., Next Monday)
3. Request appears on Calendar View for team visibility
4. Team executes maintenance on scheduled date

**Request States**: New → In Progress → Repaired/Scrap
**Key Fields**:
- Subject & Description
- Equipment & Team (auto-filled)
- Type (Corrective/Preventive)
- Status (New, In Progress, Repaired, Scrap)
- Priority (Low, Medium, High, Critical)
- Scheduled Date (for preventive)
- Duration (hours spent)
- Assigned Technician
- Created By
- Overdue flag

**Endpoints**:
- `POST /api/request` - Create request with auto-fill logic
- `GET /api/request` - Get all requests with filtering
- `PUT /api/request/:id/assign` - Assign to technician
- `PUT /api/request/:id/status` - Change status
- `GET /api/request/team/:teamId` - Get team's requests
- `GET /api/request/preventive/calendar` - Get preventive requests for calendar
- `GET /api/request/analytics/dashboard` - Get analytics data

### 4. User Interface & Views

#### A. Equipment Page
- **List View**: Display all equipment with cards
- **Search**: Real-time search functionality
- **Grouping**: Sort by department or category
- **Smart Button**: "Maintenance" button shows open requests for equipment
- **Badge**: Display count of open requests
- **Actions**: Edit, Delete, Mark as Scrap
- **Form**: Inline form for adding/editing equipment

#### B. Request Kanban Board
- **4 Columns**: New, In Progress, Repaired, Scrap
- **Drag & Drop**: Move cards between columns to change status
- **Visual Indicators**:
  - Technician avatar/name
  - Red indicator for overdue requests
  - Color coding by priority (Critical/High/Medium/Low)
- **Type Filtering**: Show only Corrective or Preventive
- **Quick Actions**: Assign to self, view details

#### C. Calendar View
- **Monthly Display**: Interactive calendar
- **Preventive Requests**: Shows all preventive maintenance
- **Click to Schedule**: Click any date to schedule new maintenance
- **Request Preview**: Shows request count per day
- **Upcoming List**: Display next 6 scheduled maintenance items

#### D. Teams Management
- **Team List**: Display all teams with member count
- **Add Team**: Create new maintenance teams
- **Manage Members**: Add/remove team members
- **Member Details**: Show team members with roles
- **Member Management Modal**: Easy interface for team composition

#### E. Dashboard
- **Overview**: Key metrics and statistics
- **Recent Requests**: Latest maintenance requests
- **Quick Actions**: Create request, view calendar, manage equipment

### 5. Business Logic Implementation

#### Auto-Fill Logic
When creating a request:
1. User selects equipment
2. System automatically retrieves:
   - Equipment category
   - Assigned maintenance team
   - Equipment status
3. Populates these fields in the request

#### Scrap Logic
When equipment/request marked as scrap:
1. Equipment status changes to "Scrap"
2. Logical flag set indicating equipment unusable
3. No longer available for new requests
4. Historical record maintained

#### Overdue Tracking
- System calculates if request date has passed
- Sets `isOverdue` flag
- Visual indicator (red) on request cards
- Included in analytics reports

#### Analytics/Reports
**Endpoints**:
- Requests by Team
- Requests by Status
- Requests by Equipment Category
- Overdue Request Count
- Team Performance Metrics

## API Endpoints Summary

### Equipment
```
POST   /api/equipment                    - Create
GET    /api/equipment                    - Get all (with filters)
GET    /api/equipment/:id                - Get one
PUT    /api/equipment/:id                - Update
DELETE /api/equipment/:id                - Delete
GET    /api/equipment/:id/maintenance    - Get maintenance requests (Smart button)
PUT    /api/equipment/:id/scrap          - Mark as scrap
GET    /api/equipment/department/:dept   - Filter by department
GET    /api/equipment/employee/:empId    - Filter by employee
```

### Request
```
POST   /api/request                      - Create (with auto-fill)
GET    /api/request                      - Get all (with filters)
GET    /api/request/:id                  - Get one
PUT    /api/request/:id                  - Update
DELETE /api/request/:id                  - Delete
PUT    /api/request/:id/assign           - Assign to technician
PUT    /api/request/:id/status           - Change status
GET    /api/request/team/:teamId         - Get by team
GET    /api/request/preventive/calendar  - Get preventive for calendar
GET    /api/request/analytics/dashboard  - Get analytics
```

### Team
```
POST   /api/team                         - Create
GET    /api/team                         - Get all
GET    /api/team/:id                     - Get one
PUT    /api/team/:id                     - Update
DELETE /api/team/:id                     - Delete
GET    /api/team/:id/members             - Get members
POST   /api/team/:id/members             - Add member
DELETE /api/team/:id/members/:memberId   - Remove member
```

## Database Models

### Equipment
```javascript
{
  name: String (required),
  serialNumber: String (unique, required),
  category: String (Electrical/Mechanical/IT/Other),
  location: String,
  department: String,
  assignedTo: ObjectId (User),
  assignedTeam: ObjectId (Team),
  purchaseDate: Date,
  warranty: String,
  status: String (Active/Scrap),
  notes: String,
  timestamps: true
}
```

### Request
```javascript
{
  subject: String (required),
  description: String,
  equipment: ObjectId (Equipment, required),
  team: ObjectId (Team),
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User, required),
  type: String (Corrective/Preventive),
  status: String (New/In Progress/Repaired/Scrap),
  priority: String (Low/Medium/High/Critical),
  scheduledDate: Date,
  duration: Number,
  isOverdue: Boolean,
  notes: String,
  timestamps: true
}
```

### Team
```javascript
{
  name: String (unique, required),
  members: [ObjectId (User)],
  timestamps: true
}
```

## Frontend Components

### Pages
- `Equipment.jsx` - Full equipment management
- `Requests.jsx` - Kanban board with drag-drop
- `Calendar.jsx` - Preventive maintenance calendar
- `Teams.jsx` - Team management
- `Dashboard.jsx` - Overview and quick actions

### Services
- `equipment.service.js` - Equipment API calls
- `request.service.js` - Request API calls
- `team.service.js` - Team API calls
- `auth.service.js` - Authentication

### Components
- `EquipmentCard.jsx` - Equipment card display
- `RequestCard.jsx` - Request card with drag-drop
- Navigation, Layout, common components

## Usage Instructions

### For Admin/Manager
1. **Setup**: Create teams and assign members
2. **Equipment**: Register all company assets
3. **Preventive**: Schedule routine maintenance on calendar
4. **Monitor**: Track request status on Kanban board
5. **Report**: View analytics for team performance

### For Technician
1. **Dashboard**: Check assigned requests and calendar
2. **Request Board**: Pick up "New" requests
3. **Update Status**: Drag cards as you work
4. **Log Hours**: Record time spent on repairs
5. **Complete**: Move to "Repaired" when done

## Key Features Highlights

✅ **Smart Auto-Fill**: Equipment selection auto-populates team  
✅ **Drag-Drop Kanban**: Intuitive request status management  
✅ **Calendar Scheduling**: Visual preventive maintenance planning  
✅ **Group By**: Filter equipment by department/category  
✅ **Smart Buttons**: Equipment maintenance request overview  
✅ **Overdue Tracking**: Visual indicators for delayed requests  
✅ **Priority Levels**: Critical, High, Medium, Low  
✅ **Team Management**: Flexible team composition  
✅ **Analytics**: Requests by team, category, status  
✅ **Scrap Logic**: Mark equipment as unusable with audit trail  
✅ **Search**: Real-time equipment and request search  
✅ **Responsive Design**: Works on desktop and mobile  

## Testing Checklist

- [x] Equipment CRUD operations
- [x] Equipment smart button (maintenance requests)
- [x] Request auto-fill (team selection)
- [x] Kanban drag-drop status change
- [x] Preventive request calendar
- [x] Team member management
- [x] Overdue detection
- [x] Scrap logic implementation
- [x] Search and filter functionality
- [x] Group by department/category
- [x] Priority color coding
- [x] Analytics data aggregation

## Next Steps (Optional Enhancements)

1. **Advanced Analytics**: Pivot tables with Charts.js
2. **Notifications**: Real-time alerts for overdue requests
3. **Export**: CSV/PDF export of reports
4. **Scheduling**: Automated preventive maintenance suggestions
5. **Attachments**: Upload documents/photos with requests
6. **Comments**: Communication thread on requests
7. **Mobile App**: React Native version
8. **Audit Log**: Track all changes to equipment/requests

---

**Version**: 1.0  
**Last Updated**: December 2025  
**Status**: Fully Implemented ✅
