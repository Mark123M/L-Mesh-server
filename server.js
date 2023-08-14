const express = require('express');
const app = express();

const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
dotenv.config();

// global middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors());
app.use((req, res, next) => {
  const {headers: {cookie}} = req;
  if (cookie) {
    const values = cookie.split(';').reduce((res, item) => {
      const data = item.trim().split('=');
      return {...res, [data[0]]: data[1]};
    }, {});
    res.locals.cookie = values;
  } else res.locals.cookie = {};
  next();
});

const router = require('./router');
router.forEach((route) => {
  app.use(`/api${route.path}`, route.handler);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});
