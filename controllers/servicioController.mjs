import Servicio from "../models/Servicio.mjs";
import Vehiculo from "../models/Vehiculo.mjs";
import Conductor from "../models/Conductor.mjs";


  // LISTA DE TODOS LOS SERVICIOS


export const listarServicios = async (req, res) => {

    try {

        const servicios = await Servicio.find()
            .populate("vehiculo")
            .populate("conductor")
            .sort({ fecha: 1, horaSalida: 1 });

        const vehiculos = await Vehiculo.find();

        const conductores = await Conductor.find();

        res.render("servicios", {

            servicios,
            vehiculos,
            conductores,

            error: null,
            mensaje: null,

            informe: null

        });

    } catch (error) {

        console.error(error);

        res.status(500).render("servicios", {

            servicios: [],
            vehiculos: [],
            conductores: [],

            error: "No fue posible cargar los servicios.",

            mensaje: null,

            informe: null

        });

    }

};


  // CREAR UN NUEVO SERVICIO

export const crearServicio = async (req, res) => {

    try {

        const {

            fecha,
            horaSalida,
            horaRegreso,
            origen,
            destino,
            pasajeros,
            vehiculo,
            conductor,
            tipoEvento,
            solicitante,
            descripcion

        } = req.body;


          // 1. VALIDACION DE HORARIO DISPONIBLE
       

        if (horaSalida >= horaRegreso) {

            return mostrarErrorServicio(
                res,
                "La hora de salida debe ser menor que la hora de regreso."
            );

        }


          // 2. VALIDACION DE PASAJEROS

        if (!pasajeros || Number(pasajeros) <= 0) {

            return mostrarErrorServicio(
                res,
                "El número de pasajeros debe ser mayor que cero."
            );

        }

          // 3. BUSCAR UN VEHÍCULO POR ID

        const vehiculoEncontrado =
            await Vehiculo.findById(vehiculo);


        if (!vehiculoEncontrado) {

            return mostrarErrorServicio(
                res,
                "El vehículo seleccionado no existe."
            );

        }


          // 4. VERIFICAR EL ESTADO DEL VEHÍCULO

        if (
            vehiculoEncontrado.estado === "En mantenimiento"
        ) {

            return mostrarErrorServicio(
                res,
                "El vehículo se encuentra en mantenimiento y no puede ser utilizado."
            );

        }


        if (
            vehiculoEncontrado.estado === "Inactivo"
        ) {

            return mostrarErrorServicio(
                res,
                "El vehículo está inactivo y no puede ser utilizado."
            );

        }


        // 5. VERIFICAR CAPACIDAD

        if (
            Number(pasajeros) >
            Number(vehiculoEncontrado.capacidad)
        ) {

            return mostrarErrorServicio(
                res,
                `El vehículo tiene capacidad para ${vehiculoEncontrado.capacidad} pasajeros y se solicitaron ${pasajeros}.`
            );

        }


         //  6. BUSCAR CONDUCTOR

        const conductorEncontrado =
            await Conductor.findById(conductor);


        if (!conductorEncontrado) {

            return mostrarErrorServicio(
                res,
                "El conductor seleccionado no existe."
            );

        }


          // 7. VERIFICAR QUE EL CONDUCTOR ESTÉ ACTIVO

        if (
            conductorEncontrado.estado !== "Activo"
        ) {

            return mostrarErrorServicio(
                res,
                "El conductor seleccionado no está activo."
            );

        }


        //8. CREAR EL RANGO DE FECHA

        const rangoFecha = mismaFecha(fecha);


        // 9. VERIFICAR DISPONIBILIDAD DEL VEHÍCULO

        const conflictoVehiculo =
            await Servicio.findOne({

                vehiculo: vehiculo,

                fecha: rangoFecha,

                estado: {
                    $ne: "Cancelado"
                },

                $or: [

                    {
                        horaSalida: {
                            $lt: horaRegreso
                        },

                        horaRegreso: {
                            $gt: horaSalida
                        }
                    }

                ]

            });


        if (conflictoVehiculo) {

            return mostrarErrorServicio(
                res,
                `El vehículo ${vehiculoEncontrado.placa} ya tiene un servicio programado en ese horario.`
            );

        }


        // 10. VERIFICAR DISPONIBILIDAD DEL CONDUCTOR

        const conflictoConductor =
            await Servicio.findOne({

                conductor: conductor,

                fecha: rangoFecha,

                estado: {
                    $ne: "Cancelado"
                },

                $or: [

                    {
                        horaSalida: {
                            $lt: horaRegreso
                        },

                        horaRegreso: {
                            $gt: horaSalida
                        }
                    }

                ]

            });


        if (conflictoConductor) {

            return mostrarErrorServicio(
                res,
                `El conductor ${conductorEncontrado.nombre} ${conductorEncontrado.apellido} ya tiene un servicio programado en ese horario.`
            );

        }


        //11. CREAR UN NUEVO SERVICIO

        const nuevoServicio = new Servicio({

            fecha,

            horaSalida,

            horaRegreso,

            origen,

            destino,

            pasajeros: Number(pasajeros),

            vehiculo,

            conductor,

            tipoEvento,

            solicitante,

            descripcion,

            estado: "Programado"

        });


        await nuevoServicio.save();


        // 12. NO CAMBIAMOS EL VEHÍCULO A EN SERVICIO SINO QUE SE MANTIENE DISPONIBLE HASTA QUE LLEGUE EL MOMENTO DEL SERVICIO.


        return res.redirect("/servicios");

    } catch (error) {

        console.error(error);

        return mostrarErrorServicio(
            res,
            "Ocurrió un error al programar el servicio."
        );

    }

};


