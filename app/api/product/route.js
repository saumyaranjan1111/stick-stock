import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

  const uri = "mongodb+srv://stockmanagement:stockmanagement@cluster0.puubint.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const query = {};
    const products = await inventory.find(query).toArray();
    return NextResponse.json({ success: true, products })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

}

export async function POST(request) {
  try {
    let body = await request.json();

    // Check if the query is not empty
    if (Object.keys(body).length !== 0) {
      // console.log(body);
      // console.log(1);
      const uri = "mongodb+srv://stockmanagement:stockmanagement@cluster0.puubint.mongodb.net/";
      const client = new MongoClient(uri);

      try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        const product = await inventory.insertOne(body);

        return NextResponse.json({ product, ok: true });
      } finally {
        await client.close();
      }

    } else {
      // console.log(body);
      // console.log(2);
      // Return an error response if the query is empty
      return NextResponse.json({ ok: false});
    }
    
  } catch (error) {
    // Handle any errors that occur during request processing.
    return NextResponse.json({ success: false, message: "Error processing request" });
  }
}
