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
const product = require("./app/routes/product");
const history = require("./app/routes/history");
const { logInStepOne } = require("./app/controllers/user");
const { logInStepTwo } = require("./app/controllers/user");
const permission = require("./app/routes/permission");
const { config } = require("./app/utils/sms");
const { goldPriceService } = require('./app/services/goldPrice');
const { getProductPrices } = require('./app/controllers/product');
const { backUpService } = require('./app/services/backUp');


const { checkRoutePermission } = require("./app/middlewares/checkAuth");

(async () => {
  const app = await express();
  const http = require('http');
  const server = http.createServer(app);

  const { Server } = require("socket.io");

  const io = new Server(server, {
    cors: {
      // origin: [process.env.PORT_UI, process.env.BASE_URL]
      origin: "*"
    }
  });

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

  app.use("/user", user);
  app.use("/role", role);
  app.use("/permission", permission);
  app.use("/category", category);
  app.use("/post", post);
  app.use("/file", file);
  app.use("/product", product);
  app.use("/history", history);

  //* 404 Page
  // app.use(require("./controllers/errorController").get404);

  //* Database connection
  await connect(app);

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);

    goldPriceService();
    backUpService();
    global.io = io;

    io.on('connection', async (socket) => {
      console.log('User connected with id: ' + socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected with id: ' + socket.id);
      });

      io.to(socket.id).emit("apiData", global.apiData);
      const productPrices = await getProductPrices();
      io.to(socket.id).emit("productPrices", productPrices);

    });

  });
})();

