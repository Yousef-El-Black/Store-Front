import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import errorMiddleware from "./middlewares/error.middleware";
import config from "./config";
import routes from "./routes";

// Port
const PORT = config.port || 3000;

// Create Insatnce Server
const app: Application = express();

// Middleware to parse incoming requests
app.use(express.json());

// HTTP Request Logger Middleware
app.use(morgan("common"));

// HTTP Security Middleware
app.use(helmet());

// Apply the rate limiting Middleware to all requests
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // Time
    max: 100, // Limit each IP to 100 requests per `window`
    message: "Too many request from this IP, Please try again later.", // The message that will show to user
  })
);

// Add Routes API
app.use("/api", routes);

// Add routing for / path
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Hello World",
  });
});

// Error Middleware
app.use(errorMiddleware);

// Hanling NOT EXIST ROUTE Errors
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "You are Lost, Please read API Documentation to find your way",
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`The server Starting on Port: ${PORT}`);
});

export default app;
