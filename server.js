 const express =require("express")
 const app =express()
 const mongoose =require("mongoose")
 require("dotenv").config();
 const cors =require("cors")
 const bodyParser =require ('body-parser')


 const PORT = process.env.PORT || 8000;


const productRoute =require("./apis/routes/product")
const userRoute =require("./apis/routes/user")


mongoose
  .connect(process.env.DB_CONNECTION, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => {
    console.log("success connected to db");
  })
  .catch((error) => {
    console.log("this is err",error);
  });

mongoose.Promise = global.Promise;


app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

 app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type",
      "Accept",
      "Authorization"
    );
  
    next();
  });



  // app.use((req, res, next) => {
  //   const error = new Error("wrong route input, you are lost in space");
  //   error.status = 404;
  //   next(error);
  // });
  // app.use((error, req, res, next) => {
  //   res.status(error.status || 500);
  //   res.json({
  //     error: {
  //       error: error.message,
  //     },
  //   });
  // });
app.use ("/product", productRoute)
app.use ("/user", userRoute)

 app.listen (PORT,()=>console.log(`app is running on port ${PORT}`))

 module.exports=app