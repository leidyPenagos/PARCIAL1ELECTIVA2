import express from "express";

import {
    listarServicios,
    crearServicio,
    cancelarServicio,
    realizarServicio,
    eliminarServicio,
    generarInforme
} from "../controllers/servicioController.mjs";


const router = express.Router();

// mostrar todos los servicios
router.get(
    "/",
    listarServicios
);

// crear un nuevo servicio
router.post(
    "/crear",
    crearServicio
);

// cancelar un servicio
router.post(
    "/cancelar/:id",
    cancelarServicio
);

// realizar un servicio
router.post(
    "/realizar/:id",
    realizarServicio
);

// eliminar un servicio
router.post(
    "/eliminar/:id",
    eliminarServicio
);

// generar informe de servicios
router.get(
    "/informe",
    generarInforme
);


export default router;