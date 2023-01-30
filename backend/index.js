const express = require('express');
const connectDB = require('./db/dbConnect');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoute = require('./routes/userRoutes');

const app = express();

//bodyParser is used to read the body of incoming HTTP request. 
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))

app.use(cors())

app.use('/user', userRoute);

const PORT = process.env.PORT || 5000;

const startServer =  async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}...`)
        );
    }
    catch(error){
        console.log(error)
    }
}

startServer();
