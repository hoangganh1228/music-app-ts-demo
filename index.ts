import express, { Express } from "express";
import dotenv from "dotenv";
import * as database from "./config/database"

import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route"

import { systemConfig } from "./config/config";
import path from "path";
import bodyParser from "body-parser";
dotenv.config();

database.connect();

const app: Express = express();
const port: number = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", "./views");
app.set("view engine", "pug");

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE

// Routes Admin
adminRoutes(app);

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

clientRoutes(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});