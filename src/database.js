import mongoose from "mongoose"; 



mongoose.connect("mongodb+srv://Keilaproyecto:coderhouse@codercluster.vnfyqhe.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=codercluster")
    .then( () => console.log("Conexion exitosa!")) 
    .catch( (error) => console.log("Tenemos un error", error))