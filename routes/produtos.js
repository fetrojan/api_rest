const express = require("express");
const router = express.Router();
const pool = require("../postgres");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false)
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//RETORNA TODOS OS PRODUTOS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos");
    const quantidade = result.rows.length;
    res.status(200).send({
      mensagem: "Aqui estão todos os produtos:",
      quantidade_produtos: quantidade,
      produtos: result.rows,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
      response: null,
    });
  }
});

//INSERE UM PRODUTO
router.post("/", upload.single("produto_imagem"), async (req, res) => {
  console.log(req.file);
  const { nome, preco } = req.body;
  const imagem_produto = req.file.path

  try {
    const result = await pool.query(
      "INSERT INTO produtos (nome, preco, imagem_produto) VALUES ($1, $2, $3) RETURNING *",
      [nome, preco, imagem_produto]
    );
    res.status(201).send({
      mensagem: "Produto inserido com sucesso",
      produto: result.rows[0],
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
      response: null,
    });
  }
});

//RETORNA OS DADOS DE UM PRODUTO ESPECIFICO

router.get("/:id_produto", async (req, res) => {
  const idProduto = req.params.id_produto;
  try {
    const result = await pool.query(
      "SELECT * FROM produtos WHERE id_produto = $1",
      [idProduto]
    );
    if (result.rows.length > 0) {
      res.status(200).send({
        mensagem: "Produto encontrado",
        produto: result.rows[0],
      });
    } else {
      res.status(404).send({
        mensagem: "Produto não encontrado",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: error.message,
      response: null,
    });
  }
});

//ALTERA UM PRODUTO
router.patch("/:id_produto", async (req, res) => {
  const idProduto = req.params.id_produto;
  const { nome, preco } = req.body;

  let updateQuery = "UPDATE produtos SET";
  const updateValues = [];
  let counter = 1;

  if (nome) {
    updateQuery += ` nome = $${counter},`;
    updateValues.push(nome);
    counter++;
  }

  if (preco) {
    updateQuery += ` preco = $${counter},`;
    updateValues.push(preco);
    counter++;
  }

  updateQuery = updateQuery.slice(0, -1);
  updateQuery += ` WHERE id_produto = $${counter} RETURNING *`;
  updateValues.push(idProduto);

  try {
    const result = await pool.query(updateQuery, updateValues);
    if (result.rowCount > 0) {
      res.status(200).send({
        mensagem: "Produto alterado com sucesso!",
        produto: result.rows[0],
      });
    } else {
      res.status(404).send({
        mensagem: "Produto não encontrado",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: error.message,
      response: null,
    });
  }
});

//DELETA UM PRODUTO
router.delete("/:id_produto", async (req, res) => {
  const idProduto = req.params.id_produto;

  try {
    const result = await pool.query(
      " DELETE FROM produtos WHERE id_produto = $1 RETURNING *",
      [idProduto]
    );
    if (result.rowCount > 0) {
      res.status(200).send({
        mensagem: "Produto excluido com sucesso",
        produto: result.rows[0],
      });
    } else {
      res.status(404).send({
        mensagem: "Produto não encontrado",
      });
    }
  } catch (erro) {
    res.status(500).send({
      error: error.message,
      response: null,
    });
  }
});

module.exports = router;
