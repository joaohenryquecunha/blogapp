// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require('mongoose')

// Configurações
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars',handlebars.engine({default: 'main'}))
        app.set('view engine', 'handlebars')  
    // Mongoose  
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://127.0.0.1:27017/blogapp").then(() => {
            console.log("Conectado ao MongoDB")
        }).catch((erro) => {
            console.log("Erro ao conectar: "+erro)
        }) 
    // Public
        app.use(express.static(path.join(__dirname,"public")))     
// Rotas
        app.use('/admin', admin)
// Outros
const PORT = 27017
app.listen(PORT,() => {
    console.log("Servidor rodando! ")
})