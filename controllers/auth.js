const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = response) => {
    const {  email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({email});
        console.log(usuario);
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            msg: 'Usuario creado correctamente',
            uid: usuario.id,
            name: usuario.name,
            token
        });        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
}

const loginUsuario = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({email});

            if(!usuario){
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no existe con ese email'
                })
            }
        //Confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password); //comparo el password que el usuario introduce con el guardado en la bd
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es correcta'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            msg: 'Login',
            uid: usuario.id,
            name: usuario.name,
            token
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
    
}

const revalidarToken = async(req, res = response) => {
    const {uid, name} = req;

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid, name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}