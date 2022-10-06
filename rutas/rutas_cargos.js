var mongojs = require('mongojs');
var uri = 'mongodb://localhost:27017/JackoTinocoLab02';
var db = mongojs(uri,["Cargos"]);

function cargos_listado(req,res){
    db.Cargos.find().sort({nombre:1}, function( err,records ){
        if (err) {
            console.log('Error al acceder a la base de datos.');
            return;
        }
        res.render('m_cargos_listado',{records: records});
    });
}

module.exports = {
    listado: function (req,res){
        cargos_listado(req,res);
    },

    nuevo: function (req,res){
        res.render('m_cargos_nuevo',{});
    },

    grabar_nuevo: function (req,res) {
        var xnom = req.body['xnom'];
        var xsue = req.body['xsue'];
        db.Cargos.find().sort({_id:-1}, function ( err,records ){
            if(err){
                console.log('Error al acceder a la base de datos.');
                res.end();
                return;
            }
            var xid = records[0]._id +1;
            db.Cargos.insert( {_id:xid, nombre:xnom, sueldo:parseInt(xsue)}, function(){
                cargos_listado(req,res);
            });
        });
    },
    editar: function (req,res) {
        var xid = req.params.xid*1;
        console.log(xid);
        db.Cargos.find({_id:xid}, function(err, records) {
            if (err) {
                console.log('Error a acceder a la base de datos.');
                res.end();
                return;
            }
            res.render('m_cargos_editar',{cargo: records[0]});
        });
    },
    grabar_editar: function (req, res){
        var xid = req.body['xid' ]*1;
        var xnom = req.body['xnom'];
        var xsue = req.body['xsue'];
        db.Cargos.update( {_id:xid}, { $set: {nombre:xnom, sueldo:parseInt(xsue)}}, function() {
            cargos_listado( req, res );
        });
    },
    eliminar: function (req, res){
        var xid=req.params.xid*1;
        db.Cargos.remove({_id:xid}, function(){
            cargos_listado(req, res);
        });
    },
}