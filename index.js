const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 4000



// Middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ftqixdj.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        // Create Collection

        const toysCollection = client.db('educational-toys').collection('toys-item')

        app.get('/alltoys', async (req, res) => {
            const cursor = toysCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post("/alltoys", async (req, res) => {
            const toys = req.body;
            const result = await toysCollection.insertOne(toys)
            res.send(result)
        })

        app.get("/alltoys/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query)
            res.send(result);
        })
        app.get("/mytoys", async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }

            let sortDirection = 1; // Default sort direction (ascending)
            if (req.query?.sort === 'desc') {
                sortDirection = -1; // Sort in descending order
            }

            const result = await toysCollection.find(query).sort({ price: sortDirection }).toArray();
            res.send(result);
        });

        app.get("/update/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result)
        })
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedToy = req.body;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const toy = {
                $set: {
                    name: updatedToy.name,
                    price: updatedToy.price,
                    rating: updatedToy.rating,
                    quantity: updatedToy.quantity,
                    description: updatedToy.description
                }
            }
            const result = await toysCollection.updateOne(filter, toy, option);
            res.send(result)
        })
        app.delete('/mytoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Smart Toy Market is running!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

