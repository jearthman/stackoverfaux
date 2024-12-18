import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * Health check endpoint
 * @route GET /health
 * @returns {Object} 200 - OK message
 */
app.get("/health", (req: Request, res: Response) => {
  res.json({ message: "OK" });
});

/**
 * Get a list of questions
 * @route GET /questions
 * @param {number} count - Number of questions to return (default: 10)
 * @returns {Object[]} 200 - Array of questions
 */
app.get("/questions", (req: Request, res: Response) => {
  const count = req.query.count ? parseInt(req.query.count as string) : 10;
  prisma.question.findMany({ take: count }).then((questions) => {
    res.json(questions);
  });
});

/**
 * Search questions by title
 * @route GET /questions/search
 * @param {string} q - Search query string
 * @returns {Object[]} 200 - Array of matching questions
 */
app.get("/questions/search", (req: Request, res: Response) => {
  const q: string = req.query.q as string;
  prisma.question
    .findMany({ where: { title: { contains: q } } })
    .then((questions) => {
      res.json(questions);
    });
});

/**
 * Get detailed information about a specific question
 * @route GET /questions/:id
 * @param {number} id - Question ID
 * @returns {Object} 200 - Question details with nested answers, comments and users
 * @returns {Object} 404 - Question not found error
 */
app.get("/questions/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  prisma.question
    .findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            comments: {
              include: {
                user: true,
              },
            },
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    })
    .then((question) => {
      res.json(question);
    })
    .catch((err) => {
      res.status(404).json({ error: "Question not found" });
    });
});

/**
 * Add a new answer to a question
 * @route POST /questions/:id/newanswer
 * @param {number} id - Question ID
 * @param {string} answer - Answer body content
 * @returns {Object} 200 - Created answer with user and comments
 * @returns {Object} 500 - Server error
 */
app.post("/questions/:id/newanswer", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const body = req.body.answer;
  prisma.answer
    .create({
      data: {
        id: Math.floor(Math.random() * 1000000), // temporary ID generation
        body: body,
        questionId: id,
        creation: Math.floor(Date.now() / 1000),
        score: 0,
        userId: 1610174, // TODO: Replace with actual user ID from auth
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    })
    .then((answer) => {
      res.json(answer);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong!" });
    });
});

/**
 * Get user profile with their questions, answers and comments
 * @route GET /users/:id
 * @param {number} id - User ID
 * @returns {Object} 200 - User profile with related content
 */
app.get("/users/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  prisma.user
    .findUnique({
      where: { id },
      include: { questions: true, answers: true, comments: true },
    })
    .then((user) => {
      res.json(user);
    });
});

/**
 * Delete a user and all their associated content
 * @route DELETE /users/:id
 * @param {number} id - User ID
 * @returns {Object} 200 - Success message
 * @returns {Object} 500 - Deletion error
 */
app.delete("/users/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  prisma
    .$transaction([
      prisma.comment.deleteMany({ where: { userId: id } }),
      prisma.answer.deleteMany({ where: { userId: id } }),
      prisma.answer.deleteMany({ where: { question: { userId: id } } }),
      prisma.question.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ])
    .then(() => {
      res.json({ message: "User and all associated data deleted" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to delete user" });
    });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//starting server log
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
