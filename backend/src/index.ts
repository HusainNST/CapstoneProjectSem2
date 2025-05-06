import Express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5261;
const app = Express();

app.get("/", (_, res) => {
  res.status(200).json({ message: "Healthy" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
