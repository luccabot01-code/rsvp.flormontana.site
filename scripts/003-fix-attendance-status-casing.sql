-- Fix attendance_status casing to match database schema
-- Convert capitalized values to lowercase with underscore

UPDATE rsvps 
SET attendance_status = 'attending' 
WHERE attendance_status = 'Attending';

UPDATE rsvps 
SET attendance_status = 'not_attending' 
WHERE attendance_status = 'Not Attending' OR attendance_status = 'not attending';

-- Update events table to use correct lowercase values
-- Cast JSONB to text[] to fix the && operator error
UPDATE events 
SET custom_attendance_options = '["attending", "not_attending"]'::jsonb
WHERE (custom_attendance_options->>0 = 'Attending' 
   OR custom_attendance_options->>0 = 'Not Attending'
   OR custom_attendance_options->>1 = 'Attending' 
   OR custom_attendance_options->>1 = 'Not Attending');
