const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'kipu-db.json'));
const middlewares = jsonServer.defaults();
const routes = require(path.join(__dirname, 'routes.json'));

// Habilitar CORS para permitir peticiones desde tu Firebase Hosting
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

server.use(middlewares);
server.use(jsonServer.rewriter(routes));
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Kipu Mock Server is running on port', port);
});
