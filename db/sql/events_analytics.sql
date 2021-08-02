DROP TABLE events_analytics;
CREATE TABLE events_analytics AS (

-- Create events table and calculate meeting duration & rank events by user, title and event_created_ts to dedupe
WITH events AS (

SELECT
*,
event_end_ts - event_start_ts AS meeting_duration,
RANK() OVER(PARTITION BY event_creator_email, event_summary, event_created_ts ORDER BY insertion_timestamp DESC) AS event_rank

FROM raw_cal_events

WHERE event_start_ts > current_timestamp - interval '8' day
AND event_start_ts < current_timestamp + interval '8' day
),

lag_events AS (

SELECT
*,
LEAD(event_end_ts) OVER(ORDER BY event_start_ts DESC) AS previous_event_end_time,
-- Calc event rank by day per user
ROW_NUMBER() OVER(PARTITION BY event_creator_email,event_start_ts::date ORDER BY event_start_ts ASC) AS daily_event_rank,
event_start_ts::date AS event_date,
-- Calc rank by day per user
DENSE_RANK() OVER(ORDER BY event_start_ts::date ASC) AS day_rank

FROM events

WHERE event_rank = 1
),

modify_events AS (

SELECT
*,
-- case statement to determine the time between the end of the last event and the start of the next diff
CASE
	WHEN daily_event_rank = 1 THEN NULL
	ELSE event_start_ts - previous_event_end_time
END AS time_between_end_of_last_and_start_of_next,
LEAD(day_rank) OVER(ORDER BY event_start_ts DESC) AS previous_day_rank

FROM lag_events

),

calc_cumulative AS (
-- Calculate the cumulative time of intervals between end of last meeting and next
SELECT *,
SUM(time_between_end_of_last_and_start_of_next) OVER(PARTITION BY event_creator_email, day_rank ORDER BY daily_event_rank ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_interval_time,
SUM(meeting_duration) OVER(PARTITION BY event_creator_email, day_rank ORDER BY daily_event_rank ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_meeting_time

FROM modify_events
),

all_columns AS (

SELECT
id,
status,
event_summary,
event_creator_email,
event_organizer_email,
insertion_timestamp,
event_created_ts,
event_updated_ts,
event_start_ts AS original_start_ts,

CASE
	-- If is first event of day return timestamp of the current event
	WHEN daily_event_rank = 1 THEN event_start_ts
	-- If it's the second event of day return timestamp of the end of the first event
	WHEN daily_event_rank = 2 AND day_rank = previous_day_rank THEN LEAD(event_end_ts) OVER(ORDER BY event_start_ts DESC)
	-- Otherwise as long as the event is in the same day set the start timestamp to the current start timestamp less the cumulative interval time
	WHEN day_rank = previous_day_rank THEN event_start_ts - cumulative_interval_time
	ELSE NULL
END AS new_start_ts,
event_end_ts AS original_end_ts,
-- Case logic here follows a similar pattern to the new_start_ts
CASE
	WHEN daily_event_rank = 1 THEN event_end_ts
	ELSE event_end_ts - cumulative_interval_time
END AS new_end_ts,
meeting_duration,
cumulative_interval_time,
daily_event_rank,
day_rank,
previous_day_rank,
event_date,
previous_event_end_time,
time_between_end_of_last_and_start_of_next,
cumulative_meeting_time,
-- Calculate max time saved in a day
CASE
	WHEN MAX(cumulative_interval_time) OVER(PARTITION BY event_organizer_email, day_rank) = cumulative_interval_time THEN MAX(cumulative_interval_time) OVER(PARTITION BY event_organizer_email, day_rank)
ELSE NULL
END AS recovered_focus_time

FROM calc_cumulative
)

SELECT
*,
current_timestamp AS table_last_updated

FROM all_columns
)
