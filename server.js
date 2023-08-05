const express = require('express');
const app = express();

const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require('path');
const cors = require('cors');
dotenv.config();

//global middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

const router = require("./router");
router.forEach((route) => {
    app.use(`/api${route.path}`, route.handler);
})
/*
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute) */


const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
