const path = require("path");
const dotenv = require('dotenv').config();
var cors = require('cors');
const fileUpload = require("express-fileupload");
const express = require("express");
const { connect } = require('./app/database');
const category = require("./app/routes/category");
const file = require("./app/routes/file");
const post = require("./app/routes/post");
const role = require("./app/routes/role");
const user = require("./app/routes/user");
const site = require("./app/routes/site");
const { logInStepOne } = require("./app/controllers/user");
const { logInStepTwo } = require("./app/controllers/user");
const permission = require("./app/routes/permission");
const { config } = require("./app/utils/sms");

const { checkRoutePermission } = require("./app/middlewares/checkAuth");

(async () => {
  const app = await express();


  //SMS config
  config();

  //* BodyPaser
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  //* File Upload Middleware
  app.use(fileUpload());


  app.use(cors());

  //* Static Folder
  app.use(express.static(path.join(__dirname, "app", "public")));


  //* Routes
  app.use(checkRoutePermission);
  app.use("/logInStepOne", logInStepOne);
  app.use("/logInStepTwo", logInStepTwo);
  app.use("/site", site);

  app.use("/user", user);
  app.use("/role", role);
  app.use("/permission", permission);
  app.use("/category", category);
  app.use("/post", post);
  app.use("/file", file);

  //* 404 Page
  // app.use(require("./controllers/errorController").get404);

  //* Database connection
  await connect(app);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  });

})();

