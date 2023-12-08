const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const asyncHandler = require ('express-async-handler');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "***********************************************************";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

 // Create a collection in the database
 const bookCollection = client.db("BookInventory").collection("books");

// Post Route handler for uploading a book
asyncHandler(app.post("/upload-book", async (req, res) => {

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Insert book into the database
    const data = req.body;
    const result = await bookCollection.insertOne(data);

    res.json(result);
 
    await client.close();
  }
));

//get all books records from the database

// asyncHandler(app.get("/all-books", async (req, res) => {
//   await client.connect();

//   const books =  bookCollection.find();
//   const result = await books.toArray();
//   res.send(result);

//   await client.close();
// }
// ));



//update a book  record from the database patch or update methods

asyncHandler(app.patch("/book/:id", async (req, res) => {

  // Connect the client to the server (optional starting in v4.7)
await client.connect();

 const id = req.params.id;
//  console.log(id);
const updateBookData= req.body;
const filter = {_id: new ObjectId(id)}
const options = {upsert : true}

const updateDoc = {
  $set:{
    ...updateBookData
  } 
}

//update
const result = await bookCollection.updateOne(filter,updateDoc,options);
res.send(result);


await client.close();
}
));




//delete a book  record from the database

asyncHandler(app.delete("/book/:id", async (req, res) => {

  // Connect the client to the server (optional starting in v4.7)
await client.connect();


const id = req.params.id;
const filter = {_id: new ObjectId(id)};
const result = await bookCollection.deleteOne(filter);
res.send(result);

await client.close();
}
));



//filter book record by category from the database

asyncHandler(app.get("/all-books", async (req, res) => {

  // Connect the client to the server (optional starting in v4.7)
await client.connect();

let query ={};
if(req.query?.category)
{
  query = {category: req.query.category}
}
const result = await bookCollection.find(query).toArray();
res.json(result);

await client.close();
}
));




// Default route
app.get('/', (req, res) => {
  res.send('Hello World!')
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
