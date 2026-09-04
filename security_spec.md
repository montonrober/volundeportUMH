# Security Specification

## Data Invariants
1. `events`: Only admins can create, update, or delete events. Anyone authenticated can read them.
2. `submissions`:
   - A user can only create a submission if their `userId` matches the auth UID.
   - A user can only read their own submissions.
   - Only admins can read all submissions, or update/delete submissions.
3. `config`: Only admins can update the config. Anyone authenticated can read it.
4. `admins`: Only admins can read/write the admins collection.

## Dirty Dozen Payloads
1. Unauthorized user creating an event.
2. User spoofing `userId` when creating a submission.
3. User attempting to read another user's submission.
4. User attempting to update their own submission (status to 'emitido').
5. User attempting to update the config.
6. User attempting to create an admin.
7. Admin updating submission with invalid type (status = true).
8. Admin updating event with > 100 char name.
9. Missing required fields on submission create.
10. Unauthenticated user reading events.
11. Admin creating a submission for another user (wait, maybe admin can? Better to restrict to user).
12. User creating a submission with negative hoursApproved.
