const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000

const Mongo_URL = "mongodb://127.0.0.1/ecommerce_marketplace";



const paymentRoutes = require('./routes/paymentRoutes');

app.use(express.json());
app.use('/api/payment', paymentRoutes);

require('dotenv').config();

app.use(express.json({ limit: '10mb' }))
app.use(cors())

const webhookRoutes = require('./routes/webhookRoutes');
app.use('/api/webhook', webhookRoutes);


mongoose
    .connect(Mongo_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})