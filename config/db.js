if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://joaohenryquecunha:jhsc2012@blog-app.i3vdvup.mongodb.net/?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://127.0.0.1:27017/blogapp"}
}