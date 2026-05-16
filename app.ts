import express from "express";
import type { Request, Response} from "express";

import taskRoutes from "./routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json);

app.use("/api", taskRoutes);

app.use("/", (req: Request, res: Response) => {
    res.send("Welcome to backend server");
});

app.use(errorHandler);

export default app;