import express from "express";

import {
    listarMantenimientos,
    crearMantenimiento,
    eliminarMantenimiento
} from "../controllers/mantenimientoController.mjs";


const router = express.Router();


// Listar mantenimientos
router.get("/", listarMantenimientos);


// Crear mantenimiento
router.post("/crear", crearMantenimiento);


// Eliminar mantenimiento
router.post("/eliminar/:id", eliminarMantenimiento);


export default router;