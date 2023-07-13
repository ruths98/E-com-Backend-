const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try{
    const categoryData = await Category.findAll({
      include: Product
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err)
  }
  
});

router.get('/:id', async (req, res) => {
  try{
    const categoryData = await Category.findByPk(req.params.id, {// to find a category with the associated id
      include: [
         {
          model: Product
        }]//make sure this is right to include associated Product(s)
    });
    if (!categoryData){//if not an existing category id, error message
      res.status(404).json({message: 'Try an existing category!'});
      return;
    }

res.status(200).json(categoryData);
  }catch{
    res.status(500).json(err);
  }
  
 
});
// to make a new category
router.post('/', async (req, res) => {
  try{
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  }catch(err){
    res.status(400).json(err)
  }
});
//POST makes a new one, put updates. here we update using the id
router.put('/:id', async (req, res) => {
  try{
    const categoryData = await Category.update({
      where: {
        id: req.params.id
      }
    });
    if(!categoryData)  {
      res.status(404).json({message: "No category with this id to update!"});
      return;
    }
    res.status(200).json(categoryData);
  }catch(err){
    res.status(500).json(err)
  }
});
//identifying the category by its id, we will delete it
router.delete('/:id', async (req, res) => {
  try{
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!categoryData) {
      res.status(404).json({message:'No category with this id to exists to delete!'});
      return;
    }
    res.status(200).json(categoryData);
  }catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
