const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const { Buffer } = require("buffer");

dotenv.config();  // Load environment variables

// Decode the Firebase credentials from the GitHub secret
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

// API Route to Get Messages
app.get("/messages", async (req, res) => {
    try {
        const snapshot = await db.collection("messages").get();
        const messages = snapshot.docs.map(doc => doc.data());
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// API Route to Add a Message
app.post("/messages", async (req, res) => {
    try {
        const { text } = req.body;
        await db.collection("messages").add({ text });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to add message" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
