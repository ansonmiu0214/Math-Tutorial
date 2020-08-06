import app from './routers';
import treeRouter from './routers/tree';

app.use('/bedmas-57cbb/us-central1/tree', treeRouter);

app.listen(process.env.USE_EXPRESS_PORT, () => {
  console.log(`Listening on port ${process.env.USE_EXPRESS_PORT}`);
});