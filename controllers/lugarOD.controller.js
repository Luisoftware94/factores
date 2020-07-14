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
        await insertLugarOD(req.body[i]);
    }
});

router.get('/:compania/:origen', async (req, res) => {
    const siglaZona = await getLugarOD(req.params.compania, req.params.origen);
    res.json({siglaZona: siglaZona});
});

async function getLugarOD(compania, origen){
    var IdCompania;
    var IdZona;
    var SiglaZona;
    // obtenemos campo Cia de la compañia para obtener la zona
    const queryCompania = "SELECT IdCompania FROM dbo.Companias WHERE Cia = '" + compania + "'";
    // hacemos la consulta para el IdCompania
    try {
        let pool = await sql.connect(config);
        const res = await pool.request()
            .query(queryCompania);
        pool.close();
        IdCompania = res.recordset[0].IdCompania;
    } catch (err) {
        // ... error checks
        throw err;
    }
    // obtenemos el lugarOD de la Zona con IdCompania y el origen
    const queryLugarOD = "SELECT IdZona FROM dbo.LugarOD WHERE Sigla = '" + origen + "' AND idcia = " + IdCompania;
    try {
        let pool = await sql.connect(config);
        const res = await pool.request()
            .query(queryLugarOD);
        pool.close();
        IdZona = res.recordset[0].IdZona;
    } catch (err) {
        // ... error checks
        throw err;
    }
    // obtenemos la clave de la zona con el IdZona
    const queryZona = "SELECT Clave FROM dbo.Zonas WHERE IdZona = " + IdZona;
    try {
        let pool = await sql.connect(config);
        const res = await pool.request()
            .query(queryZona);
        pool.close();
        SiglaZona = res.recordset[0].Clave;
    } catch (err) {
        // ... error checks
        throw err;
    }
    return SiglaZona;
}

async function insertLugarOD(lugarOD){
    const query = "INSERT INTO dbo.LugarOD (IdZona, Nombre, Sigla, idcia) VALUES (" + lugarOD.IdZona + ", '" + lugarOD.Nombre + "', '" + lugarOD.Sigla + "', " + lugarOD.idcia + ")";
    console.log(query);
    // deshabilitamos el insert
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