import Mantenimiento from "../models/Mantenimiento.mjs";
import Vehiculo from "../models/Vehiculo.mjs";


// LISTA DE TODOS LOS MANTENIMIENTOS 


export const listarMantenimientos = async (req, res) => {

    try {

        const mantenimientos = await Mantenimiento
            .find()
            .populate("vehiculo")
            .sort({ fecha: -1 });

        const vehiculos = await Vehiculo
            .find()
            .sort({ placa: 1 });

        res.render("mantenimientos", {
            title: "Mantenimientos",
            mantenimientos,
            vehiculos,
            error: null,
            mensaje: null
        });

    } catch (error) {

        console.error(error);

        res.status(500).render("mantenimientos", {
            title: "Mantenimientos",
            mantenimientos: [],
            vehiculos: [],
            error: "No fue posible cargar los mantenimientos.",
            mensaje: null
        });
    }
};



// CREAR UN NUEVO MANTENIMIENTO


export const crearMantenimiento = async (req, res) => {

    try {

        const {
            vehiculo,
            fecha,
            tipo,
            descripcion,
            costo,
            kilometraje,
            observaciones
        } = req.body;


        // Verificar que el vehículo exista

        const vehiculoExiste = await Vehiculo.findById(vehiculo);

        if (!vehiculoExiste) {

            const mantenimientos = await Mantenimiento
                .find()
                .populate("vehiculo");

            const vehiculos = await Vehiculo.find();

            return res.status(400).render("mantenimientos", {
                title: "Mantenimientos",
                mantenimientos,
                vehiculos,
                error: "El vehículo seleccionado no existe.",
                mensaje: null
            });
        }


        // Crear un nuevo mantenimiento

        await Mantenimiento.create({
            vehiculo,
            fecha,
            tipo,
            descripcion,
            costo,
            kilometraje,
            observaciones
        });


        // Si entra a mantenimiento se cambia el estado del vehículo

        vehiculoExiste.estado = "En mantenimiento";

        await vehiculoExiste.save();


        res.redirect("/mantenimientos");

    } catch (error) {

        console.error(error);

        const mantenimientos = await Mantenimiento
            .find()
            .populate("vehiculo");

        const vehiculos = await Vehiculo.find();

        res.status(400).render("mantenimientos", {
            title: "Mantenimientos",
            mantenimientos,
            vehiculos,
            error: error.message,
            mensaje: null
        });
    }
};

// ELIMINAR UN MANTENIMIENTO


export const eliminarMantenimiento = async (req, res) => {

    try {

        const mantenimiento = await Mantenimiento
            .findById(req.params.id);

        if (!mantenimiento) {
            return res.status(404).send(
                "Mantenimiento no encontrado"
            );
        }


        const vehiculoId = mantenimiento.vehiculo;


        await Mantenimiento.findByIdAndDelete(
            req.params.id
        );


        // Si ya no tiene mantenimientos recientes se deja disponible el vehículo

        const otroMantenimiento = await Mantenimiento.findOne({
            vehiculo: vehiculoId
        });


        if (!otroMantenimiento) {

            await Vehiculo.findByIdAndUpdate(
                vehiculoId,
                {
                    estado: "Disponible"
                }
            );
        }


        res.redirect("/mantenimientos");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "No fue posible eliminar el mantenimiento."
        );
    }
};