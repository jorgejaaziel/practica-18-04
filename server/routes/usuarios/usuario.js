const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt');

app.get('/', (req,res) => {

    const obtenerusuarios = await UsuarioModel.find({},{strContrasena:0});
    

    if(!obtenerusuarios.length>0) 
    {
        return res.status(400).json({
            ok: false,
            msg:'No hay usuarios en la base de datos',
            cont:
            {
                obtenerusuarios
            }
        })
    }

    return res.status(200).json({
        ok: true,
        msg:'Si hay usuarios en la base de datos',
        count: obtenerusuarios.length,
        cont:
        {
            obtenerusuarios
        }
    })
});

app.post('/', (req,res) =>
{
    const body ={ ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena,10) : undefined };
    const bodyUsuario = new UsuarioModel(body);

    const obtenermail = UsuarioModel.find({strEmail:body.strEmail});
    const obtenerNombreUsuarios = await UsuarioModel.find({strNombreUsuario:body.strNombreUsuario});

    if(obtenermail.length>0)
    {
        return res.status(400).json({
            ok:false,
            msg:('El email ya se encuentra registrado'),
            cont:{
                body
            }
        })
    }

    if(obtenerNombreUsuarios.length>0)
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

})

module.exports = app;