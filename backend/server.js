const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const cors = require("cors");
const app = express();
const PORT = 8560;
const SECRET_KEY = "mysecretkey";

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true, // make the server accepts cookies with incoming req
  }));
app.use(cookieParser());



let users = [];

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};


app.post('/SignUp', async (req, res) => { 
    const { username, password } = req.body;

    console.log("📩 New account registration request received:", username, password);

    const existingUser = users.find(u => u.username === username )
    if(existingUser){
        return res.status(400).json({ error: "Username already exists" });
    }
    const hashedPassword = await hashPassword(password);  
    const newUser = { id : Date.now(), username, password: hashedPassword};
    users.push(newUser);

    res.status(201).json({ message: "User registered successfully" });
})


app.post('/SignIn', async (req, res) => {
    const { username, password } = req.body;


    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });  // JSON WEB TOKEN

    res.cookie('auth_token', token, {
        httpOnly : true,
        secure: false, // Must be true when using HTTPS
        maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.json({ message: "Login successful" });
});


    app.post('/Logout', (req, res) => {
        res.clearCookie('auth_token');
        res.json({ message: "Logged out successfully" });
        console.log("Logged out successfully")
    })

    
// ✅ Middleware to protect private pages
const authUser = (req, res, next) => {
    const token = req.cookies.auth_token;
    if(!token){
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("🔹 User data from token:", decoded);
        req.user = decoded; // Store user data in the request
        next();
    }catch (err) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
// ✅ Access to personal page (protected by Middleware)
app.get('/userprofile', authUser, (req, res) => {
    res.json({ username: req.user.username, message: `Welcome ${req.user.username} to your profile!` });
});


app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
