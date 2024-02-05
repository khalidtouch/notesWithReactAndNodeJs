"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const prisma = new client_1.PrismaClient();
app.get("/api/notes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notes = yield prisma.note.findMany();
    res.json({ message: "success!", result: notes });
}));
app.post("/api/notes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    if (!title || !title) {
        return res.status(200).send("title and content fields required");
    }
    try {
        const note = yield prisma.note.create({
            data: { title, content },
        });
        res.json(note);
    }
    catch (err) {
        res.status(200).send("Oops, something went wrong");
    }
}));
app.put("/api/notes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(200).send("ID must be a valid number");
    }
    try {
        const updatedNote = yield prisma.note.update({
            where: { id },
            data: { title, content },
        });
        res.json(updatedNote);
    }
    catch (err) {
        res.status(200).send("Oops, something went wrong!");
    }
}));
app.delete("/api/notes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(200).send("ID field required");
    }
    try {
        yield prisma.note.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (err) {
        res.status(200).send("Ooops, something went wrong");
    }
}));
const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`Server running on cloud:${port}`);
});
