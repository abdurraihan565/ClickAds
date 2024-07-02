const app = require('./app');
const connectDatabase = require('./config/db');
const { serverPort } = require('./secret');
const { serverPorts } = require('./secret');

app.listen(serverPort, async () => {
  console.log(`server is running at ${serverPorts}`);
  await connectDatabase();
});
