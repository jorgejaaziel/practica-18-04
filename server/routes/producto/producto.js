const express = require ('express');
const app = express.Router();
let arrJsnProductos = [];

app.get('/', (req, res) => {
    const arrProductos = arrJsnProductos;
    return res.status(200).json({
        ok: true,
        msg: 'Se recibierón los usuarios de manera exitosa',
        cont: {
            arrProductos
        }
    })
    // return res.download(rutaDescarga, 'index.html');
})

app.post('/', (req, res) => {

    const body = {
        strNombre: req.body.strNombre,
        strDescripcion: req.body.strDescripcion,
        //strEmail: req.body.strEmail,
        numCantidad: parseInt(req.body.numCantidad),
        numPrecio: parseInt(req.body.numPrecio),
        _id: Number(req.body._id)
    }
    if(!req.body._id || !req.body.strNombre || !req.body.strDescripcion || !req.body.numCantidad || !req.body.numPrecio){
        return res.status(400).json({
            ok:false,
            msg:`Faltan datos`,
            cont:{
                body
            }
        })
    }else{
        const encontroProducto = arrJsnProductos.find(producto => producto._id == body._id)
        
        if(encontroProducto){
           return res.status(400).json({
               ok:false,
               msg: `Existe un producto con el mismo id: ${body._id}`,
               cont:{
                   arrJsnProductos
               }
           }) 
        }else{

            arrJsnProductos.push(body);

            return res.status(200).json({
                ok:true,
                msg:"El producto se agrego correctamente",
                cont:{
                    arrJsnProductos
                }
            })

        }
        
    }


})

app.put('/', (req,res) => {
    const idProducto = parseInt(req.query.idProducto);
    
    if(idProducto){
        const encontroProducto = arrJsnProductos.find( usuario => usuario._id === idProducto );
        if (encontroProducto) {
            const actualizarProducto = {
                _id: encontroProducto._id, 
                strNombre: req.body.strNombre,
                strDescripcion: req.body.strDescripcion,
                strEmail: req.body.strEmail
            }
            const filtrarProducto = arrJsnProductos.filter(idfi => idfi._id != idProducto);
            arrJsnProductos = filtrarProducto;
            arrJsnProductos.push(actualizarProducto);

            return res.status(200).json({
                ok: true,
                msg: `El producto con el id ${idProducto} se actualizó de manera exitosa.`,
                cont: {
                    actualizarProducto
                }
            });
            
        }else{
            return res.status(400).json({
                ok: false,
                msg: `El usuario con el id ${idProducto} no se encuentra registrado en la base de datos.`,
                cont: {
                    idProducto
                }
            });
        }

    }else{
        return res.status(400).json({
            ok: false,
            msg: 'No ingresó el Identificador',
            cont: {
                idProducto
            }
        });
    }
});

app.delete('/',(req,res)=>{
    const idProducto = parseInt( req.query.idProducto);

    if(!idProducto){
         return res.status(400).json({
            ok:false,
            msg:'No se recibio un identificador del usuario',
            cont:{
                idProducto
            }
        })
    }
    const encontroProducto = arrJsnProductos.find(usuario => usuario._id == idProducto);
    if(!encontroProducto){
        return res.status(400).json({
            ok:false,
            msg:`No se encontro un usuario con el id: ${idProducto} en la base de datos`,
            cont:{
                idProducto
            }
        })
    }
    const productoFiltrado = arrJsnProductos.filter(usuario => usuario._id != idProducto);
    arrJsnProductos=productoFiltrado;
    
    return res.status(200).json({
        ok:true,
        msg:'Se elimino el producto de manera exitosa',
        cont:{
            encontroProducto
        }
    })
})




module.exports = app;
