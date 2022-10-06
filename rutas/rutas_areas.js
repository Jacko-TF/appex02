var mongojs = require('mongojs');
var uri = 'mongodb://localhost:27017/JackoTinocoLab02';
var db = mongojs(uri,["Areas"]);
var mongoose = require('mongoose');

function areas_listado(req,res){
    db.Areas.find().sort({Nombre:1}, function( err,records ){
        if (err) {
            console.log('Error al acceder a la base de datos.');
            return;
        }
        res.render('m_areas_listado',{records: records});
    });
}

module.exports = {
    listado: function (req,res){
        areas_listado(req,res);
    },

    nuevo: function (req,res){
        res.render('m_areas_nuevo',{});
    },

    grabar_nuevo: function (req,res) {
        var xnom = req.body['xnom'];
        var xabre = req.body['xabre'];
        var xest = req.body['xest'];
        db.Cargos.find().sort({_id:-1}, function ( err,records ){
            if(err){
                console.log('Error al acceder a la base de datos.');
                res.end();
                return;
            }
            db.Areas.insert( {Nombre:xnom, Abreviatura:xabre, Estado:xest}, function(){
                areas_listado(req,res);
            });
        });
    },
    editar: function (req,res) {
        var xid = new mongoose.Types.ObjectId(req.params.xid);
        console.log(xid);
        db.Areas.find({_id:xid}, function(err, records) {
            if (err) {
                console.log('Error a acceder a la base de datos.');
                res.end();
                return;
            }
            res.render('m_areas_editar',{area: records[0]});
        });
    },
    grabar_editar: function (req, res){
        var xid = new mongoose.Types.ObjectId(req.body['xid']);
        var xnom = req.body['xnom'];
        var xabre = req.body['xabre'];
        var xest = req.body['xest'];
        db.Areas.update( {_id:xid}, { $set: {Nombre:xnom, Abreviatura:xabre, Estado:xest}}, function() {
            areas_listado( req, res );
        });
    },
    eliminar: function (req, res){
        var xid = new mongoose.Types.ObjectId(req.params.xid);
        db.Areas.remove({_id:xid}, function(){
            areas_listado(req, res);
        });
    },
}