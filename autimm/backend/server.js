require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authroutes');

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});