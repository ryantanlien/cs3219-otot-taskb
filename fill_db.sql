\connect matchdb
create table waiting(uuid varchar NOT NULL PRIMARY KEY, difficulty varchar NOT NULL, time time without time zone NOT NULL);