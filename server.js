if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const scoreRoutes = require("./routes/scoreRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const port = 8080;
const dbUrl = process.env.ATLAS_URL;
const secret = process.env.SECRET;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:secret,
    },
    touchAfter: 24 * 3600,
});

store.on("error",() =>{
    console.log("error in mongo session store",err);
});

const sessionOptions = {
    store,
    secret:secret,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));



mongoose.connect(dbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use("/simongame", scoreRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/simongame`);
});
