const express = require('express');
const mongoose = require('mongoose');
require('./config/config');

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});




const app = express();
app.use(express.json())
app.use(require('./router/users'));


app.listen(3000, () => {
    console.log('Escuchando puerto: ', 3000);
});