const path = require('path');
const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const corsOptions = {
   origin: 'https://powerful-river-99797.herokuapp.com/',
   optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
const options = {
   family: 4,
};
const MONGODB_URL =
   process.env.MONGODB_URL ||
   'mongodb+srv://dunntooni:Videogamer2@cluster0.j6osm.mongodb.net/shop?retryWrites=true';
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
   .connect(MONGODB_URL, options)
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
