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
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require("./routes/usuario")
    const passport = require("passport")
    require("./config/auth")(passport)
    const db = require("./config/db")
    

// Configurações
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    // Middlewere
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next();
        })    
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars',handlebars.engine({default: 'main'}))
        app.set('view engine', 'handlebars')  
    // Mongoose  
        mongoose.Promise = global.Promise
        mongoose.connect(db.mongoURI).then(() => {
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

app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("categorias/index", {categorias: categorias})
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro interno ao listar as categorias")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if(categoria) {
            Postagem.find({categoria: categoria._id}).lean().then((postagens) => {

                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

            }).catch((erro) => {
                req.flash("error_msg", "Houve um erro ao listar os posts!")
                res.redirect("/")
            })

        }else{
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/")
        }
    }).catch((erro) => {
        
        req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
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
        app.use('/usuarios', usuarios)

// Outros
const PORT = 27017
app.listen(PORT,() => {
    console.log("servidor rodando na "+(PORT))
})