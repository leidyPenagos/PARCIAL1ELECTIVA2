import mongoose from "mongoose";

const mantenimientoSchema = new mongoose.Schema(
    {
        vehiculo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehiculo",
            required: [true, "Debe seleccionar un vehículo"]
        },

        fecha: {
            type: Date,
            required: [true, "La fecha del mantenimiento es obligatoria"]
        },

        tipo: {
            type: String,
            required: [true, "El tipo de mantenimiento es obligatorio"],
            enum: {
                values: ["Preventivo", "Correctivo"],
                message: "El mantenimiento debe ser Preventivo o Correctivo"
            }
        },

        descripcion: {
            type: String,
            required: [true, "La descripción es obligatoria"],
            trim: true,
            minlength: [5, "La descripción debe tener mínimo 5 caracteres"]
        },

        costo: {
            type: Number,
            required: [true, "El costo es obligatorio"],
            min: [0, "El costo no puede ser negativo"]
        },

        kilometraje: {
            type: Number,
            min: [0, "El kilometraje no puede ser negativo"]
        },

        observaciones: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Mantenimiento = mongoose.model(
    "Mantenimiento",
    mantenimientoSchema
);

export default Mantenimiento;