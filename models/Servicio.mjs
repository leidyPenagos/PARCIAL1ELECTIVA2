import mongoose from "mongoose";

const servicioSchema = new mongoose.Schema(
    {
        fecha: {
            type: Date,
            required: [true, "La fecha del servicio es obligatoria"]
        },

        horaSalida: {
            type: String,
            required: [true, "La hora de salida es obligatoria"]
        },

        horaRegreso: {
            type: String,
            required: [true, "La hora de regreso es obligatoria"]
        },

        origen: {
            type: String,
            required: [true, "El lugar de origen es obligatorio"],
            trim: true
        },

        destino: {
            type: String,
            required: [true, "El destino es obligatorio"],
            trim: true
        },

        tipoEvento: {
            type: String,
            required: [true, "El tipo de evento es obligatorio"],
            enum: {
                values: [
                    "Actividad complementaria",
                    "Visita académica",
                    "Comisión",
                    "Otro"
                ],
                message: "Tipo de evento no válido"
            }
        },

        pasajeros: {
            type: Number,
            required: [true, "El número de pasajeros es obligatorio"],
            min: [1, "Debe existir al menos un pasajero"]
        },

        vehiculo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehiculo",
            required: [true, "Debe seleccionar un vehículo"]
        },

        conductor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conductor",
            required: [true, "Debe seleccionar un conductor"]
        },

        solicitante: {
            type: String,
            required: [true, "El solicitante es obligatorio"],
            trim: true
        },

        descripcion: {
            type: String,
            trim: true
        },

        estado: {
            type: String,
            enum: {
                values: [
                    "Programado",
                    "Realizado",
                    "Cancelado"
                ],
                message: "Estado del servicio no válido"
            },
            default: "Programado"
        }
    },
    {
        timestamps: true
    }
);

const Servicio = mongoose.model("Servicio", servicioSchema);

export default Servicio;