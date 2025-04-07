import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import SetupSwagger from "./docs/swagger";
import homeRoutes from "./routers/homeRoutes";
import appointmentsRouter from "./routers/appointmentsRouter";
import emailRouter from "./routers/emailRouter";
import authRouter from "./routers/authRouter";
import scheduleDailyCleanup from "./scheduler";

// Load environment variables
dotenv.config();

// App configuration
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.use(compression());
app.use(bodyParser.json());

// Static file serving
app.use(express.static("static"));
app.use(express.static(path.join(__dirname, "views")));

// Use the home route
app.use("/", homeRoutes);

// API Routes
app.use("/appointments", appointmentsRouter);
app.use("/auth", authRouter);
app.use("/form", emailRouter);
const startApp = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(String(MONGO_URI));
    console.log("Successfully connected to database");

    // Setup Swagger docs
    SetupSwagger(app);

    // Inicia o agendador de tarefas
    scheduleDailyCleanup();

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Startup error:", error.message);
    }
  }
};

startApp();
