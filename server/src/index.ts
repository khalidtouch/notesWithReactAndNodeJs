import express, { Request, Response } from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

app.get("/api/notes", async (req: Request, res: Response) => {
    const notes = await prisma.note.findMany();
    res.json({ message: "success!", result: notes })
})

app.post("/api/notes", async (req: Request, res: Response) => {
    const { title, content } = req.body;

    if (!title || !title) {
        return res.status(200).send("title and content fields required")
    }

    try {
        const note = await prisma.note.create({
            data: { title, content },
        });
        res.json(note)
    } catch (err) {
        res.status(200).send("Oops, something went wrong")
    }
})

app.put("/api/notes/:id", async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(200).send("ID must be a valid number")
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content },
        });
        res.json(updatedNote);
    } catch (err) {
        res.status(200).send("Oops, something went wrong!")
    }
})

app.delete("/api/notes/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(200).send("ID field required")
    }

    try {
        await prisma.note.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (err) {
        res.status(200).send("Ooops, something went wrong")
    }
})


const port: number = Number(process.env.PORT) || 8080

app.listen(port, () => {
    console.log(`Server running on cloud:${port}`)
})