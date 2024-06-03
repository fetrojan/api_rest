const express = require("express");
const router = express.Router();
const pool = require("../postgres");

//RETORNA TODOS OS PEDIDOS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
                SELECT  pedidos.id_pedido,
                        pedidos.quantidade,
                        pedidos.id_produto,
                        produtos.nome,
                        produtos.preco
                FROM pedidos
            INNER JOIN produtos
                ON produtos.id_produto = pedidos.id_produto;`);
    const quantidade = result.rows.length;
    res.status(200).send({
      mensagem: "Aqui estão todos os pedidos:",
      quantidade_pedidos: quantidade,
      produtos: result.rows,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
      response: null,
    });
  }
});

//INSERE UM PEDIDO
router.post("/", async (req, res) => {
  const { id_produto, quantidade } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO pedidos (id_produto, quantidade) VALUES ($1, $2) RETURNING *",
      [id_produto, quantidade]
    );
    res.status(201).send({
      mensagem: "Pedido inserido com sucesso",
      pedido: result.rows[0],
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
      response: null,
    });
  }
});

//RETORNA OS DADOS DE UM PEDIDO ESPECIFICO
router.get("/:id_pedido", async (req, res) => {
  const idPedido = req.params.id_pedido;
  try {
    const result = await pool.query(
      "SELECT * FROM pedidos WHERE id_pedido = $1",
      [idPedido]
    );
    if (result.rows.length > 0) {
      res.status(200).send({
        mensagem: "Pedido encontrado",
        pedido: result.rows[0],
      });
    } else {
      res.status(404).send({
        mensagem: "Pedido não encontrado",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: error.message,
      response: null,
    });
  }
});

//DELETA UM PEDIDO
router.delete("/", async (req, res) => {
  const idPedido = req.params.id_pedido;

  try {
    const result = await pool.query(
      " DELETE FROM pedidos WHERE id_pedido = $1 RETURNING *",
      [idPedido]
    );
    if (result.rowCount > 0) {
      res.status(200).send({
        mensagem: "Pedido excluido com sucesso",
        pedido: result.rows[0],
      });
    } else {
      res.status(404).send({
        mensagem: "Pedido não encontrado",
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
