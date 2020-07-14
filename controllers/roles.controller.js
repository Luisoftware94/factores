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

router.post('/', async (req, res) => {
    for(i = 214; req.body.length; i++){
        await insertRol(req.body[i]);
    }
});

async function insertRol(rol){
    const query = "INSERT INTO dbo.Rol (IdCompania, IdServicio, Rol, Base, " +
        "Ejes, NumAsientos, Conductores, FactDiesel, GastoAdmon, GastoDirecto, PrecioLT, " +
        "PagoCond, ComisionCond, Porcentaje, D2) VALUES (" + rol.IdCompania + ", " + 
        rol.IdServicio + ", '" + rol.Rol + "', '" + rol.Base + "', " + rol.Ejes + ", " +
        rol.NumAsientos + ", " + rol.Conductores + ", " + rol.FactDiesel + ", " + rol.GastoAdmon +
        ", " + rol.GastoDirecto + ", " + rol.PrecioLT + ", " + rol.PagoCond + ", " + rol.ComisionCond +
        ", " + rol.Porcentaje + ", " + rol.D2 + ")";
    console.log(query);
    /*try {
        let pool = await sql.connect(config);
        await pool.request()
            .query(query);
    } catch (err) {
        // ... error checks
        throw err;
    }*/
}
module.exports = router;