// CANCELAR UN SERVICIO YA AGENDADO

export const cancelarServicio = async (req, res) => {

    try {

        const servicio =
            await Servicio.findById(req.params.id);


        if (!servicio) {

            return res.status(404).send(
                "Servicio no encontrado."
            );

        }


        servicio.estado = "Cancelado";

        await servicio.save();


        res.redirect("/servicios");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Error al cancelar el servicio."
        );

    }

};


//MARCAR SERVICIO COMO REALIZADO

export const realizarServicio = async (req, res) => {

    try {

        const servicio =
            await Servicio.findById(req.params.id);


        if (!servicio) {

            return res.status(404).send(
                "Servicio no encontrado."
            );

        }


        servicio.estado = "Realizado";

        await servicio.save();


        res.redirect("/servicios");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Error al marcar el servicio como realizado."
        );

    }

};


// ELIMINAR SERVICIO BUSQUEDA POR ID

export const eliminarServicio = async (req, res) => {

    try {

        const servicio =
            await Servicio.findById(req.params.id);


        if (!servicio) {

            return res.status(404).send(
                "Servicio no encontrado."
            );

        }


        await Servicio.findByIdAndDelete(
            req.params.id
        );


        res.redirect("/servicios");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Error al eliminar el servicio."
        );

    }

};


// GENERAR INFORME DE SERVICIOS POR VEHÍCULO Y RANGO DE FECHAS

export const generarInforme = async (req, res) => {

    try {

        const {

            vehiculo,
            fechaInicio,
            fechaFin

        } = req.query;


        //VALIDAR DATOS

        if (
            !vehiculo ||
            !fechaInicio ||
            !fechaFin
        ) {

            return mostrarErrorServicio(
                res,
                "Debe seleccionar un vehículo y un rango de fechas."
            );

        }


        if (fechaInicio > fechaFin) {

            return mostrarErrorServicio(
                res,
                "La fecha inicial no puede ser mayor que la fecha final."
            );

        }


        // BUSCAR VEHÍCULO POR ID

        const vehiculoEncontrado =
            await Vehiculo.findById(vehiculo);


        if (!vehiculoEncontrado) {

            return mostrarErrorServicio(
                res,
                "El vehículo seleccionado no existe."
            );

        }


        // BUSCAR SERVICIOS CON FECHAS Y VEHÍCULO

        const servicios =
            await Servicio.find({

                vehiculo,

                fecha: {

                    $gte: new Date(`${fechaInicio}T00:00:00`),

                    $lte: new Date(`${fechaFin}T23:59:59.999`)

                },

                estado: {

                    $ne: "Cancelado"

                }

            })
            .populate("vehiculo")
            .populate("conductor")
            .sort({

                fecha: 1,

                horaSalida: 1

            });


        //CALCULAR TOTAL DE PASAJEROS

        const totalPasajeros =
            servicios.reduce(

                (total, servicio) => {

                    return total +
                        Number(servicio.pasajeros || 0);

                },

                0

            );


        //CARGAR TODOS LOS SERVICIOS, VEHÍCULOS Y CONDUCTORES PARA RENDERIZAR LA VISTA

        const serviciosTodos =
            await Servicio.find()
                .populate("vehiculo")
                .populate("conductor")
                .sort({
                    fecha: 1,
                    horaSalida: 1
                });


        const vehiculos =
            await Vehiculo.find();


        const conductores =
            await Conductor.find();


        res.render("servicios", {

            servicios: serviciosTodos,

            vehiculos,

            conductores,

            error: null,

            mensaje: null,

            informe: {

                vehiculo: vehiculoEncontrado,

                fechaInicio,

                fechaFin,

                servicios,

                totalPasajeros

            }

        });

    } catch (error) {

        console.error(error);

        return mostrarErrorServicio(
            res,
            "No fue posible generar el informe."
        );

    }

};


//FUNCIÓN PARA LA FECHA 

function mismaFecha(fecha) {

    return {

        $gte: new Date(`${fecha}T00:00:00`),

        $lte: new Date(`${fecha}T23:59:59.999`)

    };

}


//MOSTRAR ERROR SEGUN EL SERVICIO

async function mostrarErrorServicio(
    res,
    mensaje
) {

    try {

        const servicios =
            await Servicio.find()
                .populate("vehiculo")
                .populate("conductor")
                .sort({
                    fecha: 1,
                    horaSalida: 1
                });


        const vehiculos =
            await Vehiculo.find();


        const conductores =
            await Conductor.find();


        return res.status(400).render(
            "servicios",
            {

                servicios,

                vehiculos,

                conductores,

                error: mensaje,

                mensaje: null,

                informe: null

            }
        );

    } catch (error) {

        console.error(error);

        return res.status(500).send(
            "Ocurrió un error inesperado."
        );

    }

}