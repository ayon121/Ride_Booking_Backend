import { Router } from "express"
import { createContact, getAllContacts } from "./contact.controller"
import { Role } from "../user/user.interface"
import { checkAuth } from "../../Middlewares/CheckAuth"

const Contactrouter = Router()

// POST /api/contact → create new contact
Contactrouter.post("/", createContact)

// GET /api/contact → get all contacts
Contactrouter.get("/", checkAuth( Role.ADMIN, Role.SUPER_ADMIN)  , getAllContacts)

export default Contactrouter
