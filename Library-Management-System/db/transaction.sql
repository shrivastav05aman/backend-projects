CREATE TABLE transactions(
    transaction_id BIGSERIAL PRIMARY KEY NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    return_date DATE,
    user_id BIGSERIAL REFERENCES users(user_id),
    book_id BIGSERIAL REFERENCES books(book_id),
    status VARCHAR(100) DEFAULT 'pending'
);