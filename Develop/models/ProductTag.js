const { Model, DataTypes } = require('sequelize');
const Tag = require('./Tag')
const Product = require('./Product')

const sequelize = require('../config/connection');

class ProductTag extends Model { }

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true

    },
    tag_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {//reference id from tag table
        model: Tag,
        key: 'id'
      }

    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {//reference id from product table
        model: Product,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);



module.exports = ProductTag;
