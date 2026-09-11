import mongoose from "mongoose";

const conductorSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre del conductor es obligatorio"],
            trim: true,
            minlength: [2, "El nombre debe tener mínimo 2 caracteres"],
            maxlength: [50, "El nombre no puede superar los 50 caracteres"]
        },

        apellido: {
            type: String,
            required: [true, "El apellido del conductor es obligatorio"],
            trim: true,
            minlength: [2, "El apellido debe tener mínimo 2 caracteres"],
            maxlength: [50, "El apellido no puede superar los 50 caracteres"]
        },

        documento: {
            type: String,
            required: [true, "El documento es obligatorio"],
            unique: true,
            trim: true
        },

        telefono: {
            type: String,
            required: [true, "El teléfono es obligatorio"],
            trim: true
        },

        licencia: {
            type: String,
            required: [true, "El número de licencia es obligatorio"],
            unique: true,
            trim: true
        },

        categoriaLicencia: {
            type: String,
            required: [true, "La categoría de licencia es obligatoria"],
            enum: {
                values: ["C1", "C2", "C3"],
                message: "La categoría debe ser C1, C2 o C3"
            }
        },

        estado: {
            type: String,
            enum: {
                values: ["Activo", "Inactivo"],
                message: "El estado debe ser Activo o Inactivo"
            },
            default: "Activo"
        }
    },
    {
        timestamps: true
    }
);

const Conductor = mongoose.model("Conductor", conductorSchema);

export default Conductor;