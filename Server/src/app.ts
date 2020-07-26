import http from "http";
import express from "express";

import { treeRouter } from "./routers/tree.router";

const app = express();
const server = http.createServer(app);

app.get('/_health', (_, res) => res.send('OK'));
app.use('/tree', treeRouter);

const PORT = Number(process.env.PORT ?? 5000);
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});