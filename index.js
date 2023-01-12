// const express = require('express');
// require('dotenv').config();
// const pg = require('pg');

// const Pool = pg.Pool;

// const connectionString = 'postgres://postgres:2202@localhost:5432/test';

// const dbConnection = new Pool({
//   connectionString,
//   ssl: false,
// });

// const app = express();

// app.get('/users', async (req, res) => {
//   const db = await dbConnection.connect();

//   try {
//     const result = await db.query('select * from users');
//     res.send(result.rows);

//     db.end();
//   } catch (e) {
//     console.log(e);
//   }
// });

// app.get('/users', async (req, res) => {
//   const db = await dbConnection.connect();

//   try {
//     const result = await db.query('select * from users');
//     res.send(result.rows);

//     db.end();
//   } catch (e) {
//     console.log(e);
//   }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });

const express = require('express');
require('dotenv').config();
const { Sequelize, DataTypes, Model } = require('sequelize');
const app = express();

const sequelize = new Sequelize('test', 'postgres', '2202', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

sequelize.authenticate().then(() => {
  console.log('Database Connected');
});

class Books extends Model {}
Books.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
    sequelize,
    modelName: 'books',
  }
);

sequelize.sync({ force: false }).then(() => {
  console.log('Database Build');
});

app.get('/add', async (req, res) => {
  const name = req.query.name;

  const data = await Books.create({ name });

  res.send({
    data,
  });
});

app.get('/list', async (req, res) => {
  const data = await Books.findAll();

  res.send({
    data,
  });
});

app.get('/book/:id', async (req, res) => {
  const data = await Books.findOne({
    where: {
      id: req.params.id,
    },
  });

  res.send({
    data,
  });
});

app.get('/edit/:id', async (req, res) => {
  const name = req.query.name;
  const data = await Books.update(
    {
      name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  res.send({
    data,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
