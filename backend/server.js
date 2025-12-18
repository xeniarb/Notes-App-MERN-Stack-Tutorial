const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const notesRoutes = require("./routes/notes");

dotenv.config();

const app = express();

// Replace with your MongoDB URL
const connection_url = process.env.MONGO_URI || 
"mongodb://localhost:27017/notesdb";

connectDB(connection_url);

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
