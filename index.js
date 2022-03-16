const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbkcs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);


async function run(){

    try{
        await client.connect();
        // console.log('Connected to database');
        
    const database = client.db("actShady");
    const productsCollection = database.collection("products");
    const testimonialsCollection = database.collection("testimonials");
    const purchesesCollection = database.collection("purcheses");

    
    //GET API(Load data from database)(products) start
    app.get('/products', async (req,res)=>{
        const cursor = productsCollection.find({ });
        const products = await cursor.toArray();
        res.send(products);
    })

    //GET API(Load all testimonial data from database)start
        //GET API(Load data from database) start
        app.get('/testimonials', async (req,res)=>{
            const cursor = testimonialsCollection.find({ });
            const testimonials = await cursor.toArray();
            res.send(testimonials);
        })


        //GET API (Load all Purchese data from database) starts
        app.get('/purcheses', async (req,res)=>{
            const cursor = purchesesCollection.find({ });
            const purcheses = await cursor.toArray();
            res.send(purcheses);
        })
          //GET API (Load all Purchese data from database) ends


        //GET API (Load specific Purchese data from database) starts
        app.get('/purcheses/:email', async (req,res)=>{
            const email = req.params.email;
            const query = {customerEmail : email}
            const cursor = purchesesCollection.find(query);
            const purcheses = await cursor.toArray();
            res.send(purcheses);
        })
          //GET API (Load specific Purchese data from database) ends

    //GET A Single Service
    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        console.log('getting specific service', id);
        const query = { _id: ObjectId(id) };
        const product = await productsCollection.findOne(query);
        res.json(product);
    })



    //POST API(Data insert) start
    app.post('/products', async (req,res)=>{
        const product = req.body;

        console.log('hit the post api',product);

        const result = await productsCollection.insertOne(product);
        console.log(result);

        // res.send('post hitted')
        res.json(result);

    })
    //data insert end

    //POST API(Data insert) start(testimonial data)
    app.post('/testimonials', async (req,res)=>{
        const testimonial = req.body;

        console.log('hit the post api',testimonial);

        const result = await testimonialsCollection.insertOne(testimonial);
        console.log(result);

        // res.send('post hitted')
        res.json(result);

    })
    //data insert end(Testimonial)


    //POST API (Data Insert)start(Purchese data)

    app.post('/purcheses', async (req,res)=>{
        const purchese = req.body;

        console.log('hit the post api',purchese);

        const result = await purchesesCollection.insertOne(purchese);
        console.log(result);

        // res.send('post hitted')
        res.json(result);

    })
 //inserted purchese data ends here

    //DELETE API STARTS
    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productsCollection.deleteOne(query);
        res.json(result);
    })
    //Delete api ends

    //DELETE API STARTS(purchese item)
    app.delete('/purcheses/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await purchesesCollection.deleteOne(query);
        res.json(result);
    })
    //Delete api ends(purchese)

    }
    finally {
        // await client.close();

}
}

run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Running act shady server');
});


app.listen(port, ()=>{
    console.log('Running server on port',port);
})