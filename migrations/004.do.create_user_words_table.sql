DROP TABLE IF EXISTS "user_words";

CREATE TABLE "user_words" (
  id SERIAL PRIMARY KEY, 
  "user_id" INTEGER
        REFERENCES "user"(id) ON DELETE SET NULL,
  "word_id" INTEGER
        REFERENCES "word"(id) ON DELETE CASCADE,
  "memory_value" SMALLINT
        REFERENCES "word"(memory_value) ON DELETE CASCADE,
  "correct_count" SMALLINT
        REFERENCES "word"(correct_count) ON DELETE CASCADE,
  "incorrect_count" SMALLINT
        REFERENCES "word"(incorrect_count) ON DELETE CASCADE    
);
