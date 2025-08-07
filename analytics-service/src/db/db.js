import { Sequelize, DataTypes } from 'sequelize';

const {
  MYSQL_HOST     = 'dpg-d25dh87diees73bojvtg-a',  
  MYSQL_PORT     = 5432,                          
  MYSQL_USER     = 'analytics_user',
  MYSQL_PASSWORD = 'oQwdoEJvYiqG9Fxjqr0WgH3P2LvHHdg2',
  MYSQL_DB       = 'analytics_xd1b',
  DIALECT = 'mysql',
} = process.env;

const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: DIALECT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export const OrdersFact = sequelize.define('orders_fact', {
  orderId: {
    type: DataTypes.STRING(24),
    allowNull: false,
    comment: 'Mongo ObjectId',
    primaryKey: true,
  },
  vendorId: {
    type: DataTypes.STRING(64),
    allowNull: false,
    index: true,
  },
  productId: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'unit price',
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'quantity × price',
  },
  orderStatus: {
    type: DataTypes.ENUM(
      'pending',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled'
    ),
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'from createdAt',
  },
  loadTimestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'ETL load time',
  },
}, {
  tableName: 'orders_fact',
  timestamps: false,
  indexes: [
    { fields: ['vendorId', 'orderDate'] },
    { unique: true, fields: ['orderId', 'productId'] },
  ],
});

export default sequelize;
