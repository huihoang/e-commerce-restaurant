const { model, get } = require("mongoose");
const Contact = require("../models/Contact");

const createContact = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const newContact = new Contact({ name, email, subject, message });
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        res.status(500).json({ message: "Error saving contact form", error });
    }
}
const getContact = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching contacts" });
    }
}

const deleteContact = async (req, res) => {
    const { id } = req.params; // Lấy ID từ params

    try {
        const contact = await Contact.findByIdAndDelete(id); // Xoá contact theo ID

        // Nếu không tìm thấy contact
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting contact", error });
    }
}

module.exports = { createContact, getContact, deleteContact }