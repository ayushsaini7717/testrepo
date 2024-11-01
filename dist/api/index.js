"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = 3000;
const app = (0, express_1.default)();
const userRoute_1 = __importDefault(require("./userRoute"));
const expenseRoute_1 = __importDefault(require("./expenseRoute"));
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use('/api/v1/user', userRoute_1.default);
app.use('/api/v1/expense', expenseRoute_1.default);
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
