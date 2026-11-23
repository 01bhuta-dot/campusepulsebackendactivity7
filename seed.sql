WITH seed(title, category, description, status) AS (VALUES
    ('Eduroam Wi-Fi authentication failing in Engineering Block', 'Network', 'Students in Lecture Room E204 receive ''Unable to join network'' after entering valid portal credentials.', 'Pending'),
    ('Install MATLAB R2024b on Computer Lab 2 workstations', 'Software', 'Need Simulink and Signal Processing toolboxes activated across all 30 desktop PCs before Monday labs.', 'In progress'),
    ('Main Library Circulation Desk receipt printer jammed', 'Hardware', 'Thermal printer displays a flashing red error LED and refuses to feed paper rolls.', 'Completed'),
    ('Lecturer laptop HDMI output flickering on Hall A projector', 'Hardware', 'Wall-mounted HDMI port drops video signal every few minutes during presentations.', 'Pending'),
    ('Reset locked student portal account for registration', 'Account & Access', 'Student account locked after multiple password attempts; multi-factor reset required.', 'Completed'),
    ('Ethernet wall jack dead at Admin Office Desk 4', 'Network', 'No link light detected on desktop NIC when patched into port B-14; switch port check needed.', 'In progress'),
    ('PostgreSQL service failing to start on Lab Server 01', 'Software', 'Database students cannot connect to port 5432; service throws a configuration permission error.', 'Pending'),
    ('Replace faulty USB keyboards in Science Lab B', 'Lab Equipment', 'Workstations B07 and B11 have unresponsive Enter and Spacebar keys.', 'Completed')
)
INSERT INTO records (title, category, description, status)
SELECT title, category, description, status FROM seed
WHERE NOT EXISTS (SELECT 1 FROM seed_history WHERE name = 'campuspulse-it-support-v1');

INSERT INTO seed_history (name) VALUES ('campuspulse-it-support-v1') ON CONFLICT (name) DO NOTHING;
