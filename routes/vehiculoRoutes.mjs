import express from "express";

import {
    listarVehiculos,
    crearVehiculo,
    obtenerVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
} from "../controllers/vehiculoController.mjs";


const router = express.Router();


// Listar vehículos
router.get("/", listarVehiculos);


// Crear vehículo
router.post("/crear", crearVehiculo);


// Obtener vehículo para editar
router.get("/editar/:id", obtenerVehiculo);


// Actualizar vehículo
router.post("/editar/:id", actualizarVehiculo);


// Eliminar vehículo
router.post("/eliminar/:id", eliminarVehiculo);


export default router;