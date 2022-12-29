const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome:{
        type: String,
        require: true
    },
    eAdmin:{
        type:Number,
        default:0
    },
    email:{
        type: String,
        require: true
    },
    senha:{
        type: String,
        require: true
    }
})

module.exports = mongoose.model("usuarios", Usuario)