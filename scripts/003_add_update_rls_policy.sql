-- Add RLS policy for hosts to update their events
-- This is needed for soft deletes (UPDATE is_active = false)
CREATE POLICY "Host can update their events (UPDATE)" 
ON public.events 
FOR UPDATE 
USING (host_email IS NOT NULL AND host_email != '');
