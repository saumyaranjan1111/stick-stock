import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// the below method handles the post request to this endpoint
export async function POST(request) {

  // extracts the action, slug, initialQuantity from the request
  let { action, slug, initialQuantity } = await request.json()
  
  // connects to the mongodb database 
  const uri = "mongodb+srv://stockmanagement:stockmanagement@cluster0.puubint.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const filter = { slug: slug };

    // if the action that has come with the request is a plus action then store the newQuantity as one more than the old quantity that has come with the POST request

    let newQuantity = action == "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1)

    // 
    const updateDoc = {
      $set: {
        quantity: newQuantity
      },
    };

    // filter : select collections on what basis (in our case, we are selecting on the basis if the value of the slug field in the collection is equal to the value of the slug variable)
    // updateDoc : is used to tell how to update the selected collection (in our case, we are modifying the selected collection by using $set, which sets the quantity field of the collection to the value of the newQuantity variable)
    // {} : additional options (in this case, we dont need any additional options)
    const result = await inventory.updateOne(filter, updateDoc, {});

    return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)` })
  }
  catch {
    return NextResponse.json({ success: false, message: `Some error occurred` })
  }
  finally {
    await client.close();
  }
}