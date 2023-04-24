const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
//displays all tag and relative product data
router.get('/', async(req, res) => {
  try{
    const tagData = await Tag.findAll({
      include:[{
        model:Product,
        where: {id: Sequelize.col('Tag.Product_id')}//from chatGPT.
      }]
    })
    res.status(200).json(tagData);
  }catch (err){
    res.status(500).json(err);
  }
});

router.get('/:id', async(req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id);

    if(!tagData) {
      res.status(404).json({message:'No tag with this id, please try again.'})
      return;
    }
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
