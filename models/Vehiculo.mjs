import mongoose from "mongoose";

const vehiculoSchema = new mongoose.Schema(
    {
        placa: {
            type: String,
            required: [true, "La placa es obligatoria"],
            unique: true,
            uppercase: true,
            trim: true
        },

        tipo: {
            type: String,
            required: [true, "El tipo de vehículo es obligatorio"],
            enum: {
                values: ["Bus", "Buseta", "Camioneta"],
                message: "El tipo debe ser Bus, Buseta o Camioneta"
            }
        },

        marca: {
            type: String,
            required: [true, "La marca es obligatoria"],
            trim: true
        },

        modelo: {
            type: Number,
            required: [true, "El modelo es obligatorio"],
            min: [1990, "El modelo no puede ser menor a 1990"],
            max: [2030, "El modelo no puede ser mayor a 2030"]
        },

        capacidad: {
            type: Number,
            required: [true, "La capacidad de pasajeros es obligatoria"],
            min: [1, "La capacidad debe ser mayor a 0"]
        },

        color: {
            type: String,
            trim: true
        },

        estado: {
            type: String,
            enum: {
                values: [
                    "Disponible",
                    "En servicio",
                    "En mantenimiento",
                    "Inactivo"
                ],
                message: "Estado de vehículo no válido"
            },
            default: "Disponible"
        },

        conductor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conductor",
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Vehiculo = mongoose.model("Vehiculo", vehiculoSchema);

export default Vehiculo;