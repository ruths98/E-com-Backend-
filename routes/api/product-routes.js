const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//show all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        Category,
        {
       model: Tag,
       through: ProductTag, 
      }
    ]
    });//should display all products and category and tag data
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }

});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {//finds a product via the id and shows the category and tag info
      include: [
        Category,
        {  
          model: Tag,
           through: ProductTag
           }
      ]
    });
    if (!productData) {
      res.status(404).json({ message: 'No product with this id found' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  const { product_name, price, stock, tagId, category_Id } = req.body;
  try {
    const newProduct = await Product.create(req.body)
      ((product) => {
        // if there's product tags, we need to create pairings to bulk create in the ProductTag model
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
        }
        // if no product tags, just respond
        res.status(200).json(product);
      })
      ((productTagIds) => res.status(200).json(productTagIds))
      }catch(err) {
        console.log(err);
        res.status(400).json(err);
      };
});

// the put route will update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { product_name, price, stock, tagId, category_Id } = req.body;

  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    
    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// delete a product by id
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      res.status(404).json({ message: 'No product with this id to delete. Please try another id.' })
    }
    res.status(500).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
