CREATE TABLE IF NOT EXISTS enquiries (
 id TEXT PRIMARY KEY NOT NULL,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 postcode TEXT NOT NULL,
 service TEXT NOT NULL,
 customer TEXT NOT NULL,
 message TEXT NOT NULL,
 created_at TEXT NOT NULL
);
