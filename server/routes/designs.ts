import { Router } from 'express';
import { prisma } from '../config/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Designs endpoint
router.get('/', async (req, res) => {
  try {
    const dbDesigns = await prisma.design.findMany();
    const formatted = dbDesigns.map(d => ({
      ...d,
      tags: JSON.parse(d.tags)
    }));
    res.json({ designs: formatted });
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Upload design endpoint
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'DESIGNER') {
      return res.status(403).json({ error: 'Only designers can upload designs' });
    }

    const { name, description, category, itemType, designerId, designerName, image, backImage, price, tags, isActive } = req.body;

    const design = await prisma.design.create({
      data: {
        name,
        description,
        category,
        itemType,
        designerId,
        price: parseFloat(price) || 4,
        rating: 0,
        reviews: 0,
        image,
        backImage,
        tags: JSON.stringify(tags || []),
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    res.status(201).json({ design });
  } catch (error) {
    console.error('Error creating design:', error);
    res.status(500).json({ error: 'Failed to create design' });
  }
});

// Design Pricings endpoint
router.get('/design-pricings', async (req, res) => {
  try {
    const { designId } = req.query;
    const where = designId ? { designId: designId as string } : {};
    const pricings = await prisma.designPricing.findMany({ where });
    res.json({ pricings });
  } catch (error) {
    console.error('Error fetching design pricings:', error);
    res.status(500).json({ error: 'Failed to fetch design pricings' });
  }
});

router.post('/design-pricings', async (req, res) => {
  try {
    const { designId, seamstressId, price, difficulty, timeline, notes } = req.body;
    const pricing = await prisma.designPricing.create({
      data: { designId, seamstressId, price: parseFloat(price), difficulty: parseInt(difficulty), timeline, notes }
    });
    res.status(201).json({ pricing });
  } catch (error) {
    console.error('Error creating design pricing:', error);
    res.status(500).json({ error: 'Failed to create design pricing' });
  }
});

export default router;