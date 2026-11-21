require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const storage =
  env === 'production'
    ? process.env.PROD_DB_STORAGE || path.join(__dirname, 'music_library_prod.db')
    : process.env.DB_STORAGE || path.join(__dirname, 'music_library.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(storage),
  logging: false
});

const Track = sequelize.define(
  'Track',
  {
    trackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    songTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    artistName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    albumName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'tracks',
    timestamps: false
  }
);

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync();
    console.log('Database and Track table created successfully.');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { sequelize, Track };
