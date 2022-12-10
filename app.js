// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require('mongoose')
    const session = require("express-session")
    const flash = require("connect-flash")
    require("./models/Postagens")
    const Postagem = mongoose.model("postagens")

// Configurações
    // Sessão
        app.use(session({
            secret: "cursoddenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middlewere
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })    
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
app.get('/', (req, res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).lean().then((postagens) => {
        res.render("index", {postagens: postagens})
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })
})    

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
        if(postagem){
            res.render("Postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect("/")
        }
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send('erro 404!')
})


    


app.get('/posts', (req, res) => {
    res.send("lista de posts")
})
        app.use('/admin', admin)
// Outros
const PORT = 27017
app.listen(PORT,() => {
    console.log("Servidor rodando! ")
})