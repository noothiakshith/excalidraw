import express from 'express';
const router = express();
import z from 'zod';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Please enter at least 6 characters'),
});

const loginschema = z.object({
    email:z.string().email(),
    password:z.string().min(6,'enter')
})

router.post('/register', async (req, res) => {
  try {
    const parsedData = userSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ error: parsedData.error.errors });
    }
    const { email, password } = parsedData.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginschema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router