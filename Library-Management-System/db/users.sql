CREATE DATABASE library;
CREATE TABLE users(
    user_id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) not NULL,
    password VARCHAR(100) NOT NULL,
    isadmin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT current_timestamp
);
ALTER TABLE users
add constraint email_unique Unique(email);