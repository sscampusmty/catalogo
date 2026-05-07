import jwt from 'jsonwebtoken';

export default function GenerateToken(UID: string): string {
    const payload = { uid: UID };
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY is not defined in the environment variables.");
    }
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1m' });

    return token;
}