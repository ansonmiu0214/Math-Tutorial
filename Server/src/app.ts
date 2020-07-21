import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

app.get("/_health", (req, res) => {
  res.send("OK");
})

const PORT = Number(process.env.PORT ?? 5000);
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

// import { buildExprTree } from "./parser";

// const tree = buildExprTree("1 + 2 * 3");
// console.log(tree.toString());