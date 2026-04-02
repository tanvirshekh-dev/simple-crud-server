const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json())

// user & password
// simpleDBUser
// ChMI4MVmKLsTJ0Wt
const uri = "mongodb+srv://simpleDBUser:ChMI4MVmKLsTJ0Wt@cluster0.qqlveqa.mongodb.net/?appName=Cluster0";

// create a mongodb client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('server is running now')
})

async function run() {
  try {
    // database connection start in this line = client.connect();
    await client.connect();

    const usersDB = client.db('usersDB');
    const usersCollection = usersDB.collection('users')

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log('need user id: ', id)
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.findOne(query);
      res.send(result);
    })

    // add database related apis here
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log('user info: ', newUser)
      const result = await usersCollection.insertOne(newUser)
      res.send(result);
    })

    app.patch('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      console.log('to update', id, updatedUser)
      const query = {_id: new ObjectId(id)}
      const update = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        }
      }
      const option = {}
      const result = await usersCollection.updateOne(query, update, option)
      res.send(result);
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query)
      res.send(result);
    })

    await client.db('admin').command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir)

app.listen(port, () => {
  console.log( `The server port no is: ${port}` )
})

/**
 * 1. at last 1 user
 * 2. set uri with userId and password
 * 3. create a mongoDn client
 * 4. add a run function to connect to the database
 * 5. use try finally inside it to connect the client
 * 6. ping the database to see is alive or not
 */
