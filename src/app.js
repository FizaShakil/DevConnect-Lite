import express from "express";
import cors from 'cors'
import cookieParser from'cookie-parser'
import authRouter from "./routes/auth.router.js";
import projectRouter from "./routes/project.router.js";
import bidRouter from "./routes/bid.router.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({
    limit: '16kb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))
app.use(express.static("public"))

app.use(cookieParser())

app.use("/auth" , authRouter)
app.use('/projects', projectRouter)
app.use('/bids', bidRouter )

export default app;
