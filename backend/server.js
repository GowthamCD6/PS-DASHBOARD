require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const app = express();
const PORT = process.env.PORT || 3000;
const authRoute = require("./routes/authRoutes");
const getRoute = require("./routes/getRoute");
const postRoute = require("./routes/postRoute");

app.use(cors({
        origin: "http://localhost:5173", // Vite's default port
        credentials: true, // accepts cookie's from frontend
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/',authRoute);
app.use('/',getRoute);
app.use('/',postRoute);


app.use((req,res,next) => {
    next(createError.NotFound("api do not found"));
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.send({
        error:{
            status: error.status || 500,
            message: error.message
        }
    })
})

app.listen(PORT, () => console.log("Server is running on http://localhost:"+PORT));
