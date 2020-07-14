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
    for(i = 1; i < req.body.length; i++){
        await insertLiquidacionImp(req.body[i]);
    }
    //await insertLiquidacionImp(req.body[0]);
});

router.get('/', async (req, res) => {
    const query = "SELECT * FROM dbo.LiquidacionImp";
    try {
        let pool = await sql.connect(config);
        const respuesta = await pool.request()
            .query(query);
        pool.close();
        res.json(respuesta.recordsets);
        
    } catch (err) {
        // ... error checks
        throw err;
    }
});

router.get('/:compania/:fechaInicio/:fechaTermino', async (req, res) => {
    const compania = req.params.compania;
    const fechaInicio = req.params.fechaInicio;
    const fechaTermino = req.params.fechaTermino;
    var query = "";
    const companias = compania.split("-");
    if(companias.length < 2){
        query = "SELECT * FROM dbo.LiquidacionImp WHERE Compania='" + companias[0] +
        "' AND Fecha_Liq BETWEEN '" + fechaInicio + "' AND '" + fechaTermino + "'";
    }else{
        query = "SELECT * FROM dbo.LiquidacionImp WHERE ";
        var stringCompanias = "";
        companias.map(cia => {
            stringCompanias = stringCompanias + "Compania = '" + cia + "' AND Fecha_Liq BETWEEN '" + fechaInicio + "' AND '" + fechaTermino + "' OR ";
        });
        // limpiamos el string
        stringCompanias = stringCompanias.substr(0, stringCompanias.length - 3);
        query = query + stringCompanias;
    }
    try {
        let pool = await sql.connect(config);
        const respuesta = await pool.request()
            .query(query);
        pool.close();
        res.json(respuesta.recordsets);
    } catch (err) {
        // ... error checks
        throw err;
    }
});

async function insertLiquidacionImp(liquidacion){
    const query = "INSERT INTO dbo.LiquidacionImp (Compania, Base_Liq, TipoPago, Descripcion_de_corrida, Tipo_S, " + 
        "Descripcion_Servicio, Folio_Liq, Folio_TV, Rol, Corrida, Origen, Destino, Autobus, Hora_Salida, Fecha_Salida, " +
        "Fecha_Liq, Hora_Liq, Oper_1, Nombre_Op1, Oper_2, Nombre_Op2, Kms_Op_1, Kms_Op_2, Boletos, Ingresos_Oper_1, Ingresos_Oper_2, " +
        "Sueldo_Oper_1, Sueldo_Oper_2, Viaticos_Oper_1, Viaticos_Oper_2, Gratificacion_op_1,Gratificacion_op_2, Desctos_Oper_1, Desctos_Oper_2, " +
        "Peajes, Total_Pago_Op1, Total_Pago_Op2) VALUES ('" + liquidacion.Compania + "', '" + liquidacion.Base_Liq + "', '" + liquidacion.TipoPago + 
        "', '" + liquidacion.Descripcion_de_corrida + "', '" + liquidacion.Tipo_S + "', '" + liquidacion.Descripcion_Servicio + "', '" +
        liquidacion.Folio_Liq + "', '" + liquidacion.Folio_TV + "', '" + liquidacion.Rol + "', '" + liquidacion.Corrida + "', '" + liquidacion.Origen + 
        "', '" + liquidacion.Destino + "', '" + liquidacion.Autobus + "', '" + liquidacion.Hora_Salida + "', '" + liquidacion.Fecha_Salida + "', '" + 
        liquidacion.Fecha_Liq + "', '" + liquidacion.Hora_Liq + "', '" + liquidacion.Oper_1 + "', '" + liquidacion.Nombre_Op1 + "', '" + liquidacion.Oper_2 +
        "', '" + liquidacion.Nombre_Op2 + "', " + liquidacion.Kms_Op_1 + ", " + liquidacion.Kms_Op_2 + ", " + liquidacion.Boletos + ", " + 
        liquidacion.Ingresos_Oper_1 + ", " + liquidacion.Ingresos_Oper_2 + ", " + liquidacion.Sueldo_Oper_1 + ", " + liquidacion.Sueldo_Oper_2 + ", " +
        liquidacion.Viaticos_Oper_1 + ", " + liquidacion.Viaticos_Oper_2 + ", " + liquidacion.Gratificacion_op_1 + ", " + liquidacion.Gratificacion_op_2 + 
        ", " + liquidacion.Desctos_Oper_1 + ", " + liquidacion.Desctos_Oper_2 + ", " + liquidacion.Peajes + ", " + liquidacion.Total_Pago_Op1 + ", " +
        liquidacion.Total_Pago_Op2 + ")";
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