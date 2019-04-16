-- psql -U secilreel -d spaced-repetition -f ./migrations/004.undo.create_user_words_table.sql
DROP TABLE IF EXISTS "user_words";