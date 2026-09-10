import express from "express";
import dotenv from "dotenv";
import connectDB from "./driver/connect-db.mjs";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Conexión a MongoDB Atlas
connectDB();

// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get("/", (req, res) => {
    res.render("index", {
        titulo: "PARCIAL 1 ELECTIVA 2"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});