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
const expense = express_1.default.Router();
expense.use(express_1.default.json());
const IsloggedIn_1 = __importDefault(require("../middlewares/IsloggedIn"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
expense.post('/spend', IsloggedIn_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let Id = req.body.userId;
    try {
        const income = yield prisma.user.findFirst({
            where: {
                id: Id
            }
        });
        let monthlyBudget = income === null || income === void 0 ? void 0 : income.monthlyBudget;
        if (monthlyBudget < body.spend) {
            return res.send("Spend money is greater than monthly budget");
        }
        const expense = yield prisma.expense.create({
            data: {
                categories: body.categories,
                spend: body.spend,
                date: body.date,
                month: body.month,
                year: body.year,
                user: {
                    connect: { id: Id }
                }
            }
        });
        return res.send("Done!");
    }
    catch (error) {
        console.log(error);
        return res.send("Can't make this transaction, Something went wrong");
    }
}));
expense.post('/totalincome', IsloggedIn_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let Id = req.body.userId;
    try {
        const User = yield prisma.user.findFirst({
            where: {
                id: Id
            }, select: {
                monthlyBudget: true
            }
        });
        return res.json({
            monthlyBudget: User === null || User === void 0 ? void 0 : User.monthlyBudget
        });
    }
    catch (e) {
        console.log(e);
        return res.send("something went wrong");
    }
}));
expense.post('/totalexpense', IsloggedIn_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let totalexpense = 0;
    let Id = req.body.userId;
    const date = new Date();
    const currmonth = date.getMonth() + 1;
    const Expense = yield prisma.expense.findMany({
        where: {
            userId: Id,
            month: currmonth
        }
    });
    for (let i = 0; i < Expense.length; i++) {
        totalexpense += Expense[i].spend;
    }
    return res.json({
        "totalexpense": totalexpense
    });
}));
expense.post('/monthlyexpense', IsloggedIn_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let totalexpense = 0;
    let Id = req.body.userId;
    const date = new Date();
    const userExpense = yield prisma.expense.findMany({
        where: {
            userId: Id,
            year: date.getFullYear()
        }
    });
    let arr = new Array(12).fill(0);
    for (let i = 0; i < userExpense.length; i++) {
        arr[userExpense[i].month - 1] += userExpense[i].spend;
    }
    return res.send(arr);
}));
expense.post('/expenselist', IsloggedIn_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let totalexpense = 0;
    let Id = req.body.userId;
    const date = new Date();
    const currmonth = date.getMonth() + 1;
    const list = yield prisma.expense.findMany({
        where: {
            userId: Id,
            month: currmonth
        },
        select: {
            spend: true,
            categories: true
        }
    });
    return res.json({
        count: list.length,
        list: list
    });
}));
exports.default = expense;
