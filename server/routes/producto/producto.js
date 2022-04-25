const express = require ('express');
const app = express.Router();
const ProductoModel = require('../../models/producto/producto.model');

app.get('/', async (req,res) => {
    const obtenerproductos = await ProductoModel.find();
    console.log(obtenerproductos);

    return res.status(200).json({
        ok: false,
        msg:'Entre a la ruta producto',
        cont:
        {
            obtenerproductos
        }
    })
});

module.exports = app;
