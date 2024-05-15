const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 6003;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uoysey8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client.db("serviceDB").collection("service");
    const purchaseCollection = client.db("serviceDB").collection("purchase");

    app.post("/addServices", async (req, res) => {
      const newServices = req.body;
      console.log(newServices);
      const result = await serviceCollection.insertOne(newServices);
      res.send(result);
    });

    app.get("/addServices", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/viewDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.get("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.post("/purchase", async (req, res) => {
      const bookService = req.body;
      // console.log(bookService)
      const result = await purchaseCollection.insertOne(bookService);
      res.send(result);
    });

    app.get("/manageService/:email", async (req, res) => {
      const email = req.params.email;
      const query = { providerEmail: email };
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/addServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateService = req.body;
      const service = {
        $set: {
          image: updateService.image,
          name: updateService.name,
          price: updateService.price,
          area: updateService.area,
          description: updateService.description,
        },
      };
      const result = await serviceCollection.updateOne(
        filter,
        service,
        options
      );
      res.send(result);
    });

    app.get("/bookedService/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await purchaseCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/serviceToDo/:email',async(req,res)=>{
      const email = req.params.email;
      const query = { providerEmail: email };
      const result = await purchaseCollection.find(query).toArray();
      res.send(result);
    })

    app.patch('/serviceToDo/:id',async(req,res)=>{
      const id = req.params.id
      const status = req.body
      const query = {_id:new ObjectId(id)}
      const updateDoc = {
        $set:status,
      }
      const result =await purchaseCollection.updateOne(query,updateDoc)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Home repairing solutions is running");
});

app.listen(port, () => {
  console.log(`Home repairing solutions is running on port ${port}`);
});
