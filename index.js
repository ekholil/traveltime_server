const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('welcome to server of Traveltime')
})

app.listen(port, () => {
    console.log('server is running at ', port)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odpvs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const blogCollection = client.db("traveltime").collection("blogs");
      const userCollection = client.db("traveltime").collection("users");
     
      
     // find all products
      app.get('/blogs', async(req, res) => {
        const result = await blogCollection.find({}).toArray()
        res.send(result) 
      })

     

      // api for find single product with id
      // app.get('/products/:id', async(req, res) => {
      //   const id = req.params.id
      //   const query = {_id : ObjectId(id)}
      //   const result = await booksCollection.findOne(query)
      //   res.send(result)
      // })
    
      // //post api
      // app.post('/addproduct', async(req, res) => {
      //   const data = req.body;
      //   const result = await booksCollection.insertOne(data)
      //   res.json(result)
      // })
     
    
      // check admin
      app.get('/users/:email', async(req, res) => {
        const email = req.params.email;
        const query = {email: email}
        const user = await userCollection.findOne(query)
        let isAdmin = false
        if(user?.role === 'admin'){
          isAdmin = true;
        }
        res.json({admin: isAdmin})
      })
      // //post api for save user in db
      app.post('/users', async(req, res) => {
        const data = req.body;
        const result = await userCollection.insertOne(data)
        res.send(result)
        console.log(result)
      })
      // make admin api 
      app.put('/users/admin', async(req, res) => {
        const user = req.body;
        const filter = {email : user.email}
        const updateDoc = {$set : {role: 'admin'}}
        const result = await usersCollection.updateOne(filter, updateDoc)
        res.json(result)
      })
      // // api for find orders by email
      app.get('/myorders/:email', async(req, res) => {
        const email = req.params.email;
        const query = {email : email}
        const result = await ordersCollection.find(query).toArray()
        res.send(result)
      })
    
      // //delete api from manage order
  
      
   
      
    } finally {
    
    }
  }
  run().catch(console.dir);
