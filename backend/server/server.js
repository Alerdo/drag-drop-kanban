const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3002',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  app.use(cors(corsOptions)); 

app.use(express.json());

const cardsRoutes = require('./routes/cards');

app.use('/', cardsRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
