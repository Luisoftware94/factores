const { Router } = require('express');
const router = Router();
const sql = require('mssql');

// configuracion para DB
const config = {
    user: 'prodyan',
    password: 'prodyan',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'ProdyanPlus'
}

router.get('/:rol', async (req, res) => {
    const query = "SELECT IdServicio, NumAsientos FROM dbo.Rol WHERE Rol = '" + req.params.rol + "'";
    var IdServicio;
    var Servicio;
    var Asientos;
    if(req.params.rol === '600'){
        Servicio = 'PRIMERA'
        Asientos = '36'
    }else{
        try {
            let pool = await sql.connect(config);
            const res = await pool.request()
                .query(query);
            pool.close();
            IdServicio = res.recordset[0].IdServicio;
            Asientos = res.recordset[0].NumAsientos;
        } catch (err) {
            // ... error checks
            throw err;
        }
        const query1 = "SELECT Nombre FROM dbo.Servicios WHERE IdServicio = " + IdServicio;
        try {
            let pool = await sql.connect(config);
            const res = await pool.request()
                .query(query1);
            pool.close();
            Servicio = res.recordset[0].Nombre;
        } catch (err) {
            // ... error checks
            throw err;
        }
    }
    
    res.json({
        servicio: Servicio,
        asientos: Asientos
    });

});

module.exports = router;