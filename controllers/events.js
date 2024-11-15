const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async(req, res = response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');
    res.json({
        ok:true,
        eventos
    })
}

const crearEvento = async(req, res = response) => {
    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        res.json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        //compruebo que hay evento
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        //compruebo que el que quiere actualizar es el creador del evento
        if(evento.user.toString() !== uid){ //tengo que extraerlo con toString apra que funcione la comparación
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

        //si es su evento y puede editarlo
        const nuevoEvento = {
            ...req.body,
            user: uid //en la petición no viene el id del usuario, por eso lo colocamos aquí
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new:true}); //evento a actualizar, información actualizada para el evento
        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const eliminarEvento = async(req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        //compruebo que hay evento
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        //compruebo que el que quiere eliminar es el creador del evento
        if(evento.user.toString() !== uid){ //tengo que extraerlo con toString apra que funcione la comparación
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

        await Evento.findByIdAndDelete(eventoId);
        res.json({
            ok: true,
            msg: 'El evento ha sido eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}