CREATE TABLE genre(
    genre_id BIGSERIAL PRIMARY KEY NOT NULL,
    genre VARCHAR(50) NOT NULL
);
CREATE TABLE books (
    book_id BIGSERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(200) NOT NULL,
    price NUMERIC NOT NULL,
    author VARCHAR(100) not NULL,
    published_date DATE NOT NULL,
    rating NUMERIC NOT NULL,
    genre_id BIGSERIAL REFERENCES genre(genre_id)
);
ALTER TABLE genre
add CONSTRAINT name_uniq UNIQUE(genre);
ALTER TABLE books
add COLUMN status VARCHAR(10) NOT NULL;
ALTER TABLE books
ALTER COLUMN status
set DEFAULT 'available';