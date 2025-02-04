const express = require("express");
const bountyController = require("../controllers/bounty");
const { Auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/all", bountyController.getAllBounties);

router.post("/submit", bountyController.submitBountyAnswer);

router.get("/:id", bountyController.getBountyById);

router.use(Auth(["admin", "subscriber"]));

router.post("/create", bountyController.createBounty);

module.exports = router;
