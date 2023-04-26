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
const client_1 = require("@prisma/client");
const virhekasittelija_1 = require("../errors/virhekasittelija");
const prisma = new client_1.PrismaClient();
const shapesRouter = express_1.default.Router();
shapesRouter.use(express_1.default.json());
shapesRouter.get("/:id/shapes", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let r = yield prisma.shapedata.findMany({
            where: {
                canvasId: Number(req.params.id)
            }
        });
        res.json(helper(r));
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
shapesRouter.post("/:id/shapes", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.shapedata.create({
            data: {
                canvasId: Number(req.params.id),
                username: (req.body.username) ? req.body.username : "Anonymous",
                type: req.body.shape.type,
                fillColor: req.body.shape.fillColor,
                strokeColor: req.body.shape.strokeColor,
                opacity: req.body.shape.opacity,
                width: req.body.shape.width,
                x1: Math.round(req.body.shape.x1),
                y1: Math.round(req.body.shape.y1),
                x2: Math.round(req.body.shape.x2),
                y2: Math.round(req.body.shape.y2)
            }
        });
        res.json(helper(yield prisma.shapedata.findMany({
            where: {
                canvasId: Number(req.params.id)
            }
        })));
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe(e));
    }
}));
shapesRouter.delete("/:id/shapes", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield prisma.shapedata.count({
        where: {
            id: Number(req.body.id)
        }
    })) {
        try {
            yield prisma.shapedata.delete({
                where: {
                    id: Number(req.body.id)
                }
            });
            res.json(helper(yield prisma.shapedata.findMany({
                where: {
                    canvasId: Number(req.params.id)
                }
            })));
        }
        catch (e) {
            next(new virhekasittelija_1.Virhe());
        }
    }
    else {
        // Shape may have been deleted by someone else
        console.log("Shape doesn't exist.");
        res.json(helper(yield prisma.shapedata.findMany({
            where: {
                canvasId: Number(req.params.id)
            }
        })));
    }
}));
const helper = (r) => {
    let shapeData = [];
    r.forEach(element => {
        shapeData.push({
            id: element.id,
            createdAt: element.createdAt,
            username: element.username,
            shape: {
                type: element.type,
                fillColor: element.fillColor,
                strokeColor: element.strokeColor,
                opacity: element.opacity,
                width: element.width,
                x1: element.x1,
                y1: element.y1,
                x2: element.x2,
                y2: element.y2
            }
        });
    });
    return shapeData;
};
exports.default = shapesRouter;
