import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
});
router.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'All Tours',
  });
});

export default router;
