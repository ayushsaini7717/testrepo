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
// import jwt, { JwtPayload } from 'jsonwebtoken';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const IsloggedIn_1 = __importDefault(require("../middlewares/IsloggedIn"));
const verfication_1 = __importDefault(require("../middlewares/verfication"));
const router = express_1.default.Router();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
router.use(express_1.default.json());
router.post('/signup', verfication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield prisma.user.create({
            data: {
                username: body.username,
                password: body.password,
                monthlyBudget: body.monthlyBudget
            }
        });
        const token = jsonwebtoken_1.default.sign(body.username, 'ayush-secret');
        return res.json({
            token: token,
            userId: user.id
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            msg: "Something went wrong"
        });
    }
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                username: body.username,
                password: body.password
            }
        });
        if (!user) {
            return res.send(`User does'nt exist`);
        }
        const token = jsonwebtoken_1.default.sign(body.username, 'ayush-secret');
        return res.json({
            token: token,
            userId: user.id
        });
    }
    catch (e) {
        console.log(e);
        return res.send('Incorrect username or password');
    }
}));
router.post('/addincome', IsloggedIn_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let Id = req.body.userId;
    try {
        const addincome = yield prisma.user.update({
            where: {
                id: Id,
            }, data: {
                monthlyBudget: { increment: body.amount }
            }
        });
        return res.json({
            msg: "Done!"
        });
    }
    catch (e) {
        console.log(e);
        return res.send("money not added!");
    }
}));
router.get('/check', (req, res) => {
    return res.json({
        msg: 'working!'
    });
});
exports.default = router;
