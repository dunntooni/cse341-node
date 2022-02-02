const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
   User.findById('61f36494a9f4191d40c4fbab')
      .then((user) => {
         req.user = user;
         next();
      })
      .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
   .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j6osm.mongodb.net/shop?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
   )
   .then((result) => {
      User.findOne().then((user) => {
         if (!user) {
            const user = new User({
               name: 'Isaac',
               email: 'isaac@test.com',
               cart: {
                  items: [],
               },
            });
            user.save();
         }
      });
      app.listen(PORT);
   })
   .catch((err) => {
      console.log(err);
   });
