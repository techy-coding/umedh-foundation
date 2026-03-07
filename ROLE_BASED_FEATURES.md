# Role-Based Features Implementation Plan

## 📋 Overview

This document outlines the implementation plan for comprehensive role-based features for the Umedh Foundation website.

## 🎯 Implementation Status

### ✅ Completed
- Visitor (Public User) features
- Basic admin authentication
- Program management
- Event management
- Volunteer registration
- Donation system
- Blog system

### 🚧 In Progress
- Beneficiary application system
- Donor dashboard
- Volunteer dashboard

### 📝 Planned
- Enhanced admin features
- User registration/login
- Receipt generation
- Role management
- Advanced features (AI, live feed, social login)

## 👤 Role 1: Visitor (Public User)

### ✅ Implemented Features
- Home page with mission & vision
- About Us page
- Programs/Campaigns listing
- Donation page (one-time & recurring)
- Volunteer registration form
- Contact form
- Blog/News section
- Multilingual support (English, Hindi, Marathi)

### 📝 Additional Features Needed
- Beneficiary application form (NEW)
- Campaign filtering by category
- Donor list display (optional)
- Social media sharing
- Search functionality

## 💰 Role 2: Donor

### 📝 Features to Implement

#### Donor Dashboard (`/donor/dashboard`)
- **Total Donations Made** - Sum of all donations ✅
- **Active Recurring Donations** - List of active subscriptions ✅
- **Recent Donations** - Last 5 donations ✅
- **Quick Actions** - Donate again, Update profile ✅
- **Receipt Export** - Download CSV of all donations ✅

The donor dashboard page now exists with summary cards, sponsored children list, donation history table and a link to edit profile. A dedicated `/donor/profile` endpoint and form were added.

> Donors can also generate individual receipts (PUT `/api/donor/receipts/:id`).

#### Donation History (`/donor/donations`)
  - **Complete History** - All donations with filters
  - **Payment Details** - Payment ID, date, amount
  - **Campaign Name** - Which program was supported
  - **Status** - Completed, Pending, Failed
  - **Download Receipt** - PDF download for each donation (UI TBD)
  - **Sponsorships** - View and create child sponsorships via `/donor/sponsorships` (admin endpoint under the hood)

#### Profile Management (`/donor/profile`)
- **Personal Details** - Name, email, profile image, address ✅
- **Payment Method** - Store basic payment notes ✅
- **Update Information** - Edit profile via form ✅
- **Manage Recurring Donations** - Cancel/modify subscriptions
- **Tax Receipts** - Download annual tax receipts

#### Notification System
- Email confirmation on donation
- SMS confirmation (optional)
- Campaign milestone updates
- Receipt delivery notifications

## 🙋 Role 3: Volunteer

### 📝 Features to Implement

#### Volunteer Dashboard (`/volunteer/dashboard`)
- **Assigned Tasks** - Current tasks and assignments ✅
- **Task Status** - Pending, In Progress, Completed ✅
- **Upcoming Events** - Events volunteer is registered for ✅
- **Task Completion Rate** - Statistics ✅

Dashboard shows tasks from API and allows marking as completed through mutation. UI includes summary cards and upcoming event lists.

#### Event Management (`/volunteer/events`)
- **Join Events** - Register for upcoming events ✅
- **My Events** - Events volunteer is attending (with details) ✅
- **Event Schedule** - Calendar view showing event dates; filter list by day ✅
- **Attendance Tracking** - Mark attendance on registered events ✅

> Backend supports `/api/volunteer/my-events` returning registration+event data and
> `PUT /api/volunteer/my-events/:id/attendance` to toggle attendance.

> Frontend uses `react-day-picker` for calendar highlighting and filtering.

#### Communication (`/volunteer/messages`)
- **Message Admin** - Send messages to admin
- **Group Announcements** - View announcements
- **Notifications** - Task assignments, event reminders

#### Profile (`/volunteer/profile`)
- **Volunteer Information** - Skills, availability
- **Update Profile** - Edit details
- **Resume Management** - Upload/update resume

## 🏥 Role 4: Beneficiary

### 📝 Features to Implement

#### Application Dashboard (`/beneficiary/dashboard`)
- Lists all applications submitted by the logged-in beneficiary
- Allows user to click through to view full application details

- **Submitted Applications** - List of all applications
- **Application Status** - Pending, Under Review, Approved, Rejected
- **Required Documents** - Document checklist
- **Application Details** - Full application information

#### Application Form (`/beneficiary/apply`)
- Completed with validation and document uploads (front‑end stubbed)

- **Application Type** - Financial, Medical, Education
- **Personal Information** - Name, email, phone, address
- **Description** - Detailed explanation of need
- **Document Upload** - Upload required documents
- **Submit Application** - Submit for review

#### Support Tracking (`/beneficiary/support`)
- Shows only approved applications with funding amounts and statuses

- **Fund Release Details** - When funds were released
- **Case Updates** - Status updates from admin
- **Communication** - Messages from admin
- **Support History** - Complete history of support received

## 🛠 Role 5: Admin (Super Admin)

