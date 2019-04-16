DROP TABLE IF EXISTS "user_words";

CREATE TABLE "user_words" (
  "user_id" INTEGER
        REFERENCES "user"(id) ON DELETE SET NULL,
  "word_id" INTEGER
        REFERENCES "word"(id) ON DELETE CASCADE,
  "memory_value" SMALLINT DEFAULT 1,
  "correct_count" SMALLINT DEFAULT 0,
  "incorrect_count" SMALLINT DEFAULT 0,
  "next" INTEGER REFERENCES "word"(id)
    ON DELETE SET NULL   
);
