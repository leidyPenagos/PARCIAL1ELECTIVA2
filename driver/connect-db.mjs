import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Atlas conectado correctamente");
    } catch (error) {
        console.error("Error al conectar MongoDB:", error.message);
    }
};

export default connectDB; 