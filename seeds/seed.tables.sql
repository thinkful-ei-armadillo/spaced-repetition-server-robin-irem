
BEGIN;

TRUNCATE
  "user_words",
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Spanish', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'bienvenido', 'welcome', 2),
  (2, 1, 'hola', 'hello', 3),
  (3, 1, 'casa', 'house', 4),
  (4, 1, 'desarrollador', 'developer', 5),
  (5, 1, 'adios', 'goodbye', 6),
  (6, 1, 'increible', 'amazing', 7),
  (7, 1, 'perro', 'dog', 8),
  (8, 1, 'gato', 'cat', null);

UPDATE "language" SET head = 1 WHERE id = 1;

SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
