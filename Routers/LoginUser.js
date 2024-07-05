const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');
const jwtSecret = "HaHa"
const User = require('../Models/userModel');

// Validator to validate 

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        console.log('password: ',password);
        console.log('email: ',email);

        let success = false
        // let user = users.find((user) => user.email == email);
        const user = await User.findOne({ email });
        
        console.log(user);
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        console.log('Password: ',pwdCompare);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const payload = { user_id: user.user_id, email: user.email };
        
        success = true;
        const authToken = jwt.sign(payload, jwtSecret);
        res.json({ success, authToken })


    } catch (error) {
        console.log(error);
        return res.json({ success: false });
    }

})

module.exports = router;