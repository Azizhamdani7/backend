const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const sendEmail = require("../utils/sendEmail");

//Post contact to database
const contactUs = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  //Validation
  if (!subject || !message) {
    res.status(400).json({ message: "Please add subject and message" });
  }
  if (!firstName || !lastName) {
    res.status(400).json({ message: "Please enter firstname and lastname" });
  }
  if (!email || !validateEmail(email)) {
    res.status(400).json({ message: "enter valid email" });
  }

  const message1 = `
  <h2>Hello ${firstName}</h2>
  <p> Thank you so much for reaching out at i2b.</p>
  <p>We will be in contact with you shortly regarding your query ${subject}</p>
  <p>Regards</p>
  <p>i2b Team</p>
  `;

  const subject1 = "Thank you for reaching out at 12b.com";
  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  // const reply_to = process.env.REPLY_TO;

  try {
    await sendEmail(subject1, message1, send_to, sent_from);
    const contact = new Contact({
      firstName,
      lastName,
      email,
      subject,
      message,
    });
    // Save the contact to the database
    const savedContact = await contact.save();

    res.status(201).json({ message: "Contact saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save contact" });
  }
}); 

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Get all contacts
const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({});
  res.status(200).json(contacts);
});

// Search contacts by firstName
const searchContactsByFirstName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  if (!name) {
    res.status(400).json({ message: "Please provide a name to search" });
    return;
  }
  const decodedName = decodeURIComponent(name);
  const matchingContacts = await Contact.find({
    firstName: { $regex: new RegExp(decodedName, "i") },
  });
  if (matchingContacts.length === 0) {
    res
      .status(404)
      .json({ message: "Couldn't find any contacts with the given name" });
    return;
  }
  res.status(200).json(matchingContacts);
});
const searchByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;
  console.log(email);
  if (!email) {
    res.status(400).json({ message: "Please provide a valid email" });
    return;
  }
  const decodedEmail = decodeURIComponent(email);
  const matchingEmail = await Contact.find({
    email: { $regex: new RegExp(decodedEmail, "i") },
  });
  if (matchingEmail.length === 0) {
    res
      .status(404)
      .json({ message: "Couldn't find any contacts with the given name" });
    return;
  }
  res.status(200).json(matchingEmail);
});

module.exports = {
  contactUs,
  getAllContacts,
  searchContactsByFirstName,
  searchByEmail,
};
