const { Router } = require('express');
const router = Router();
const sql = require('mssql');

// configuracion para DB
const config1 = {
    user: 'prodyan',
    password: 'prodyan',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'ODM'
}

router.post('/', async (req, res) => {
    for(i = 1; i < req.body.length; i++){
        await insertTarifa(req.body[i]);
    }
});

router.get('/:cia/:fecha/:servicio/:origen/:destino', async (req, res) => {
    var tarifa = 0;
    const query1 = "SELECT TarifaBase FROM dbo.Tarifas WHERE Servicio = '" +
        req.params.servicio + "' AND Origen = '" + req.params.origen + "' AND Destino = '" +
        req.params.destino + "' AND Cia = '" + req.params.cia + "' AND Fecha = '" + req.params.fecha + "'";
    try {
        let pool = await sql.connect(config1);
        //console.log(query1);
        const res = await pool.request()
            .query(query1);
        pool.close();
        if(res.rowsAffected[0] === 0){
            tarifa = 0;
        }else{
            tarifa = res.recordset[0].TarifaBase;
        }
        //console.log(tarifa);
    } catch (err) {
        // ... error checks
        throw err;
    }
    res.json({tarifa: tarifa});
});

async function insertTarifa(tarifa){
    const query = "INSERT INTO dbo.Tarifas (Servicio, Origen, DescripcionOrigen, Destino, " +
        "DescripcionDestino, TarifaBase, TarifaProm, TarifaVta, Cia, Moneda, Fecha, FechaNva) " +
        "VALUES ('" + tarifa.Servicio + "', '" + tarifa.Origen + "', '" + tarifa.DescripcionOrigen +
        "', '" + tarifa.Destino + "', '" + tarifa.DescripcionDestino + "', " + tarifa.TarifaBase +
        ", " + tarifa.TarifaProm + ", " + tarifa.TarifaVta + ", '" + tarifa.Cia + "', '" +
        tarifa.Moneda + "', '" + tarifa.Fecha + "', '" + tarifa.FechaNva + "')";
    console.log(query);
    // deshabilitamos el insert
    /*
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .query(query);
    } catch (err) {
        // ... error checks
        throw err;
    }*/
}

module.exports = router;