/*
    Event routes
    /api/events
*/

const {Router} = require('express');
const router = Router(); //función para generar el router
const { validarJWT } = require('../middlewares/validar-jwt'); //middleware
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

//Todas tienen que pasar por la validación del JWT
router.use(validarJWT);

//Obtener eventos
router.get('/', getEventos);

//Crear evento
router.post('/',
    [
        check('title','El título es obligatorio').not().isEmpty(),
        check('start','La fecha de inicio es obligatoria').custom(isDate),
        check('end','La fecha de inicio es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento);

//Actualizar evento
router.put('/:id', actualizarEvento);

//Eliminar eventos
router.delete('/:id', eliminarEvento);

module.exports = router;