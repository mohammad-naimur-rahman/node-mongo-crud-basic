const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.avi8n.mongodb.net/organicDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})



client.connect(err => {
    const collection = client.db("organicDB").collection("products");

    app.get('/products', (req, res) => {
        //collection.find({}).limit(4)
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(res => console.log('One product added'))
        res.redirect('/');
    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectID(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })

    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectID(req.params.id) }, {
            $set: { price: req.body.price, quantity: req.body.quantity }
        })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })
});


app.listen(3000);