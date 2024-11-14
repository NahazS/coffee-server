const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://nifazurrahman2872:bAxtLHGWc4ZmF5Nj@cluster0.1tebz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express()

const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())





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


    const coffeeCollection = client.db("CoffeesDB").collection("coffees");

    app.get('/coffees', async(req, res) => {
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/coffees/:id', async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(filter)
      res.send(result)
    })
    

    app.post('/coffees', async(req, res) => {
      const coffee = req.body
      const result = await coffeeCollection.insertOne(coffee)
      res.send(result)

    })

    app.put('/coffees/:id', async(req,res) => {
      const id = req.params.id
      const coffee = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateCoffee = {
        $set:{
          name : coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          price: coffee.price,
          category: coffee.category,
          details: coffee.details,

        }
      }
      const result = await coffeeCollection.updateOne(filter,options, updateCoffee)
      res.send(result)
    })

    app.delete('/coffees/:id', async(req,res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(filter)
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
    res.send('running')
})
app.listen(port, () => {
    console.log(`running port : ${port}`)
})