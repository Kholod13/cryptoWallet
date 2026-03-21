/* eslint-disable */
import dotenv from 'dotenv';
import path from 'path';
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import ccxt from "ccxt";

const app = express();

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://syncspace-five.vercel.app'
        : 'http://localhost:5173'
}));
app.use(express.json({ limit: '10mb' }));

const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = decoded; // Добавляем данные юзера в запрос
        next();
    });
};

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
        const { username, profession, avatarUrl, mainCurrency, theme } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                username,
                profession,
                avatarUrl,
                mainCurrency,
                theme
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

// --- РОУТ ПОЛУЧЕНИЯ ВСЕХ КОШЕЛЬКОВ ЮЗЕРА ---
app.get('/api/wallets', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        // Ищем кошельки, где userId совпадает с ID из токена
        const wallets = await prisma.account.findMany({
            where: { userId: decoded.userId }
        });

        res.json(wallets);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// --- РОУТ СОХРАНЕНИЯ КОШЕЛЬКА ---
app.post('/api/wallets/add', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const data = req.body;

        const newWallet = await prisma.account.create({
            data: {
                userId: decoded.userId, // Привязываем к юзеру
                label: data.label,
                type: data.type,
                platform: data.platform,
                apiKey: data.apiKey,
                apiSecret: data.apiSecret,
                passphrase: data.passphrase,
                color: data.color,
            }
        });

        res.status(201).json(newWallet);
    } catch (error) {
        res.status(500).json({ message: "Error saving wallet" });
    }
});

// --- РОУТ УДАЛЕНИЯ ---
app.delete('/api/wallets/:id', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        await prisma.account.deleteMany({
            where: {
                id: req.params.id,
                userId: decoded.userId // Проверка, что юзер удаляет СВОЙ кошелек
            }
        });
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

app.post('/api/wallet/scan', authenticateToken, async (req: any, res: Response) => {
    //const { apiKey } = req.body;

        // --- РЕЖИМ РАЗРАБОТКИ (MOCK DATA) ---
        // Если ты хочешь работать над UI без запросов к Moralis,
        // просто раскомментируй этот блок:

    const mockAssets = [
        { symbol: 'eth', amount: 0.1, price: 2077, usdValue: 207 },
    ];
    console.log("!!! РАБОТА В MOCK-РЕЖИМЕ (ЛИМИТЫ ЭКОНОМЯТСЯ) !!!");
    return res.json({ assets: mockAssets });

    // ------------------------------------

    // try {
    //     const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
    //     const chains = ['eth', 'bsc']; // Оставляем минимум
    //
    //     const scanChain = async (chain: string) => {
    //         const url = `https://deep-index.moralis.io/api/v2.2/wallets/${apiKey}/tokens?chain=${chain}`;
    //         const response = await fetch(url, {
    //             headers: { 'X-API-Key': MORALIS_API_KEY as string }
    //         });
    //
    //         // Если пришла ошибка лимита (429 или 403 с сообщением о плане)
    //         if (response.status === 429 || response.status === 403) {
    //             throw new Error("API_LIMIT_REACHED");
    //         }
    //
    //         const data: any = await response.json();
    //         return (data.result || []).map((t: any) => ({
    //             symbol: t.symbol.toLowerCase(),
    //             amount: parseFloat(t.balance_formatted),
    //             price: t.usd_price || 0,
    //             usdValue: parseFloat(t.usd_value || "0")
    //         }));
    //     };
    //
    //     const results = await Promise.all(chains.map(c => scanChain(c)));
    //     const allAssets = results.flat().filter(a => a.amount > 0);
    //
    //     res.json({ assets: allAssets });
    //
    // } catch (error: any) {
    //     if (error.message === "API_LIMIT_REACHED") {
    //         // Если лимит кончился, отдаем хотя бы что-то, чтобы фронт не вис
    //         return res.status(429).json({
    //             message: "Moralis limit reached. Using cached/empty data.",
    //             assets: []
    //         });
    //     }
    //     res.status(500).json({ message: error.message });
    // }

});

// app.listen(PORT, () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

export default app;