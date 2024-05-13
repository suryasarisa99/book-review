const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  console.log("Authenticating the user");
  console.log(JSON.stringify(req.session));
  //Write the authenication mechanism here

  const token = req.session.authorization?.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  jwt.verify(token, "fingerprint_customer", (err, user) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    console.log(`decoded user: ${JSON.stringify(user)}`);
    req.username = user.data;
    next();
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
