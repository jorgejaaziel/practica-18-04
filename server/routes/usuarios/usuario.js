const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt');
const cargaArchivo = require('../../library/cargarArchivos');
const { verificarAcceso } = require('../../middlewares/permisos');
const RolModel = require('../../models/permisos/rol.model')

app.get('/', verificarAcceso, async (req,res) => {
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

app.post('/', async (req, res) => {
    // existe ? (lo que pasa si existe) : (no existe);
    try {
        const body = { ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena, 10) : undefined };
        const bodyUsuario = new UsuarioModel(body);
        const encontrarEmailUsuario = await UsuarioModel.findOne({ strEmail: body.strEmail });
        const encontrarNombreUsuario = await UsuarioModel.findOne({ strNombreUsuario: body.strNombreUsuario })
        if (encontrarEmailUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado',
                cont: {
                    body
                }
            })
        }
        if (encontrarNombreUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de usuario ya se encuentra registrado',
                cont: {
                    body
                }
            })
        }
        const err = bodyUsuario.validateSync();
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Uno o mas campos no se registrarón favor de ingresarlos',
                cont: {
                    err
                }
            })
        }
        if (req.files) {
            if (!req.files.strImagen) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se recibio un archivo strImagen, favor de inregsarlo',
                    cont: {}
                })
            }
            bodyUsuario.strImagen = await cargaArchivo.subirArchivo(req.files.strImagen, 'usuario', ['image/png', 'image/jpg', 'image/jpeg'])

        }


        if(!req.body._idObjRol){
            const encontroRolDefault = await RolModel.findOne({blnRolDefault:true})
            UsuarioBody._idObjRol = encontroRolDefault._id;
        }
    


        const usuarioRegistrado = await bodyUsuario.save();
        return res.status(200).json({
            ok: true,
            msg: 'Se registro el usuario de manera exitosa',
            cont: {
                usuarioRegistrado
            }
        })
    } catch (error) {
        const err = Error(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    err: err.message ? err.message : err.name ? err.name : err
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
    const blnEstado = req.body.blnEstado == "false" ? false : true ;

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
    if (!modificarEstado)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se realizo ninguna actividad',
                        cont:
                        {
                            ...req.query
                        }
                    }) 
            }
            return res.status(200).json(
                {
                    ok:true,
                    msg: _blnEstado == true ? 'Se activo el usuario de manera existosa' : 'El usuario se desactivo de manera exitosa' ,
                    cont:
                    {
                        modificarEstado
                    }
                })

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
 return res.status(200).json(
            {
                ok:true,
                msg: _blnEstado == true ? 'Se activo el usuario de manera existosa' : 'El usuario se desactivo de manera exitosa' ,
                cont:
                {
                    modificarEstado
                }
            })

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