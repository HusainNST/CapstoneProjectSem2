import Express from "express";
import { FRONTEND, PORT } from "~/constants/env";
import cors from "cors";

const app = Express();

app.use(Express.json());
app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
  }),
);

app.get("/", (_, res) => {
  res.status(200).json({ message: "Healthy" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
