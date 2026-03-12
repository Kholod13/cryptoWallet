import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import ccxt from "ccxt";

const app = express();


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json());

// Простой ответ на главной странице http://localhost:5000
app.get('/', (req, res) => {
    res.send('API is working! Try POST to /api/auth/register');
});

// Роут для проверки связи
app.get('/api/auth/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// --- registration route ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Проверяем, нет ли уже такого пользователя
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or username already exists" });
        }

        // 2. Хешируем пароль (превращаем "12345" в абракадабру "$2b$10$...")
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Сохраняем в базу
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                // Начальные настройки
                profession: "Crypto Enthusiast",
                mainCurrency: "USD"
            }
        });

        // 4. Генерируем токен, чтобы пользователь сразу стал "залогиненным"
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Отправляем данные (кроме пароля!)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// --- РОУТ ЛОГИНА ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Ищем пользователя
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 2. Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. Создаем токен
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// --- ПОЛУЧЕНИЕ ПРОФИЛЯ (по токену) ---
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) return res.status(404).json({ message: "User not found" });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// --- ОБНОВЛЕНИЕ ПРОФИЛЯ ---
app.patch('/api/user/update', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        // ВАЖНО: Принимаем данные из тела запроса
        const { username, profession, avatarUrl, mainCurrency } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                username,
                profession,
                avatarUrl,
                mainCurrency // Добавляем обновление валюты
            }
        });

        // ОБЯЗАТЕЛЬНО отправляем обновленного юзера назад
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
});
//connect OKX BINANCE
// Роут для получения балансов с биржи
app.post('/api/exchange/balances', async (req, res) => {
    try {
        const { platform, apiKey, apiSecret, passphrase } = req.body;

        // Инициализация биржи через CCXT
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const exchange = new ccxt[platform]({
            apiKey: apiKey,
            secret: apiSecret,
            password: platform === 'okx' ? passphrase : undefined, // Только для OKX
            enableRateLimit: true,
        });

        const rawBalance = await exchange.fetchBalance();

        // Фильтруем активы, оставляя только те, где баланс > 0
        const assets = Object.entries(rawBalance.total)
            .filter(([_, amount]) => (amount as number) > 0)
            .map(([symbol, amount]) => ({
                symbol: symbol.toLowerCase(), // Храним в нижнем регистре для сопоставления
                amount: amount,
            }));

        res.json({ assets });
    } catch (error: any) {
        res.status(500).json({ message: "Exchange connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});