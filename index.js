require('dotenv').config();
const express = require('express'); // влияет ли имя перемен. на то, что извлекается из модуля
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandingMiddleware');
const cookieParser = require('cookie-parser');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use(cookieParser());
app.use('/api', router);

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () => console.log(`Server started ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
