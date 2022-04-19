const express = require('express');
const app = express.Router();
let arrJsnUsuarios = [{ _id: 1, strNombre: 'Jorge', strApellido: 'Montemayor', strEmail: 'jmontemayor@sigma-alimentos.com' }]
// const path = require('path');
// const rutaDescarga = path.resolve(__dirname, '../../assets/index.html');
app.get('/', (req, res) => {
    const arrUsuarios = arrJsnUsuarios;
    return res.status(200).json({
        ok: true,
        msg: 'Se recibierón los usuarios de manera exitosa',
        cont: {
            arrUsuarios
        }
    })
    // return res.download(rutaDescarga, 'index.html');
})

app.post('/', (req, res) => {

    const body = {
        strNombre: req.body.strNombre,
        strApellido: req.body.strApellido,
        strEmail: req.body.strEmail,
        _id: Number(req.body._id)
    }
    if (body.strNombre && body.strApellido && body.strEmail && body._id) {

        const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == body._id)

        if (encontroUsuario) {
            res.status(400).json({
                ok: false,
                msg: 'El usuario ya se encuentra registrado ',
                cont: {
                    encontroUsuario
                }
            })
        } else {
            arrJsnUsuarios.push(body)
            res.status(200).json({
                ok: true,
                msg: 'Se registro el usuario de manera correcta',
                cont: {
                    arrJsnUsuarios
                }
            })
        }

    } else {
        res.status(400).json({
            ok: false,
            msg: 'No se recibio alguno o todos los valores requeridos',
            cont: {
                body
            }
        })
    }


})


module.exports = app;