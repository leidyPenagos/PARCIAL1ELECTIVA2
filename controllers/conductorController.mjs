import Conductor from "../models/Conductor.mjs";



// LISTA DE CONDUCTORES


export const listarConductores = async (req, res) => {

    try {

        const conductores = await Conductor
            .find()
            .sort({ apellido: 1, nombre: 1 });

        res.render("conductores", {
            title: "Conductores",
            conductores,
            error: null,
            mensaje: null,
            conductorEditar: null
            
        });

    } catch (error) {

        console.error(error);

        res.status(500).render("conductores", {
            title: "Conductores",
            conductores: [],
            error: "No fue posible cargar los conductores.",
            mensaje: null,
            conductorEditar: null

        });
    }
};



// CREAR CONDUCTOR


export const crearConductor = async (req, res) => {

    try {

        const {
            nombre,
            apellido,
            documento,
            telefono,
            licencia,
            categoriaLicencia,
            estado
        } = req.body;


        // Verificar que el documento no esté registrado

        const documentoExistente = await Conductor.findOne({
            documento
        });

        if (documentoExistente) {

            const conductores = await Conductor.find();

            return res.status(400).render("conductores", {
                title: "Conductores",
                conductores,
                error: `El documento ${documento} ya está registrado.`,
                mensaje: null
            });
        }


        // Verificar que la licencia no esté registrada

        const licenciaExistente = await Conductor.findOne({
            licencia
        });

        if (licenciaExistente) {

            const conductores = await Conductor.find();

            return res.status(400).render("conductores", {
                title: "Conductores",
                conductores,
                error: `La licencia ${licencia} ya está registrada.`,
                mensaje: null
            });
        }


        await Conductor.create({
            nombre,
            apellido,
            documento,
            telefono,
            licencia,
            categoriaLicencia,
            estado
        });


        res.redirect("/conductores");

    } catch (error) {

        console.error(error);

        const conductores = await Conductor.find();

        res.status(400).render("conductores", {
            title: "Conductores",
            conductores,
            error: error.message,
            mensaje: null
        });
    }
};



// OBTENER EL CONDUCTOR POR ID PARA EDITAR


export const obtenerConductor = async (req, res) => {

    try {

        const conductor = await Conductor.findById(req.params.id);

        if (!conductor) {
            return res.status(404).send("Conductor no encontrado");
        }

        const conductores = await Conductor.find();

        res.render("conductores", {
            title: "Editar Conductor",
            conductorEditar: conductor,
            conductores,
            error: null,
            mensaje: null
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Error al consultar conductor");
    }
};


// ACTUALIZAR DATOS DEL CONDUCTOR


export const actualizarConductor = async (req, res) => {

    try {

        const {
            nombre,
            apellido,
            documento,
            telefono,
            licencia,
            categoriaLicencia,
            estado
        } = req.body;


        const conductor = await Conductor.findById(req.params.id);

        if (!conductor) {
            return res.status(404).send("Conductor no encontrado");
        }


        // Verificar que el documento no esté duplicado en otro conductor

        const documentoExistente = await Conductor.findOne({
            documento,
            _id: { $ne: req.params.id }
        });

        if (documentoExistente) {

            return res.status(400).send(
                "El documento ya pertenece a otro conductor."
            );
        }


        // Verificar que la licencia no esté registrada en otro conductor

        const licenciaExistente = await Conductor.findOne({
            licencia,
            _id: { $ne: req.params.id }
        });

        if (licenciaExistente) {

            return res.status(400).send(
                "La licencia ya pertenece a otro conductor."
            );
        }


        conductor.nombre = nombre;
        conductor.apellido = apellido;
        conductor.documento = documento;
        conductor.telefono = telefono;
        conductor.licencia = licencia;
        conductor.categoriaLicencia = categoriaLicencia;
        conductor.estado = estado;

        await conductor.save();

        res.redirect("/conductores");

    } catch (error) {

        console.error(error);

        res.status(400).send(
            `Error al actualizar conductor: ${error.message}`
        );
    }
};


// ELIMINAR EL CONDUCTOR BUSQUEDA POR ID


export const eliminarConductor = async (req, res) => {

    try {

        const conductor = await Conductor.findById(req.params.id);

        if (!conductor) {
            return res.status(404).send("Conductor no encontrado");
        }

        await Conductor.findByIdAndDelete(req.params.id);

        res.redirect("/conductores");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "No fue posible eliminar el conductor."
        );
    }
};