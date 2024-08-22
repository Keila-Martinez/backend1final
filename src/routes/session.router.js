import { Router } from "express";
import UsuarioModel from "../dao/models/usuarios.model.js";
import { createHash, isValidPassword } from "../util/util.js";
import Cart from "../dao/models/cart.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();
const JWT_SECRET = "coderhouse";

// Ruta de registro
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const existingUser = await UsuarioModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const cart = new Cart();
        await cart.save();

        const newUser = new UsuarioModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cart._id,
        });

        await newUser.save();

         //Generar el token de JWT: 
         const token = jwt.sign({ email: newUser.email, rol: newUser.rol }, "coderhouse", { expiresIn: "1h" });

         //Generamos la cookie: 
         res.cookie("coderCookieToken", token, {
             maxAge: 3600000, //1 hora de vida
             httpOnly: true //recuerdo que esto es para que solo sea accesible mediante peticiones http. 
         })

         res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/login", passport.authenticate("login", { session: false }), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UsuarioModel.findOne({ email });
        if (!user || !isValidPassword(password, user)) {
            return res.status(401).send("Credenciales incorrectas");
        }

        // Generar token JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, "coderhouse", { expiresIn: "1h" });

        // Enviar cookie con el token
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, // 1 hora
            httpOnly: true,
        });

        res.redirect("/products");
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta protegida
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
  });
  

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

export default router;
