const express = require("express");
const app = require("../../server");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Account already exist for this Email",
        });
      } else {
        const { password } = req.body;
        if (password.length < 6) {
          res
            .status(400)
            .json({ errors: "Password should be atleast 6 characters long" });
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            bcrypt.compare(password, user.password, () => {
              if (err) {
                return res.status(500).json({
                  message: "Incorrect credentials",
                });
              } else {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  name: req.body.name,
                  email: req.body.email,
                  password: hash,
                  confirmPassword: hash,
                  phoneNumber: req.body.phoneNumber,
                });
                user

                  .save()

                  .then((result) => {
                    const adminEmail = "catherine@gmail.com";
                    const role = user.email === adminEmail ? "admin" : "user";
                    const token = jwt.sign(
                      {
                        email: user.email,
                        userId: user._id,
                        role,
                      },
                      process.env.JWT_KEY,
                      {
                        expiresIn: "1h",
                      }
                    );
                    return res.status(201).json({
                      message: "New User Created",
                      token: token,
                    });
                  })
                  .catch((e) => {
                    res.status(404).json({ message: "you are lost in space" });
                  });
              }
            });
          });
        }
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Incorrect credentials",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Incorrect credentials",
          });
        }
        if (result) {
          const adminEmail = "catherine@gmail.com";
          const role = user[0].email === adminEmail ? "admin" : "user";
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              role,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          // const decoded = jwt.verify(token, process.env.JWT_KEY);
          return res.status("200").json({
            message: "login successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Incorrect credentials",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "please check and correct the required fields",
      });
    });
});

router.get("/",(req,res)=>{
  res.send("this is the user")
})

module.exports = router;
