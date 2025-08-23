import { Request, Response } from "express"
import { Contact } from "./contact.model"

// Create a new contact
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." })
    }

    const newContact = await Contact.create({ name, email, subject, message })
    res.status(201).json({ success: true, data: newContact })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error })
  }
}

//  Get all contacts
export const getAllContacts = async (_req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: contacts })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error })
  }
}
