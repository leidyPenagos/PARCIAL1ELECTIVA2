import express from "express";

import {
    listarConductores,
    crearConductor,
    obtenerConductor,
    actualizarConductor,
    eliminarConductor
} from "../controllers/conductorController.mjs";


const router = express.Router();


// Listar conductores
router.get("/", listarConductores);


// Crear conductor
router.post("/crear", crearConductor);


// Obtener conductor
router.get("/editar/:id", obtenerConductor);


// Actualizar conductor
router.post("/editar/:id", actualizarConductor);


// Eliminar conductor
router.post("/eliminar/:id", eliminarConductor);


export default router;