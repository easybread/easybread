# Database Schema Diagram

This diagram represents the database schema for the hiring/recruitment management system defined in `schema.ts`.

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar firstName
        varchar lastName
        userRole role
        uuid departmentId FK
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }
    
    departments {
        uuid id PK
        varchar name
        text description
        uuid managerId
        boolean isActive
        timestamp createdAt
    }
    
    jobPostings {
        uuid id PK
        varchar title
        text description
        text requirements
        text responsibilities
        uuid departmentId FK
        uuid hiringManagerId FK
        employmentType employmentType
        experienceLevel experienceLevel
        varchar location
        boolean isRemote
        decimal salaryMin
        decimal salaryMax
        jobStatus status
        integer openingsCount
        timestamp postedAt
        timestamp closesAt
        timestamp createdAt
        timestamp updatedAt
    }
    
    candidates {
        uuid id PK
        varchar email UK
        varchar firstName
        varchar lastName
        varchar phone
        text resumeUrl
        text linkedinUrl
        text portfolioUrl
        varchar currentPosition
        varchar currentCompany
        integer yearsOfExperience
        decimal expectedSalary
        varchar location
        boolean isOpenToRemote
        text notes
        timestamp createdAt
        timestamp updatedAt
    }
    
    applications {
        uuid id PK
        uuid candidateId FK
        uuid jobPostingId FK
        applicationStatus status
        text coverLetter
        text resumeUrl
        timestamp appliedAt
        uuid assignedToId FK
        uuid currentStageId FK
        integer rating
        text notes
        text rejectionReason
        timestamp createdAt
        timestamp updatedAt
    }
    
    interviewStages {
        uuid id PK
        uuid jobPostingId FK
        varchar name
        text description
        integer order
        interviewType interviewType
        integer durationMinutes
        boolean isRequired
        timestamp createdAt
    }
    
    interviews {
        uuid id PK
        uuid applicationId FK
        uuid stageId FK
        uuid interviewerId FK
        timestamp scheduledAt
        timestamp scheduledEndAt
        timestamp actualStartAt
        timestamp actualEndAt
        text location
        text meetingUrl
        interviewStatus status
        text feedback
        integer rating
        varchar recommendation
        text notes
        timestamp createdAt
        timestamp updatedAt
    }
    
    applicationStageHistory {
        uuid id PK
        uuid applicationId FK
        applicationStatus fromStatus
        applicationStatus toStatus
        uuid changedById FK
        text reason
        text notes
        timestamp changedAt
    }

    %% Relationships
    users ||--o{ departments : "manages"
    departments ||--o{ users : "contains"
    departments ||--o{ jobPostings : "has"
    users ||--o{ jobPostings : "manages"
    candidates ||--o{ applications : "applies"
    jobPostings ||--o{ applications : "receives"
    users ||--o{ applications : "assigned_to"
    interviewStages ||--o{ applications : "current_stage"
    jobPostings ||--o{ interviewStages : "defines"
    applications ||--o{ interviews : "scheduled_for"
    interviewStages ||--o{ interviews : "follows"
    users ||--o{ interviews : "conducts"
    applications ||--o{ applicationStageHistory : "tracks"
    users ||--o{ applicationStageHistory : "changed_by"
```

## Schema Overview

**Core Entities:**
- **users** - System users with roles (admin, recruiter, hiring manager, interviewer)
- **departments** - Organizational units
- **candidates** - Job applicants
- **jobPostings** - Available positions

**Process Entities:**
- **applications** - Links candidates to specific job postings
- **interviewStages** - Defines interview process steps for each job
- **interviews** - Scheduled interview sessions
- **applicationStageHistory** - Audit trail of application status changes

**Key Relationships:**
- Users belong to departments and can manage job postings
- Job postings are linked to departments and have defined interview stages
- Candidates submit applications for job postings
- Applications progress through interview stages with scheduled interviews
- All status changes are tracked in the history table

**Enums Used:**
- `jobStatus`: DRAFT, ACTIVE, PAUSED, CLOSED, CANCELLED
- `applicationStatus`: APPLIED, SCREENING, INTERVIEWING, OFFER, HIRED, REJECTED, WITHDRAWN
- `interviewType`: PHONE, VIDEO, ONSITE, TECHNICAL, CULTURAL
- `interviewStatus`: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
- `employmentType`: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, TEMPORARY
- `experienceLevel`: ENTRY, JUNIOR, MID, SENIOR, LEAD, EXECUTIVE
- `userRole`: ADMIN, RECRUITER, HIRING_MANAGER, INTERVIEWER 