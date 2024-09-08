import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import models, { sequelize } from './models';
import routes from './routes';

const app = express();

// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware

app.use(async (req, res, next) => {
  var userAgent = req.headers['loginuser']; 
  console.log(userAgent);
  req.context = {
    models,
    loginUserId: null
  };
  if(userAgent != null){
   
    var loginUser = await models.User.findByLogin(userAgent);
    if(loginUser != null){
      console.log(loginUser);
      req.context.loginUserId = loginUser.Id;
      
    }
    
  }
 
  next();
});

// * Routes * //

app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

// * Start * //

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'ninh.bui',
      email: 'ninh@testemail.com',
      messages: [
        {
          text: 'message 1',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'nam.tran',
      email: 'nam@testemail.com',
      messages: [
        {
          text: 'message 2',
        },
        {
          text: 'message 3',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};