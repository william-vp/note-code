const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const bodyParser = require('body-parser');

const app = express(); //create server
connectDB(); //connect db
const optionsCors = {origin: process.env.FRONTEND_URL}
app.use(cors(optionsCors)); //enable cors

app.use(express.json({extended: true})); //enable express.json
const port = process.env.PORT || 4000; //port env | default

//habilitar carpeta public uploads /fileURL
app.use(express.static('uploads'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

//routes
app.use('/api/notes', require('./routes/notes'));
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json("algo salió mal")
});

app.listen(port, '0.0.0.0', () => {//run app
    console.log(`El servidor esta funcionando con el puerto ${port}`);
});