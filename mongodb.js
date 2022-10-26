// reference: https://www.youtube.com/watch?v=fbYExfeFsI0

const { MongoClient, ObjectId } = require('mongodb');

async function main() {
    const uri = `mongodb+srv://Gangula:qa1VXIIi6kTvPV4Y@cluster0.doqb5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await findById(client, "60b530cb48eb4cf478a14257s")
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function findById(client, id) {
    const result = await client.db("skills&Exposure").collection("Main Collection").find().limit(10);

    console.log(result)
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    // console.log(databasesList);
}