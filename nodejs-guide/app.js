const path = require('path');
const PORT = process.env.PORT || 3000

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const corsOptions = {
   origin: "https://powerful-river-99797.herokuapp.com/",
   optionsSuccessStatus: 200
};
app.use(cors(corsOptions))
const options = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   family: 4
}
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://dunntooni:Videogamer2@cse341cluster-3dwlw.mongodb.net/test?retryWrites=true&w=majority";
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('61f2007473c3edd055e1eb27')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
.connect(
   MONGODB_URL, options
)
.then(result => {
   app.listen(PORT);
})
.catch(err => {
   console.log(err);
})