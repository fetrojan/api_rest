const express = require('express')
const router = express.Router()


//RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensamge: 'Retorna os pedidos'
    })
})


//INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Insere um novo pedido'
    })
})


//RETORNA OS DADOS DE UM PEDIDO ESPECIFICO
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido
    res.status(200).send({
        mensagem: 'Detalhes do Pedido',
        id_pedido: id
    })
})

//DELETA UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido excluido'
    })
})

module.exports = router;