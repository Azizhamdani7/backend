const express = require("express");
const router = express.Router();
const {
  contactUs,
  getAllContacts,
  searchContactsByFirstName,
  searchByEmail,
} = require("../controllers/contactController");

router.post("/contactus", contactUs);
router.get("/getallcontacts", getAllContacts);
router.get("/search/:name", searchContactsByFirstName);
router.get("/emailsearch/:email", searchByEmail);

module.exports = router;
