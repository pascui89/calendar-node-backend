const express = require('express');
const cors = require('cors');
require('dotenv').config();

const message = `
  _    _      _ _         
 | |  | |    | | |        
 | |__| | ___| | | ___   
 |  __  |/ _ \\ | |/ _ \\
 | |  | |  __/ | | (_) | 
 |_|  |_|\\___|_|_|\\___/                                 
`;


const app = express();
app.use(cors());
const { dbConnection } = require('./database/config');
dbConnection();

app.use(express.static('public'));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`${message}
        Running on http://localhost:4000`);
});