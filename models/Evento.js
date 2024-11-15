const {Schema, model} = require('mongoose');

const EventoSchema = Schema({
    title: {
        type:String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, //así decimos a mongoose que va a ser una referencia
        ref: 'Usuario', //el nombre de la referencia
        required: true
    }
});

EventoSchema.method('toJSON', function(){ //accedo al objeto
    const {__v, _id, ...object} = this.toObject(); //extraigo las propiedades que quiero sacar y dejo lo demás
    object.id = _id;
    return object;
});

module.exports = model('Evento', EventoSchema);