const express = require('express');
const app = express.Router();
const empresaModel = require('../../models/empresa/empresa.model');
const EmpresaModel = require('../../models/empresa/empresa.model');

app.get('/', async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == "false" ? false : true;
        const obtenerEmpresa = await EmpresaModel.find({ blnEstado: blnEstado });

        //funcion con aggregate

        const obtenerEmpresaConAggregate = await EmpresaModel.aggregate([
            { $match: { blnEstado: blnEstado } },
        ]);

        //funcion con aggregate

        if (obtenerEmpresa.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontrarón Empresas en la base de datos',
                cont: {
                    obtenerEmpresa,
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvierón los Empresas de manera exitosa',
            count: obtenerEmpresa.length,
            cont: {
                obtenerEmpresaConAggregate
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }
})

app.post('/', async (req, res) => {
    try {
        const body = req.body;
        const EmpresaBody = new EmpresaModel(body);
        const err = EmpresaBody.validateSync();
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio uno o mas campos favor de validar',
                cont: {
                    err
                }
            })
        }
        const encontroEmpresa = await EmpresaModel.findOne({ strNombre: body.strNombre }, { strNombre: 1 });
        if (encontroEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El Empresa ya se encuentra registrado en la base de datos',
                cont: {
                    encontroEmpresa
                }
            })
        }
        const EmpresaRegistrado = await EmpresaBody.save();
        return res.status(200).json({
            ok: true,
            msg: 'El Empresa se registro de manera exitosa',
            cont: {
                EmpresaRegistrado
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }


})

app.put('/', async (req, res) => {
    try {
        const _idEmpresa = req.query._idEmpresa;
        if (!_idEmpresa || _idEmpresa.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idEmpresa ? 'El identificador no es valido se requiere un id de 24 caractéres' : 'No se recibio el identificador',
                cont: {
                    _idEmpresa
                }
            })
        }
        const encontroEmpresa = await EmpresaModel.findOne({ _id: _idEmpresa, blnEstado: true });
        if (!encontroEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El Empresa no se encuentra registrado',
                cont: {
                    _idEmpresa
                }
            })
        }
        const encontroNombreEmpresa = await EmpresaModel.findOne({ strNombre: req.body.strNombre, _id: { $ne: _idEmpresa } }, { strNombre: 1 })
        if (encontroNombreEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre del Empresa ya se encuentra registrado',
                cont: {
                    encontroNombreEmpresa
                }
            })
        }
        // const actualizarEmpresa = await EmpresaModel.updateOne({ _id: _idEmpresa }, { $set: { ...req.body } })
        const actualizarEmpresa = await EmpresaModel.findByIdAndUpdate(_idEmpresa, { $set: { ...req.body } }, { new: true });
        if (!actualizarEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El Empresa no se logro actualizar',
                cont: {
                    ...req.body
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'El Empresa se actualizo de manera exitosa',
            cont: {
                EmpresaAnterior: encontroEmpresa,
                EmpresaActual: actualizarEmpresa
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }

})

app.delete('/', async (req, res) => {
    try {
        const _idEmpresa = req.query._idEmpresa;
        const blnEstado = req.query.blnEstado == "false" ? false : true
        if (!_idEmpresa || _idEmpresa.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idEmpresa ? 'El identificador de Empresa es invalido' : 'No se recibio un identificador de Empresa',
                cont: {
                    _idEmpresa
                }
            })
        }
        const encontrarEmpresa = await EmpresaModel.findOne({ _id: _idEmpresa, blnEstado: true });
        if (!encontrarEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del Empresa no se encuentra en la base de datos',
                cont: {
                    _idEmpresa: _idEmpresa
                }
            })
        }
        // Esta funcion elimina de manera definitiva el Empresa
        // const eliminarEmpresa = await EmpresaModel.findOneAndDelete({ _id: _idEmpresa });
        //Esta funcion solo cambia el estado del Empresa
        const desactivarEmpresa = await EmpresaModel.findOneAndUpdate({ _id: _idEmpresa }, { $set: { blnEstado: blnEstado } }, { new: true })
        // if (!desactivarEmpresa) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: blnEstado == true ? 'El Empresa no se logro activar' : 'El Empresa no se logro desactivar', 
        //         cont: {
        //             desactivarEmpresa
        //         }
        //     })
        // }
        return res.status(200).json({
            ok: true,
            msg: blnEstado == true ? 'Se activo el Empresa de manera exitosa' : 'Se desactivo el Empresa de manera exitosa',
            cont: {
                desactivarEmpresa
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }
})





module.exports = app;