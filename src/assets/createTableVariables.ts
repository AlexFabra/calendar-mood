export const createTags = `
CREATE TABLE IF NOT EXISTS "tags" (
"id"INTEGER,
"name"TEXT,
"color"TEXT,
PRIMARY KEY("id" AUTOINCREMENT)
);
`;

export const createUserTags = `
CREATE TABLE IF NOT EXISTS "user_tags"  (
"id" INTEGER,
"tag1" TEXT,
"tag2" TEXT,
"tag3" TEXT,
"tag4" TEXT,
"tag5" TEXT,
PRIMARY KEY("id" AUTOINCREMENT)
);
`
export const createForm =
  `
CREATE TABLE IF NOT EXISTS "form" (
"id" INTEGER,
"question1" TEXT,
"question2" TEXT,
"question3" TEXT,
"question4" TEXT,
"question5" TEXT,
PRIMARY KEY("id" AUTOINCREMENT)
);
`

export const createFormAnswers = `
CREATE TABLE IF NOT EXISTS "form_answers" (
"id" INTEGER,
"date" TEXT,
"form_id" INTEGER,
"user_tags_id" INTEGER,
"answer1" TEXT,
"answer2" TEXT,
"answer3" TEXT,
"answer4" TEXT,
"answer5" TEXT,
"percentage" INTEGER,
FOREIGN KEY("form_id") REFERENCES "form"("id") ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY("user_tags_id") REFERENCES "user_tags"("id") ON UPDATE CASCADE ON DELETE CASCADE,
PRIMARY KEY("id" AUTOINCREMENT)
);
`

export let createTables = `
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "form" (
"id" INTEGER,
"question1" TEXT,
"question2" TEXT,
"question3" TEXT,
"question4" TEXT,
"question5" TEXT,
PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "tags" (
"id" INTEGER,
"name" TEXT,
"color" TEXT,
PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "user_tags" (
"id" INTEGER,
"date" TEXT,
"tag1" TEXT,
"tag2" TEXT,
"tag3" TEXT,
"tag4" TEXT,
"tag5" TEXT,
PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "form_answers" (
"id" INTEGER,
"date" TEXT,
"form_id" INTEGER,
"user_tags_id" INTEGER,
"answer1" TEXT,
"answer2" TEXT,
"answer3" TEXT,
"answer4" TEXT,
"answer5" TEXT,
"percentage" INTEGER,
FOREIGN KEY("form_id") REFERENCES "form"("id") ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY("user_tags_id") REFERENCES "user_tags"("id") ON UPDATE CASCADE ON DELETE CASCADE,
PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;

`;



