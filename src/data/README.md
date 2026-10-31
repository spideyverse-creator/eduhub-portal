# Mock Data Structure

## Users
- `faculty1` / `faculty123` → Dr. Anjali Sharma (Faculty)
- `faculty2` / `faculty123` → Prof. Rajesh Verma (Faculty)
- `student1` / `student123` → Rahul Kumar (Student)
- `student2` / `student123` → Priya Singh (Student)

## Subjects
Har subject ka `facultyId` hai jo us faculty se linked hai.

## Resources
- `category`: 'notes' | 'assignments' | 'lab_manual'
- `fileData`: Base64 (null = demo file, no actual PDF)
- `uploadedById`: kis faculty ne upload kiya

## Announcements
- `urgent`: true → amber border dikhega
- `authorId`: kis faculty ne post kiya