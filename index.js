import express from "express";
import dotenv from "dotenv";

import connectDB from "./driver/connect-db.mjs";

import vehiculoRoutes from "./routes/vehiculoRoutes.mjs";
import conductorRoutes from "./routes/conductorRoutes.mjs";
import mantenimientoRoutes from "./routes/mantenimientoRoutes.mjs";
import servicioRoutes from "./routes/servicioRoutes.mjs";

dotenv.config();

const app = express();


// CONEXIÓN A MONGODB

connectDB();

// CONFIGURACIÓN DE EJS

app.set("view engine", "ejs");


// MIDDLEWARES

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// RUTA PRINCIPAL

app.get("/", (req, res) => {
    res.render("index", {
        title: "Inicio"
    });
});


// RUTAS DEL SISTEMA

app.use("/vehiculos", vehiculoRoutes);
app.use("/conductores", conductorRoutes);
app.use("/mantenimientos", mantenimientoRoutes);
app.use("/servicios", servicioRoutes);




app.use((req, res) => {
    res.status(404).render("index", {
        title: "Página no encontrada",
        error: "La página que buscas no existe."
    });
});


// INICIAR SERVIDOR EN EL PUERTO 3000

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});