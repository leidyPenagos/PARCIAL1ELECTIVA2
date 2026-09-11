import Vehiculo from "../models/Vehiculo.mjs";
import Conductor from "../models/Conductor.mjs";


//LISTAR TODOS LOS VEHÍCULOS

export const listarVehiculos = async (req, res) => {
    try {

        const vehiculos = await Vehiculo
            .find()
            .populate("conductor")
            .sort({ placa: 1 });

        const conductores = await Conductor
            .find({ estado: "Activo" })
            .sort({ nombre: 1 });

        res.render("vehiculos", {
            title: "Vehículos",
            vehiculos,
            conductores,
            error: null,
            mensaje: null
        });

    } catch (error) {

        console.error(error);

        res.status(500).render("vehiculos", {
            title: "Vehículos",
            vehiculos: [],
            conductores: [],
            error: "No fue posible cargar los vehículos.",
            mensaje: null
        });
    }
};


// CREAR NUEVO VEHÍCULO

export const crearVehiculo = async (req, res) => {

    try {

        const {
            placa,
            tipo,
            marca,
            modelo,
            capacidad,
            color,
            estado,
            conductor
        } = req.body;


        // Verificar si la placa ya existe

        const vehiculoExistente = await Vehiculo.findOne({
            placa: placa.toUpperCase()
        });

        if (vehiculoExistente) {

            const vehiculos = await Vehiculo
                .find()
                .populate("conductor");

            const conductores = await Conductor
                .find({ estado: "Activo" });

            return res.status(400).render("vehiculos", {
                title: "Vehículos",
                vehiculos,
                conductores,
                error: `La placa ${placa.toUpperCase()} ya se encuentra registrada.`,
                mensaje: null
            });
        }


        // Crear vehículo

        await Vehiculo.create({
            placa,
            tipo,
            marca,
            modelo,
            capacidad,
            color,
            estado,
            conductor: conductor || null
        });



        res.redirect("/vehiculos");

    } catch (error) {

        console.error(error);

        const vehiculos = await Vehiculo
            .find()
            .populate("conductor");

        const conductores = await Conductor
            .find({ estado: "Activo" });

        res.status(400).render("vehiculos", {
            title: "Vehículos",
            vehiculos,
            conductores,
            error: error.message,
            mensaje: null
        });
    }
};


//OBTENER VEHÍCULO PARA EDITAR

export const obtenerVehiculo = async (req, res) => {

    try {

        const vehiculo = await Vehiculo
            .findById(req.params.id)
            .populate("conductor");

        if (!vehiculo) {
            return res.status(404).send("Vehículo no encontrado");
        }

        const conductores = await Conductor
            .find({ estado: "Activo" });

        res.render("vehiculos", {
            title: "Editar Vehículo",
            vehiculoEditar: vehiculo,
            vehiculos: await Vehiculo.find().populate("conductor"),
            conductores,
            error: null,
            mensaje: null
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Error al consultar el vehículo");
    }
};


// ACTUALIZAR VEHÍCULO

export const actualizarVehiculo = async (req, res) => {

    try {

        const {
            placa,
            tipo,
            marca,
            modelo,
            capacidad,
            color,
            estado,
            conductor
        } = req.body;


        const vehiculo = await Vehiculo.findById(req.params.id);

        if (!vehiculo) {
            return res.status(404).send("Vehículo no encontrado");
        }


        // Verificar que la placa no esté duplicada

        const placaExistente = await Vehiculo.findOne({
            placa: placa.toUpperCase(),
            _id: { $ne: req.params.id }
        });

        if (placaExistente) {

            return res.status(400).send(
                `La placa ${placa.toUpperCase()} ya pertenece a otro vehículo.`
            );
        }


        vehiculo.placa = placa;
        vehiculo.tipo = tipo;
        vehiculo.marca = marca;
        vehiculo.modelo = modelo;
        vehiculo.capacidad = capacidad;
        vehiculo.color = color;
        vehiculo.estado = estado;
        vehiculo.conductor = conductor || null;

        await vehiculo.save();

        res.redirect("/vehiculos");

    } catch (error) {

        console.error(error);

        res.status(400).send(
            `Error al actualizar el vehículo: ${error.message}`
        );
    }
};


// ELIMINAR VEHÍCULO

export const eliminarVehiculo = async (req, res) => {

    try {

        const vehiculo = await Vehiculo.findById(req.params.id);

        if (!vehiculo) {
            return res.status(404).send("Vehículo no encontrado");
        }

        await Vehiculo.findByIdAndDelete(req.params.id);

        res.redirect("/vehiculos");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "No fue posible eliminar el vehículo."
        );
    }
};