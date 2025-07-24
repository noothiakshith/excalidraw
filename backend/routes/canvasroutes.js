import express from 'express';
import verifyToken from '../middlewares/authmiddleware.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


router.post('/canvas/create', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const newCanvas = await prisma.canvas.create({
      data: {
        ownerId: userId,
        elements: [],
      },
    });

    return res.status(201).json({
      message: 'Canvas created successfully',
      canvas: newCanvas,
    });
  } catch (err) {
    console.error('Canvas creation failed:', err);
    return res.status(500).json({ error: 'Failed to create canvas' });
  }
});

router.post('/canvas/update', verifyToken, async (req, res) => {
  try {
    const { canvasid, elements } = req.body;
    console.log({ canvasid, elements });

    const updatedCanvas = await prisma.canvas.update({
      where: { id: canvasid },
      data: { elements },
    });

    return res.status(200).json({
      message: 'Canvas updated successfully',
      canvas: updatedCanvas,
    });
  } catch (err) {
    console.error('Canvas update failed:', err);
    return res.status(500).json({ error: 'Failed to update canvas' });
  }
});


router.get('/canvas/load/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const canvas = await prisma.canvas.findUnique({
      where: { id },
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    return res.status(200).json({ canvas });
  } catch (err) {
    console.error('Failed to load canvas:', err);
    return res.status(500).json({ error: 'Failed to load canvas' });
  }
});

router.delete('/canvas/delete/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.canvas.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Canvas deleted successfully' });
  } catch (err) {
    console.error('Failed to delete canvas:', err);
    return res.status(500).json({ error: 'Failed to delete canvas' });
  }
});

router.get('/canvas/list', verifyToken, async (req, res) => {
  try {
    const userId = req?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ownedCanvases: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ canvases: user.ownedCanvases });
  } catch (err) {
    console.error('Failed to list canvases:', err);
    return res.status(500).json({ error: 'Failed to fetch canvases' });
  }
});

router.put('/canvas/share/:id', verifyToken, async (req, res, next) => {
  try {
    const canvasId = req.params.id;
    const { email } = req.body;
    const userId = req.user.id; 

    const canvas = await prisma.canvas.findUnique({
      where: { id: canvasId },
      select: { ownerId: true }
    });

    if (!canvas || canvas.ownerId !== userId) {
      return res.status(403).json({ message: 'Only the owner can share this canvas.' });
    }

    const userToShare = await prisma.user.findUnique({
      where: { email }
    });

    if (!userToShare) {
      return res.status(404).json({ message: 'User to share with not found.' });
    }

    await prisma.canvas.update({
      where: { id: canvasId },
      data: {
        sharedWith: {
          connect: { id: userToShare.id }
        }
      }
    });

    res.json({ message: 'Canvas shared successfully.' });
  } catch (err) {
    next(err);
  }
});
export default router;
