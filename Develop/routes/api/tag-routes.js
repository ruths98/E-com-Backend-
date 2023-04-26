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
    const tagData = await Tag.findByPk(req.params.id, {//finds tag by id and shows related product
      include: ProductTag
    });

    if(!tagData) {
      res.status(404).json({message:'No tag with this id, please try again.'})
      return;
    }
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err);
  }
});

router.post('/', async(req, res) => {
  try{
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  }catch(err){
    res.status(400).json(err)
  }
});

router.put('/:id', async(req, res) => {
  try{
    const tagData = await Tag.update({
      where: {
        id: req.params.id
      }
    });
    if(!tagData)  {
      res.status(404).json({message: "No Tag with this id to update!"});
      return;
    }
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err)
  }
});

router.delete('/:id', async(req, res) => {
  try{
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!tagData) {
      res.status(404).json({message:'No tag with this id to exists to delete!'});
      return;
    }
    res.status(200).json(tagData);
  }catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
