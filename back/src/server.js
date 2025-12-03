require('dotenv').config();

const port = process.env.PORT || 3000;

const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});