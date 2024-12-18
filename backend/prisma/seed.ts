import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

// Add type for the JSON data
interface JsonUser {
  id: string;
  name: string;
}

interface JsonComment {
  id: string;
  body: string;
  user: JsonUser;
}

interface JsonAnswer {
  id: string;
  body: string;
  creation: Date;
  score: number;
  accepted?: boolean;
  user: JsonUser;
  comments?: JsonComment[];
}

interface JsonQuestion {
  id: string;
  title: string;
  body: string;
  creation: Date;
  score: number;
  user: JsonUser;
  comments?: JsonComment[];
  answers?: JsonAnswer[];
}

async function main() {
  const rawData = fs.readFileSync("./assets/stackoverfaux-data.json", "utf8");
  const questions: JsonQuestion[] = JSON.parse(rawData);

  // First, collect all unique users
  const users = new Map<string, JsonUser>();

  for (const question of questions) {
    // Add question author
    users.set(question.user.id, question.user);

    // Add comment authors
    question.comments?.forEach((comment) => {
      users.set(comment.user.id, comment.user);
    });

    // Add answer authors and their comment authors
    question.answers?.forEach((answer) => {
      users.set(answer.user.id, answer.user);
      answer.comments?.forEach((comment) => {
        users.set(comment.user.id, comment.user);
      });
    });
  }

  // Create all users first
  console.log("Creating users...");
  for (const user of users.values()) {
    try {
      await prisma.user.upsert({
        where: { id: parseInt(user.id) },
        update: { name: user.name },
        create: {
          id: parseInt(user.id),
          name: user.name,
        },
      });
    } catch (error) {
      console.error(`Error creating user ${user.id}:`, error);
    }
  }

  // Then create questions with their relationships
  console.log("Creating questions, answers, and comments...");
  for (const question of questions) {
    try {
      await prisma.question.create({
        data: {
          id: parseInt(question.id),
          title: question.title,
          body: question.body,
          creation: Math.floor(new Date(question.creation).getTime()),
          score: question.score,
          userId: parseInt(question.user.id),
          comments: {
            create:
              question.comments?.map((comment) => ({
                id: parseInt(comment.id),
                body: comment.body,
                userId: parseInt(comment.user.id),
              })) || [],
          },
          answers: {
            create:
              question.answers?.map((answer) => ({
                id: parseInt(answer.id),
                body: answer.body,
                creation: Math.floor(new Date(answer.creation).getTime()),
                score: answer.score,
                accepted: answer.accepted || false,
                userId: parseInt(answer.user.id),
                comments: {
                  create:
                    answer.comments?.map((comment) => ({
                      id: parseInt(comment.id),
                      body: comment.body,
                      userId: parseInt(comment.user.id),
                    })) || [],
                },
              })) || [],
          },
        },
      });
      console.log(`Imported question ${question.id}`);
    } catch (error) {
      console.error(`Error importing question ${question.id}:`, error);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
