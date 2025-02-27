const router = require("express").Router();
const { getUsers, getCurrentUser } = require("../controllers/user");

router.get("/", getUsers);

router.get("/me", getCurrentUser);

module.exports = router;
