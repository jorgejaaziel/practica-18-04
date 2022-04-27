const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt');

app.get('/', async (req,res) => {
    try {

    const obtenerUsuarios = await UsuarioModel.find({},{strContrasena:0});
    

    if(!obtenerUsuarios.length>0) 
    {
        return res.status(400).json({
            ok: false,
            msg:'No hay usuarios en la base de datos',
            cont:
            {
                obtenerUsuarios
            }
        })
    }

    return res.status(200).json({
        ok: true,
        msg:'Si hay usuarios en la base de datos',
        count: obtenerUsuarios.length,
        cont:
        {
            obtenerUsuarios
        }
    })
} catch (error) {
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

app.post('/', async (req,res) =>
{
    try {
    const body ={ ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena,10) : undefined };
    const bodyUsuario = new UsuarioModel(body);

    const obtenermail = await UsuarioModel.findOne({strEmail:body.strEmail});
    const obtenerNombreUsuarios = await UsuarioModel.findOne({strNombreUsuario:body.strNombreUsuario});

    if(obtenermail)
    {
        return res.status(400).json({
            ok:false,
            msg:('El email ya se encuentra registrado'),
            cont:{
                body
            }
        })
    }

    if(obtenerNombreUsuarios)
    {
        return res.status(400).json({
            ok:false,
            msg:('El nombre ya se encuentra registrado'),
            cont:{
                body
            }
        })
    }

    const err = bodyUsuario.validateSync();

    if (err) 
    {
        return res.status(400).json({
            ok:false,
            msg:('Falta uno o mas datos del usuario. Favor de completarlos'),
            cont:{
                err
            }
        })
    }
    const usuarioRegistrado = bodyUsuario.save();

    return res.status(200).json({
        ok:true,
        msg:('El usuario se registro correctamente'),
        cont:{
            usuarioRegistrado
        }
    })
} catch (error) {
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

app.put('/', async(req,res)=> {

    try {
        const _idUsuario = req.query._idUsuario;

        if (!_idUsuario || _idUsuario.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: _idUsuario ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un usuario',
                    cont:
                    {
                        _idUsuario
                    }
                }) 
        }

        const encontroUsuario = await UsuarioModel.findOne({_id: _idUsuario});
       
        if (!encontroUsuario)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se encuentra registrado el usuario',
                    cont:
                    {
                        _idUsuario
                    }
                }) 

        }

        const encontroNombreUsuario = await UsuarioModel.findOne({strNombreUsuario: req.body.strNombreUsuario, _id:{$ne: _idUsuario}},{strNombre:1, strNombreUsuario:1});

        if (encontroNombreUsuario)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'El nombre de usuario ya se encuentra registrado',
                    cont:
                    {
                        encontroNombreUsuario
                    }
                }) 

        }
        
        const actualizarUsuario = await UsuarioModel.findOneAndUpdate({_id:_idUsuario}, 
            { $set:{strNombre: req.body.strNombre, 
                strApellido: req.body.strApellido, 
                strDireccion: req.body.strDireccion, 
                strNombreUsuario: req.body.strNombreUsuario}}, 
            {new :true, upsert: true});

        if (!actualizarUsuario)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se logro actualizar el usuario',
                    cont:
                    {
                        ...req.body
                    }
                }) 

        }

        return res.status(200).json(
            {
                ok:true,
                msg: 'El producto se actualizo de manera existosa',
                cont:
                {
                    usuarioAnterior: encontroUsuario,
                    usuarioActual: actualizarUsuario
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
    const _idUsuario = req.query._idUsuario
    const blnEstado = req.body.blnEstado == "false" ? false : true

    if(!_idUsuario || _idUsuario.length !=24 || !blnEstado) {
        return res.status(400).json({
            ok:false,
            msg: _idUsuario ? 'No es un id valido' : 'No se registro un identificador de usuario',
            cont: {
                _idUsuario: _idUsuario
            }
        })
    }

    const modificarEstadoUsuario = await UsuarioModel.findOneAndUpdate({ _id: _idUsuario}, { $set: {blnEstado: blnEstado}}, {new: true})
} catch(error) {
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

    /*
   return res.status(200).json({
       ok:true,
       msg: 'Se recibieron los valores de manera exitosa',
       cont: {
           _idUsuario: _idUsuario,
           blnEstado: blnEstado
       }
   })
   */
})

module.exports = app;