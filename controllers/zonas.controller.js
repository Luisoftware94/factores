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
    //console.log(req.body);
    for(i = 0; i < req.body.length; i++){
        await insertZona(req.body[i]);
    }
});

async function insertZona(zona){
    const query = "INSERT INTO dbo.Zonas (Nombre, Clave, idcia) VALUES ('" + zona.Nombre + "', '" + zona.Clave + "', '" + zona.idcia + "')";
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