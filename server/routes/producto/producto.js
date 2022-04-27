const express = require ('express');
const app = express.Router();
const ProductoModel = require('../../models/producto/producto.model');

app.get('/', async (req,res) => {

    try {
        const obtenerproductos = await ProductoModel.find();

        if(!obtenerproductos.length>0) 
        {
            return res.status(400).json({
                ok: false,
                msg:'No hay productos en la base de datos',
                cont:
                {
                    obtenerproductos
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg:'Si hay productos en la base de datos',
            cont:
            {
                obtenerproductos
            }
        })
    } 
    catch (error) {
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor',
                cont:
                {
                    error
                }
            })    
    }

});


app.post('/', async (req,res) =>{
    
    try {
        const body = req.body;
        const productoBody = new ProductoModel(body);
        const err = productoBody.validateSync();

        if (err)
        {
            return res.status(400).json({
                ok: false,
                msg:'No se recibio algun campo favor de validar',
                cont:
                {
                    err
                }
            })
        }

        const registradoP = await productoBody.save();

        return res.status(200).json({
            ok: true,
            msg:'El producto se registro correctamente',
            cont:
            {
                registradoP
            }
        })
    } 
    catch (error) {
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor',
                cont:
                {
                    error
                }
            })
    }
    
   
})


app.put('/', async (req,res) =>{

    try {
        const _idProducto = req.query._idProducto;

        
        if (!_idProducto || _idProducto.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: _idProducto ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un producto',
                    cont:
                    {
                        _idProducto
                    }
                }) 
        }

        const encontroProducto = await ProductoModel.findOne({_id: _idProducto});

        if (!encontroProducto)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se encuentra registrado el producto',
                    cont:
                    {
                        _idProducto
                    }
                }) 

        }

        const actualizarProducto = await ProductoModel.findByIdAndUpdate(_idProducto, { $set:{ ...req.body}}, {new :true});

        if (!actualizarProducto)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se logro actualizar el producto',
                    cont:
                    {
                        ...req.body
                    }
                }) 

        }

        return res.status(200).json(
            {
                ok:false,
                msg: 'El producto se actualizo de manera existosa',
                cont:
                {
                    productoAnterior: encontroProducto,
                    productoActual: actualizarProducto  
                }
            })

        
    } 
    catch (error) {
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor',
                cont:
                {
                    error
                }
            })
    }

})

app.delete('/', async (req,res)=> {
    try {
    const_idProducto = req.query._idProducto;

    if(!_idProducto && idProducto.length !=24 ) {
        return res.status(400).json({
            ok:false,
            msg: _idProducto ? 'El identificador es invalido' : 'No se recibio identificador de producto',
            cont: {
                _idProducto
            }
        })
    }
    const encontrarProducto = await Producto.findOne({_id: _idProducto});
    if(!encontrarProducto){
        return res.status(400).json({
            ok:false,
            msg:'El identificador del producto no se encuentra en la base de datos',
            cont: {
                _idProducto: _idProducto
            }
        })
    }

    const eliminarProducto = await ProductoModel.findOneAndDelete ({_id: _idProducto});
    if(!eliminarProducto) {
        return res.status(400).json({
            ok:false,
            msg:'El producto no se logro eliminar de la base de datos',
            cont: {
                eliminarProducto
            }
        })
    }
    return res.status(200).json({
        ok:true,
        msg: 'El producto se elimino exitosamente',
        cont: {
            eliminarProducto
        }
    })
  }  catch (error) {
    return res.status(500).json(
        {
            ok:false,
            msg: 'Error en el servidor',
            cont:
            {
                error
            }
        })
  }
})

module.exports = app;
