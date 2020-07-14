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
    for(i = 0; i < req.body.length; i++){
        await insertCompania(req.body[i]);
    }
});

async function insertCompania(compania){
    const query = "INSERT INTO dbo.Companias (NombreCorto, Nombre, Cia, D1) VALUES ('" + compania.NombreCorto + "', '" + compania.Nombre + "', '" + compania.Cia + "', '" + compania.D1 + "')";
    console.log(query);
    // Desabilitamos la funcion para no escribir sobre la base de datos en produccion
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