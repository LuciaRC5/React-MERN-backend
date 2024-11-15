const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    //Recibir el jwt
    const token = req.header('x-token');

    //Validar el token
    //Si no hay token o es null
    if(!token){
        return res.status(401).json ({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }
    //Si hay token
    try {
        const {uid, name} = jwt.verify( //desestructuro el uid y el name del payload
            token,
            process.env.SECRET_JWT_SEED
        );
        req.uid = uid;
        req.name = name;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
    next();
}

module.exports = {
    validarJWT
}