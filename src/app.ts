import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from 'passport'
import LoggerStream from "./Logging/LoggerStream";
import userRouter from "./Routers/userRouter"
import config from "../config/DATABASE_CONFIG";

const User = 'user'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('common', { stream: LoggerStream}))
app.use(passport.initialize())
app.use(passport.session())

mongoose
.connect(
  config[app.settings.env],
  { useNewUrlParser: true }
)
.catch(err => console.log(err.message));

app.use(`/${User}`, userRouter)


export default app