### ✅ Implemented Features
- Admin dashboard with statistics (enhanced with charts)
- Donation management
- Volunteer management
- Event management
- Program management
- Blog management
- Children management CRUD endpoints & UI
- Donor profile API & UI
- Dashboard support for donors and volunteers

### 📝 Additional Features Needed

#### Beneficiary Management (`/admin/beneficiaries`)
- **Review Applications** - Admin dashboard now lists all beneficiary applications with inline controls for changing status and notes
- **Funding Update** - Administrators can set or modify funding amount and status directly from the list
- **UI Added** - The admin sidebar includes a new "Beneficiaries" section


#### Enhanced Donation Management
- **Refund Management** - Process refunds
- **Export Data** - Excel/CSV export
- **Receipt Generation** - Generate receipts manually (admin page button added)
- **Donation Analytics** - Advanced analytics
- **Sponsorship Overview** - Admin page lists sponsorships and allows status changes

#### Content Management System (`/admin/content`)
- **Homepage Content** - Edit homepage sections
- **Banner Management** - Upload/edit banners
- **Multilingual Content** - Edit content per language
- **SEO Management** - Meta tags, descriptions

#### Reports & Analytics (`/admin/reports`)
- **Donation Trends** - Charts and graphs
- **Campaign Performance** - Program analytics
- **Donor Demographics** - Donor insights
- **Export PDF Reports** - Generate reports
- **Volunteer Statistics** - Volunteer analytics
- **Beneficiary Statistics** - Beneficiary insights

#### Role & Permission Management (`/admin/users`)
- **User List** - View all users
- **Create Sub-Admins** - Add new admin users
- **Assign Permissions** - Set role permissions
- **Role Management** - Manage user roles

## 🔧 Technical Implementation

### Database Schema Updates

#### New Tables
1. **beneficiary_applications** - Beneficiary application data
2. **volunteer_tasks** - Volunteer task assignments
3. **donation_receipts** - Receipt generation tracking (added to donations table)

#### Updated Tables
1. **donations** - Added `userId`, `receiptGenerated`, `receiptUrl`
2. **volunteers** - Added `userId`, `approvedAt`
3. **users** - Already supports roles (visitor, donor, volunteer, admin, beneficiary)

### API Endpoints to Add

#### Donor Endpoints
- `GET /api/donor/dashboard` - Dashboard data
- `GET /api/donor/donations` - Donation history
- `GET /api/donor/receipts/:id` - Download receipt
- `PUT /api/donor/profile` - Update profile
- `GET /api/donor/recurring` - Recurring donations

#### Volunteer Endpoints
- `GET /api/volunteer/dashboard` - Dashboard data
- `GET /api/volunteer/tasks` - Assigned tasks
- `PUT /api/volunteer/tasks/:id/complete` - Complete task
- `GET /api/volunteer/events` - Volunteer events
- `POST /api/volunteer/messages` - Send message

#### Beneficiary Endpoints
- `POST /api/beneficiary/apply` - Submit application
- `GET /api/beneficiary/applications` - List applications
- `GET /api/beneficiary/applications/:id` - Application details
- `GET /api/beneficiary/support` - Support tracking

#### Admin Endpoints
- `GET /api/admin/beneficiaries` - List applications
- `PUT /api/admin/beneficiaries/:id/review` - Review application
- `PUT /api/admin/beneficiaries/:id/funding` - Update funding
- `GET /api/admin/reports` - Generate reports
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id/role` - Update role

### Frontend Routes to Add

#### Donor Routes
- `/donor/dashboard` - Donor dashboard
- `/donor/donations` - Donation history
- `/donor/profile` - Profile management
- `/donor/receipts` - Receipt downloads

#### Volunteer Routes
- `/volunteer/dashboard` - Volunteer dashboard
- `/volunteer/tasks` - Task management
- `/volunteer/events` - Event management
- `/volunteer/messages` - Communication
- `/volunteer/profile` - Profile

#### Beneficiary Routes
- `/beneficiary/dashboard` - Application dashboard
- `/beneficiary/apply` - Application form
- `/beneficiary/applications/:id` - Application details
- `/beneficiary/support` - Support tracking

#### Admin Routes
- `/admin/beneficiaries` - Beneficiary management
- `/admin/reports` - Reports & analytics
- `/admin/content` - CMS
- `/admin/users` - User & role management

## 🚀 Implementation Priority

### Phase 1 (High Priority)
1. ✅ Beneficiary application schema
2. 🔄 Donor dashboard & donation history
3. 🔄 Volunteer dashboard & tasks
4. 🔄 User registration/login

### Phase 2 (Medium Priority)
5. Beneficiary application system
6. Receipt generation
7. Enhanced admin features
8. Profile management

### Phase 3 (Low Priority)
9. Role & permission management
10. Reports & analytics
11. CMS features
12. Advanced features (AI, live feed, social login)

## 📝 Next Steps

1. Update database schema with new tables
2. Create API endpoints for each role
3. Build frontend dashboards
4. Implement authentication for donors/volunteers
5. Add receipt generation
6. Enhance admin features
