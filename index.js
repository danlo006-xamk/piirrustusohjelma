"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const apiCanvasRouter_1 = __importDefault(require("./routes/apiCanvasRouter"));
const apiShapesRouter_1 = __importDefault(require("./routes/apiShapesRouter"));
const virhekasittelija_1 = __importDefault(require("./errors/virhekasittelija"));
const portti = Number(process.env.PORT);
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use("/api/canvases", apiCanvasRouter_1.default);
app.use("/api/canvases", apiShapesRouter_1.default);
app.use(virhekasittelija_1.default);
app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
});
app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin : ${portti}`);
});
