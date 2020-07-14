import React, { Component } from 'react';
import { Button, ProgressBar, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import ReactExport from "react-data-export";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const ip = "http://localhost:4000";
var sumatoriaIngresosOrdinarias = [];
var sumatoriaIngresosExtras = [];
var sumatoriaIngresos = [];
var sumatoriaTarifasOrdinarias = [];
var sumatoriaTarifasExtras = [];
var sumatoriaTarifas = [];
var sumatoriaKmOrdinarias = [];
var sumatoriaKmExtras = [];
var sumatoriaKm = [];
var sumatoriaAsientosOrdinarias = [];
var sumatoriaAsientosExtras = [];
var sumatoriaAsientos = [];

var factorOcupacionOrdinarias = [];
var factorOcupacionExtras = [];
var factorOcupacion = [];
var factorKmOrdinarias = [];
var factorKmExtras = [];
var factorKm = [];
var porcentajeOcupacionOrdinarias = [];
var porcentajeOcupacionExtras = [];
var porcentajeOcupacion = [];
var hojaLiquidaciones = []; 
var hojaFactores = [];
var hojaFactorOcupacionOrdinarias = [];
var hojaFactorOcupacionExtras = [];
var hojaFactorOcupacion = [];
var hojaFactorFt = [];
var hojaFactorFtOrdinarias = [];
var hojaFactorFtExtras = [];

var sumaTotalIngresosOrdinarias = 0;
var sumaTotalTarifasOrdinarias = 0;
var sumaTotalIngresosExtras = 0;
var sumaTotalTarifasExtras = 0;
var sumaTotalIngresos = 0;
var sumaTotalTarifas = 0;
var sumaTotalKmOrdinarias = 0;
var sumaTotalKmExtras = 0;
var sumaTotalKm = 0;

var dia = '';
var mes = '';
var year = '';
class GenerarFactorOcupacion extends Component {
    state = {
        liquidaciones: [],
        cargando: false,
        cargado: 0,
        cargadosFactores: false,
        cargadosFactoresExtendidos: false,
        cargadosFactoresConcentrados: false,
        zonasOmnibus: ['CB', 'CN', 'G', 'M', 'MI', 'N', 'NE', 'O'],
        factorOcupacionOrdinariasOdm: [],
        factorOcupacionExtrasOdm: [],
        factorOcupacion: [],
        factorKmOrdinarias: [],
        factorKmExtras: [],
        factorKm: [],
        compania: "",
        fechaInicio: new Date(),
        fechaTermino: new Date(),
        reportFailed: false,
        tipoReporte: "",
        empresasReporte: "",
        odm: false,
        omex: false,
        ne: false,
        itv: false,
        ocl: false,
        lpl: false,
        eno: false,
        tap: false,
        esm: false,
        eta: false
    }
    // controlamos los inputs para almacenarlos en el state
    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onChangeDateInit = fechaInicio => {
        this.setState({fechaInicio});
    }
    onChangeDateTerm = fechaTermino => {
        this.setState({fechaTermino});
    }
    onReportChange = (e) => {
        this.setState({
            tipoReporte: e.currentTarget.value
        });
    }
    // controlamos la cadena para la consulta de empresas
    onCheckboxChange = (e) => {
        switch(e.target.value){
            case '7':
                if(this.state.odm){
                    this.setState({odm: false});
                }else{
                    this.setState({odm: true});
                }
                break;
            case '8':
                if(this.state.omex){
                    this.setState({omex: false});
                }else{
                    this.setState({omex: true});
                }
                break;
            case '21':
                if(this.state.ne){
                    this.setState({ne: false});
                }else{
                    this.setState({ne: true});
                }
                break;
            case '30':
                if(this.state.itv){
                    this.setState({itv: false});
                }else{
                    this.setState({itv: true});
                }
                break;
            case '31':
                if(this.state.ocl){
                    this.setState({ocl: false});
                }else{
                    this.setState({ocl: true});
                }
                break;
            case '38':
                if(this.state.lpl){
                    this.setState({lpl: false});
                }else{
                    this.setState({lpl: true});
                }
                break;
            case '46':
                if(this.state.eno){
                    this.setState({eno: false});
                }else{
                    this.setState({eno: true});
                }
                break;
            case '67':
                if(this.state.tap){
                    this.setState({tap: false});
                }else{
                    this.setState({tap: true});
                }
                break;
            case '69':
                if(this.state.esm){
                    this.setState({esm: false});
                }else{
                    this.setState({esm: true});
                }
                break;
            case '73':
                if(this.state.eta){
                    this.setState({eta: false});
                }else{
                    this.setState({eta: true});
                }
                break;
            default:
                break;
        }
    }
    formatearFecha(fecha){
        dia = '';
        mes = '';
        year = '';
        if(fecha.getDate() < 10){
            dia = '0' + fecha.getDate();
        }else{
            dia = fecha.getDate().toString();
        }
        mes = (fecha.getMonth() + 1)
        if(mes < 10){
            mes = '0' + mes;
        }
        year = fecha.getFullYear();
        return year + '-' + mes + '-' + dia + 'T00:00:00.000Z';
    }
    async getReporteConcentrado(liqs){
        sumaTotalIngresosOrdinarias = 0;
        sumaTotalTarifasOrdinarias = 0;
        sumaTotalIngresosExtras = 0;
        sumaTotalTarifasExtras = 0;
        sumaTotalIngresos = 0;
        sumaTotalTarifas = 0;
        sumaTotalKmOrdinarias = 0;
        sumaTotalKmExtras = 0;
        sumaTotalKm = 0;
        sumatoriaAsientosOrdinarias = 0;
        sumatoriaAsientosExtras = 0;
        sumatoriaAsientos = 0;
        var contador = 0;
        var contadorOrdinarias = 0;
        var contadorExtras = 0;
        this.setState({
            cargando: true
        });
        for(var i = 0; i < liqs.length; i++){
            //  controlamos las variables para el cargador
            const control = (i / liqs.length) * 100;
            this.setState({
                cargado: control.toFixed(1)
            });
            // consultamos el tipo de servicio
            const result = await this.consultarServicio(liqs[i].Rol);
            const Servicio = result.servicio;
            const Asientos = parseInt(result.asientos);
            liqs[i].Servicio = Servicio;
            // Obtener la tarifa sin el IVA
            const tarifa = await this.consultarTarifa(liqs[i].Compania, 
                liqs[i].Fecha_Liq, liqs[i].Servicio, 
                liqs[i].Origen, liqs[i].Destino);
            // Agregamos al arreglo la tarifa
            liqs[i].tarifa = parseFloat(tarifa);
            // verificamos si tiene numero de corrida para determinar si es extra
            if(liqs[i].Corrida === 'undefined' || liqs[i].Corrida === 'VACIO'){
                liqs[i].Corrida = '0';
            }
            // Hacemos las sumatorias para todas las liquidaciones
            // Sumamos todos los ingresos para el calculo FPR total
            sumaTotalTarifas = sumaTotalTarifas + liqs[i].tarifa;
            // Sumamos todas las tarifas para el calculo FPR total
            sumaTotalIngresos = sumaTotalIngresos + liqs[i].Ingresos_Oper_1;
            // Sumamos todas las kms para el calculo FT total
            sumaTotalKm = sumaTotalKm + liqs[i].Kms_Op_1;
            // Sumamos todos los asientos para el calculo de % de ocupacion
            sumatoriaAsientos = sumatoriaAsientos + Asientos;
            // contamos todas las corridas para calcular el % de ocupacion
            contador = contador + 1;
            // Verificamos que sea ordinaria o extra
            if(liqs[i].Corrida !== '0'){
                // sumamos para todo el total de ingresos de ordinarias para el resumen de la hoja
                sumaTotalIngresosOrdinarias = sumaTotalIngresosOrdinarias + liqs[i].Ingresos_Oper_1;
                // sumamos para todo el total de kms de ordinarias
                sumaTotalKmOrdinarias = sumaTotalKmOrdinarias + liqs[i].Kms_Op_1;
                // sumamos para todo el total de tarifas de ordinarias para el resumen de la hoja
                sumaTotalTarifasOrdinarias = sumaTotalTarifasOrdinarias + liqs[i].tarifa;
                // Sumamos todos los asientos de ordinarias para el calculo de % de ocupacion
                sumatoriaAsientosOrdinarias = sumatoriaAsientosOrdinarias + Asientos;
                // contamos las corridas ordinarias para calcular el % de ocupacion
                contadorOrdinarias = contadorOrdinarias + 1;
            }else{
                // sumamos para todo el total de ingresos de extras para el resumen de la hoja
                sumaTotalIngresosExtras = sumaTotalIngresosExtras + liqs[i].Ingresos_Oper_1;
                // sumamos para todo el total de kms de extras
                sumaTotalKmExtras = sumaTotalKmExtras + liqs[i].Kms_Op_1;
                // sumamos para todo el total de tarifas de extras para el resumen de la hoja
                sumaTotalTarifasExtras = sumaTotalTarifasExtras + liqs[i].tarifa;
                // Sumamos todos los asientos de extras para el calculo de % de ocupacion
                sumatoriaAsientosExtras = sumatoriaAsientosExtras + Asientos;
                // contamos las corridas extras para calcular el % de ocupacion
                contadorExtras = contadorExtras + 1;
            } // termina if de verificacion de ordinarias
        } // termina for
        // hacemos el calculo para el Factor ocupacion Ordinarias
        factorOcupacionOrdinarias = parseFloat((sumaTotalIngresosOrdinarias / sumaTotalTarifasOrdinarias).toFixed(4));
        // hacemos el calculo para el Factor ocupacion Extras
        factorOcupacionExtras = parseFloat((sumaTotalIngresosExtras / sumaTotalTarifasExtras).toFixed(4));
        // hacemos el calculo para el Factor ocupacion general
        factorOcupacion = parseFloat((sumaTotalIngresos / sumaTotalTarifas).toFixed(4));
        // calculo para el Factor Tarifa Ordinarias
        factorKmOrdinarias = parseFloat((sumaTotalTarifasOrdinarias / sumaTotalKmOrdinarias).toFixed(4));
        // calculo para el Factor Tarifa Extras
        factorKmExtras = parseFloat((sumaTotalTarifasExtras / sumaTotalKmExtras).toFixed(4));
        // calculo para el Factor Tarifa general
        factorKm = parseFloat((sumaTotalTarifas / sumaTotalKm).toFixed(4));
        
        // calculo de porcentaje de ocupacion ordinarias
        porcentajeOcupacionOrdinarias = ((factorOcupacionOrdinarias / (sumatoriaAsientosOrdinarias / contadorOrdinarias)) * 100).toFixed(2) + '%';
        // calculo de porcentaje de ocupacion extras
        porcentajeOcupacionExtras = ((factorOcupacionExtras / (sumatoriaAsientosExtras / contadorExtras)) * 100).toFixed(2) + '%';
        // calculo de porcentaje de ocupacion general
        porcentajeOcupacion = ((factorOcupacion / (sumatoriaAsientos / contador)) * 100).toFixed(2) + '%';

        // creamos la hoja para el reporte
        hojaFactores = [
            {
                'Corridas': 'Ordinarias',
                'FactorOcupacion': factorOcupacionOrdinarias,
                'FactorTarifa': factorKmOrdinarias,
                'PorcentajeOcupacion': porcentajeOcupacionOrdinarias
            },
            {
                'Corridas': 'Extras',
                'FactorOcupacion': factorOcupacionExtras,
                'FactorTarifa': factorKmExtras,
                'PorcentajeOcupacion': porcentajeOcupacionExtras
            },
            {
                'Corridas': 'Total',
                'FactorOcupacion': factorOcupacion,
                'FactorTarifa': factorKm,
                'PorcentajeOcupacion': porcentajeOcupacion
            }
        ];
        //Asignamos el arreglo con todos los campos necesarios
        this.setState({
            cargadosFactores: true,
            cargadosFactoresConcentrados: true,
            cargando: false,
            reportFailed: false
        });
    } // termina metodo getReporteConcentrado
    async getReporteExtendido(res){
        sumaTotalIngresosOrdinarias = 0;
        sumaTotalTarifasOrdinarias = 0;
        sumaTotalIngresosExtras = 0;
        sumaTotalTarifasExtras = 0;
        sumaTotalIngresos = 0;
        sumaTotalTarifas = 0;
        sumaTotalKmOrdinarias = 0;
        sumaTotalKmExtras = 0;
        sumaTotalKm = 0;
        var sumatoriaTotalAsientosOrdinarias = 0;
        var sumatoriaTotalAsientosExtras = 0;
        sumatoriaAsientosOrdinarias = [];
        sumatoriaAsientosExtras = [];
        sumatoriaAsientos = [];
        var sumatoriaTotalAsientos = 0;
        var contadorTotal = 0;
        var contador = [];
        var contadorTotalOrdinarias = 0;
        var contadorTotalExtras = 0;
        var contadorOrdinarias = [];
        var contadorExtras = [];
        this.setState({
            cargando: true
        });
        for(var i = 0; i < res.data[0].length; i++){
            const control = (i / res.data[0].length) * 100;
            this.setState({
                cargado: control.toFixed(1)
            });
            // Consultamos la sigla de la Zona
            const Zona = await this.consultarZona(res.data[0][i].Compania, res.data[0][i].Origen);
            // Agregamos al arreglo la Zona
            res.data[0][i].Zona = Zona;
            // consultamos el tipo de servicio
            const res1 = await this.consultarServicio(res.data[0][i].Rol);
            const Servicio = res1.servicio;
            const Asientos = parseInt(res1.asientos);
            res.data[0][i].Servicio = Servicio;
            // Obtener la tarifa sin el IVA
            const tarifa = await this.consultarTarifa(res.data[0][i].Compania, 
                res.data[0][i].Fecha_Liq, res.data[0][i].Servicio, 
                res.data[0][i].Origen, res.data[0][i].Destino);
            // Agregamos al arreglo la tarifa
            res.data[0][i].tarifa = parseFloat(tarifa);
            // Verificamos que la tarifa sea mayor que 0 para calcular el FPR y FT
            if(res.data[0][i].tarifa > 0){
                // Calcular el FPR
                const FPR = res.data[0][i].Ingresos_Oper_1 / res.data[0][i].tarifa;
                // Agregamos al arreglo el FPR
                res.data[0][i].FPR = FPR;
                // Calcular el FT
                const FT = res.data[0][i].tarifa / res.data[0][i].Kms_Op_1;
                // Agregamos al arreglo el FT
                res.data[0][i].FT = FT.toFixed(4);
            } else{
                res.data[0][i].FPR = 0;
                res.data[0][i].FT = 0;
            }
            // verificamos si tiene numero de corrida para determinar si es extra
            if(res.data[0][i].Corrida === 'undefined' || res.data[0][i].Corrida === 'VACIO'){
                res.data[0][i].Corrida = '0';
            }
            // Hacemos las sumatorias para todas las liquidaciones
            // Sumamos todos los ingresos para el calculo FPR total
            sumaTotalTarifas = sumaTotalTarifas + res.data[0][i].tarifa;
            // Sumamos todas las tarifas para el calculo FPR total
            sumaTotalIngresos = sumaTotalIngresos + res.data[0][i].Ingresos_Oper_1;
            // Sumamos todas las kms para el calculo FT total
            sumaTotalKm = sumaTotalKm + res.data[0][i].Kms_Op_1;

            // sumamos todos los asientos 
            sumatoriaTotalAsientos = sumatoriaTotalAsientos + Asientos;
            // sumamos todas las corridas
            contadorTotal = contadorTotal + 1;            
            
            // sumamos los asientos y las corridas por zona
            if(sumatoriaAsientos[res.data[0][i].Zona]){
                sumatoriaAsientos[res.data[0][i].Zona] = sumatoriaAsientos[res.data[0][i].Zona] + Asientos;
                contador[res.data[0][i].Zona] = contador[res.data[0][i].Zona] + 1;
            }else{
                sumatoriaAsientos[res.data[0][i].Zona] = Asientos;
                contador[res.data[0][i].Zona] = 1;
            }
            // Sumatoria de todos los ingresos por zona
            if(sumatoriaIngresos[res.data[0][i].Zona]){
                sumatoriaIngresos[res.data[0][i].Zona] = sumatoriaIngresos[res.data[0][i].Zona] + res.data[0][i].Ingresos_Oper_1;
            }else{
                sumatoriaIngresos[res.data[0][i].Zona] = res.data[0][i].Ingresos_Oper_1;
            }
            // Sumatoria de todas las tarifas por zona
            if(sumatoriaTarifas[res.data[0][i].Zona]){
                sumatoriaTarifas[res.data[0][i].Zona] = sumatoriaTarifas[res.data[0][i].Zona] + res.data[0][i].tarifa;
            }else{
                sumatoriaTarifas[res.data[0][i].Zona] = res.data[0][i].tarifa;
            }
            // Sumatoria de todos los kms por zona
            if(sumatoriaKm[res.data[0][i].Zona]){
                sumatoriaKm[res.data[0][i].Zona] = sumatoriaKm[res.data[0][i].Zona] + res.data[0][i].Kms_Op_1;
            }else{
                sumatoriaKm[res.data[0][i].Zona] = res.data[0][i].Kms_Op_1;
            }
            // Verificamos que sea ordinaria o extra
            if(res.data[0][i].Corrida !== '0'){
                // sumamos los asientos y las corridas ordinarias
                sumatoriaTotalAsientosOrdinarias = sumatoriaTotalAsientosOrdinarias + Asientos;
                // sumamos las corridas ordinarias
                contadorTotalOrdinarias = contadorTotalOrdinarias + 1;
                // sumamos para todo el total de ingresos de ordinarias para el resumen de la hoja
                sumaTotalIngresosOrdinarias = sumaTotalIngresosOrdinarias + res.data[0][i].Ingresos_Oper_1;
                // sumamos para todo el total de kms de ordinarias
                sumaTotalKmOrdinarias = sumaTotalKmOrdinarias + res.data[0][i].Kms_Op_1;
                // sumatorias de ingresos ordinarias
                if(sumatoriaIngresosOrdinarias[res.data[0][i].Zona]){
                    sumatoriaIngresosOrdinarias[res.data[0][i].Zona] = sumatoriaIngresosOrdinarias[res.data[0][i].Zona] + res.data[0][i].Ingresos_Oper_1;
                }else{
                    sumatoriaIngresosOrdinarias[res.data[0][i].Zona] = res.data[0][i].Ingresos_Oper_1;
                }
                // sumamos para todo el total de ingresos de ordinarias para el resumen de la hoja
                sumaTotalTarifasOrdinarias = sumaTotalTarifasOrdinarias + res.data[0][i].tarifa;
                // sumatorias de tarifas ordinarias
                if(sumatoriaTarifasOrdinarias[res.data[0][i].Zona]){
                    sumatoriaTarifasOrdinarias[res.data[0][i].Zona] = sumatoriaTarifasOrdinarias[res.data[0][i].Zona] + res.data[0][i].tarifa;
                }else{
                    sumatoriaTarifasOrdinarias[res.data[0][i].Zona] = res.data[0][i].tarifa;
                }
                // sumatoria de kms ordinarias
                if(sumatoriaKmOrdinarias[res.data[0][i].Zona]){
                    sumatoriaKmOrdinarias[res.data[0][i].Zona] = sumatoriaKmOrdinarias[res.data[0][i].Zona] + res.data[0][i].Kms_Op_1;
                }else{
                    sumatoriaKmOrdinarias[res.data[0][i].Zona] = res.data[0][i].Kms_Op_1;
                }
                // sumamos los asientos y las corridas por zona ordinarias
                if(sumatoriaAsientosOrdinarias[res.data[0][i].Zona]){
                    sumatoriaAsientosOrdinarias[res.data[0][i].Zona] = sumatoriaAsientosOrdinarias[res.data[0][i].Zona] + Asientos;
                    contadorOrdinarias[res.data[0][i].Zona] = contadorOrdinarias[res.data[0][i].Zona] + 1;
                }else{
                    sumatoriaAsientosOrdinarias[res.data[0][i].Zona] = Asientos;
                    contadorOrdinarias[res.data[0][i].Zona] = 1;
                }
            }else{
                // sumamos los asientos y las corridas ordinarias
                sumatoriaTotalAsientosExtras = sumatoriaTotalAsientosExtras + Asientos;
                // sumamos las corridas ordinarias
                contadorTotalExtras = contadorTotalExtras + 1;

                // sumamos para todo el total de ingresos de extras para el resumen de la hoja
                sumaTotalIngresosExtras = sumaTotalIngresosExtras + res.data[0][i].Ingresos_Oper_1;
                // sumamos para todo el total de kms de extras
                sumaTotalKmExtras = sumaTotalKmExtras + res.data[0][i].Kms_Op_1;
                // sumatorias de ingresos extras
                if(sumatoriaIngresosExtras[res.data[0][i].Zona]){
                    sumatoriaIngresosExtras[res.data[0][i].Zona] = sumatoriaIngresosExtras[res.data[0][i].Zona] + res.data[0][i].Ingresos_Oper_1;
                }else{
                    sumatoriaIngresosExtras[res.data[0][i].Zona] = res.data[0][i].Ingresos_Oper_1;
                }
                // sumamos para todo el total de tarifas de extras para el resumen de la hoja
                sumaTotalTarifasExtras = sumaTotalTarifasExtras + res.data[0][i].tarifa;
                // sumatorias de tarifas extras
                if(sumatoriaTarifasExtras[res.data[0][i].Zona]){
                    sumatoriaTarifasExtras[res.data[0][i].Zona] = sumatoriaTarifasExtras[res.data[0][i].Zona] + res.data[0][i].tarifa;
                }else{
                    sumatoriaTarifasExtras[res.data[0][i].Zona] = res.data[0][i].tarifa;
                }
                // sumatoria de kms ordinarias
                if(sumatoriaKmExtras[res.data[0][i].Zona]){
                    sumatoriaKmExtras[res.data[0][i].Zona] = sumatoriaKmExtras[res.data[0][i].Zona] + res.data[0][i].Kms_Op_1;
                }else{
                    sumatoriaKmExtras[res.data[0][i].Zona] = res.data[0][i].Kms_Op_1;
                }
                // sumamos los asientos y las corridas por zona ordinarias
                if(sumatoriaAsientosExtras[res.data[0][i].Zona]){
                    sumatoriaAsientosExtras[res.data[0][i].Zona] = sumatoriaAsientosExtras[res.data[0][i].Zona] + Asientos;
                    contadorExtras[res.data[0][i].Zona] = contadorExtras[res.data[0][i].Zona] + 1;
                }else{
                    sumatoriaAsientosExtras[res.data[0][i].Zona] = Asientos;
                    contadorExtras[res.data[0][i].Zona] = 1;
                }
            }
            // Creamos el arreglo de datos para la hoja de excel de liquidaciones
            hojaLiquidaciones[i] = {
                'Compania': res.data[0][i].Compania,
                'Descripcion_Servicio': res.data[0][i].Servicio,
                'Rol': res.data[0][i].Rol,
                'Corrida': res.data[0][i].Corrida,
                'Zona': res.data[0][i].Zona,
                'Origen': res.data[0][i].Origen,
                'Destino': res.data[0][i].Destino,
                'Tarifa': res.data[0][i].tarifa,
                'Autobus': res.data[0][i].Autobus,
                'Fecha_Liq': res.data[0][i].Fecha_Liq,
                'Kms_Op_1': res.data[0][i].Kms_Op_1,
                'Boletos': res.data[0][i].Boletos,
                'Ingresos_Oper_1': res.data[0][i].Ingresos_Oper_1,
                'FPR': res.data[0][i].FPR,
                'FT': res.data[0][i].FT
            }
        }
        // hacemos el calculo de el factor ocupacion
        var aux = 0;
        const zonas = Object.keys(sumatoriaTarifas);
        zonas.map(zona => {
            factorOcupacionOrdinarias[zona] = parseFloat((sumatoriaIngresosOrdinarias[zona] / sumatoriaTarifasOrdinarias[zona]).toFixed(4));
            factorOcupacionExtras[zona] = parseFloat((sumatoriaIngresosExtras[zona] / sumatoriaTarifasExtras[zona]).toFixed(4));
            factorOcupacion[zona] = parseFloat((sumatoriaIngresos[zona] / sumatoriaTarifas[zona]).toFixed(4));
            factorKmOrdinarias[zona] = parseFloat((sumatoriaTarifasOrdinarias[zona] / sumatoriaKmOrdinarias[zona]).toFixed(4));
            factorKmExtras[zona] = parseFloat((sumatoriaTarifasExtras[zona] / sumatoriaKmExtras[zona]).toFixed(4));
            factorKm[zona] = parseFloat((sumatoriaTarifas[zona] / sumatoriaKm[zona]).toFixed(4));
            hojaFactorOcupacionOrdinarias[aux] = {
                'Zona': zona,
                'FactorOcupacionOrdinarias': factorOcupacionOrdinarias[zona],
                'PorcentajeOcupacion': ((factorOcupacionOrdinarias[zona] / (sumatoriaAsientosOrdinarias[zona] / contadorOrdinarias[zona])) * 100).toFixed(2) + '%'
            }
            hojaFactorOcupacionExtras[aux] = {
                'Zona': zona,
                'FactorOcupacionExtras': factorOcupacionExtras[zona],
                'PorcentajeOcupacion': ((factorOcupacionExtras[zona] / (sumatoriaAsientosExtras[zona] / contadorExtras[zona])) * 100).toFixed(2) + '%'
            }
            hojaFactorOcupacion[aux] = {
                'Zona': zona,
                'FactorOcupacion': factorOcupacion[zona],
                'PorcentajeOcupacion': ((factorOcupacion[zona] / (sumatoriaAsientos[zona] / contador[zona])) * 100).toFixed(2) + '%'
            }
            hojaFactorFt[aux] = {
                'Zona': zona,
                'FactorTarifa': factorKm[zona]
            }
            hojaFactorFtOrdinarias[aux] = {
                'Zona': zona,
                'FactorTarifaOrdinarias': factorKmOrdinarias[zona]
            }
            hojaFactorFtExtras[aux] = {
                'Zona': zona,
                'FactorTarifaExtras': factorKmExtras[zona]
            }
            aux = aux + 1;
            return true;
        });
        hojaFactorOcupacionOrdinarias[aux] = {
            'Zona': 'Total',
            'FactorOcupacionOrdinarias': parseFloat((sumaTotalIngresosOrdinarias / sumaTotalTarifasOrdinarias).toFixed(4)),
            'PorcentajeOcupacion': (((parseFloat((sumaTotalIngresosOrdinarias / sumaTotalTarifasOrdinarias).toFixed(4))) / (sumatoriaTotalAsientosOrdinarias / contadorTotalOrdinarias)) * 100).toFixed(2) + '%'
        }
        hojaFactorOcupacionExtras[aux] = {
            'Zona': 'Total',
            'FactorOcupacionExtras': parseFloat((sumaTotalIngresosExtras / sumaTotalTarifasExtras).toFixed(4)),
            'PorcentajeOcupacion': (((parseFloat((sumaTotalIngresosExtras / sumaTotalTarifasExtras).toFixed(4))) / (sumatoriaTotalAsientosExtras / contadorTotalExtras)) * 100).toFixed(2) + '%'
        }
        hojaFactorOcupacion[aux] = {
            'Zona': 'Total',
            'FactorOcupacion': parseFloat((sumaTotalIngresos / sumaTotalTarifas).toFixed(4)),
            'PorcentajeOcupacion': (((parseFloat((sumaTotalIngresos / sumaTotalTarifas).toFixed(4))) / (sumatoriaTotalAsientos / contadorTotal)) * 100).toFixed(2) + '%'
        }
        hojaFactorFt[aux] = {
            'Zona': 'Total',
            'FactorTarifa': parseFloat((sumaTotalTarifas / sumaTotalKm).toFixed(4))
        }
        hojaFactorFtOrdinarias[aux] = {
            'Zona': 'Total',
            'FactorTarifaOrdinarias': parseFloat((sumaTotalTarifasOrdinarias / sumaTotalKmOrdinarias).toFixed(4))
        }
        hojaFactorFtExtras[aux] = {
            'Zona': 'Total',
            'FactorTarifaExtras': parseFloat((sumaTotalTarifasExtras / sumaTotalKmExtras).toFixed(4))
        }
        //Asignamos el arreglo con todos los campos necesarios
        this.setState({
            cargadosFactoresExtendidos: true,
            cargadosFactores: true,
            cargando: false,
            reportFailed: false
        });
    }// termina metodo getReporteExtendido
    onSubmit = async (e) => {
        e.preventDefault();
        // formateamos las fechas para hacer la consulta
        const fechaInicio = this.formatearFecha(this.state.fechaInicio);
        const fechaTermino = this.formatearFecha(this.state.fechaTermino);
        // creamos el string con las compañias para la consulta
        var stringCompanias = "";
        if(this.state.odm){stringCompanias = "7";}
        if(this.state.omex){if(stringCompanias === ""){stringCompanias = "8";}else{stringCompanias = stringCompanias + "-8";}}
        if(this.state.ne){if(stringCompanias === ""){stringCompanias = "21";}else{stringCompanias = stringCompanias + "-21";}}
        if(this.state.itv){if(stringCompanias === ""){stringCompanias = "30";}else{stringCompanias = stringCompanias + "-30";}}
        if(this.state.ocl){if(stringCompanias === ""){stringCompanias = "31";}else{stringCompanias = stringCompanias + "-31";}}
        if(this.state.lpl){if(stringCompanias === ""){stringCompanias = "38";}else{stringCompanias = stringCompanias + "-38";}}
        if(this.state.eno){if(stringCompanias === ""){stringCompanias = "46";}else{stringCompanias = stringCompanias + "-46";}}
        if(this.state.tap){if(stringCompanias === ""){stringCompanias = "67";}else{stringCompanias = stringCompanias + "-67";}}
        if(this.state.esm){if(stringCompanias === ""){stringCompanias = "69";}else{stringCompanias = stringCompanias + "-69";}}
        if(this.state.eta){if(stringCompanias === ""){stringCompanias = "73";}else{stringCompanias = stringCompanias + "-73";}}
        // hacemos la consulta de todas las liquidaciones requeridas
        const res = await axios.get(ip + "/liquidacionimp/" + stringCompanias + "/" + fechaInicio + "/" + fechaTermino);
        // Verificamos que la consulta tenga resultados para seguir con el reporte
        if(res.data[0].length < 1){
            // Para que aparezca el mensaje de error
            this.setState({
                reportFailed: true
            });
        }else{
            // Verificamos que tipo de reporte estan solicitando
            if(this.state.tipoReporte !== ""){  
                if(this.state.tipoReporte === "extendido"){
                    await this.getReporteExtendido(res);
                }else{
                    await this.getReporteConcentrado(res.data[0]);
                }
            }else{
                // Para que aparezca el mensaje de error
                this.setState({
                    reportFailed: true
                });
            }   
        }
    } // termina metodo onSubmit
    async consultarServicio(rol){
        const res = await axios.get(ip + "/servicios/" + rol);
        return res.data;
    }
    async consultarZona(compania, origen){
        const res = await axios.get(ip + "/lugarod/" + compania + "/" + origen);
        return res.data.siglaZona;
    }
    async consultarTarifa(cia, fecha, servicio, origen, destino){
        // convertimos la fecha en un dato valido para la consulta
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        var stringFecha = "";
        var mes = parseInt(fecha.substr(5, 2)) - 1;
        mes = meses[mes];
        var year = fecha.substr(2, 2);
        stringFecha = mes + year;
        // hacemos la consulta
        const res = await axios.get(ip + '/tarifas/' + cia + '/' + stringFecha + '/' + 
            servicio + '/' + origen + '/' + destino);
        const tarifa = res.data.tarifa;
        return tarifa.toFixed(2);
    }

    render() {
        return (
            <div className="contenedor-factores">
                <h2>Factor Ocupación y Factor Tarifa</h2>
                {
                    !this.state.cargadosFactores ?
                        <Form onSubmit={this.onSubmit}>
                            {
                                this.state.reportFailed ?
                                    <Alert variant="danger">No hay datos con las condiciones solicitadas</Alert> :
                                    null
                            }
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Seleccione las empresas que desea incluir</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="ODM - 7"
                                    value="7"
                                    name="ODM"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="OMEX - 8"
                                    value="8"
                                    name="OMEX"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="NE - 21"
                                    value="21"
                                    name="NE"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="ITV - 30"
                                    value="30"
                                    name="ITV"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="OCL - 31"
                                    value="31"
                                    name="OCL"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="LPL - 38"
                                    value="38"
                                    name="LPL"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="ENO - 46"
                                    value="46"
                                    name="ENO"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="TAP - 67"
                                    value="67"
                                    name="TAP"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="ESM - 69"
                                    value="69"
                                    name="ESM"
                                    onChange={this.onCheckboxChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="ETA - 73"
                                    value="73"
                                    name="ETA"
                                    onChange={this.onCheckboxChange}
                                />
                            </Form.Group>

                            <p className="label-fecha">Tipo de reporte</p>
                            <Form.Check
                                type="radio"
                                id="reporte-extendido"
                                label="Extendido"
                                name="reporte"
                                value="extendido"
                                onChange={this.onReportChange}
                            />
                            <Form.Check
                                type="radio"
                                id="reporte-concentrado"
                                label="Concentrado"
                                name="reporte"
                                value="concentrado"
                                onChange={this.onReportChange}
                            />
                            <p className="label-fecha">Fecha de inicio</p>
                            <DatePicker 
                                dateFormat="dd/MM/yyyy"
                                onChange={this.onChangeDateInit}
                                selected={this.state.fechaInicio}
                                maxDate={new Date()}
                                className="fechaInicio"
                                id="fechaInicio"
                                name="fechaInicio"
                            />
                            <p className="label-fecha">Fecha de término</p>
                            <DatePicker 
                                dateFormat="dd/MM/yyyy"
                                onChange={this.onChangeDateTerm}
                                selected={this.state.fechaTermino}
                                maxDate={new Date()}
                                className="fechaTermino"
                                id="fechaTermino"
                                name="fechaTermino"
                            />
                            {
                                !this.state.cargando ?
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        className="boton-submit"
                                        >
                                            Generar
                                    </Button> :
                                    null
                            }
                        </Form> :
                        null
                }
                {
                    this.state.cargando ?
                        <ProgressBar now={this.state.cargado} animated label={`${this.state.cargado}%`} className="bar" /> :
                        null
                }
                {
                    this.state.cargadosFactoresExtendidos ?
                        <div className="contenedor-boton">
                            <Alert variant="success">Reporte generado con exito!</Alert>
                            <ExcelFile element={<Button className="boton-descargar">Descargar reporte</Button>}>
                                <ExcelSheet data={hojaLiquidaciones} name="Liquidaciones">
                                    <ExcelColumn label="Compania" value="Compania"/>
                                    <ExcelColumn label="Descripcion_Servicio" value="Descripcion_Servicio"/>
                                    <ExcelColumn label="Rol" value="Rol"/>
                                    <ExcelColumn label="Zona" value="Zona"/>
                                    <ExcelColumn label="Origen" value="Origen"/>
                                    <ExcelColumn label="Destino" value="Destino"/>
                                    <ExcelColumn label="Tarifa" value="Tarifa"/>
                                    <ExcelColumn label="Autobus" value="Autobus"/>
                                    <ExcelColumn label="Fecha_Liq" value="Fecha_Liq"/>
                                    <ExcelColumn label="Kms_Op_1" value="Kms_Op_1"/>
                                    <ExcelColumn label="Boletos" value="Boletos"/>
                                    <ExcelColumn label="Ingresos_Oper_1" value="Ingresos_Oper_1"/>
                                    <ExcelColumn label="FPR" value="FPR"/>
                                    <ExcelColumn label="FT" value="FT"/>
                                </ExcelSheet>
                                <ExcelSheet data={hojaFactorOcupacion} name="Factor Ocupacion">
                                    <ExcelColumn label="Zona" value="Zona"/>
                                    <ExcelColumn label="FactorOcupacion" value="FactorOcupacion"/>
                                    <ExcelColumn label="PorcentajeOcupacion" value="PorcentajeOcupacion"/>
                                </ExcelSheet>
                                <ExcelSheet data={hojaFactorOcupacionOrdinarias} name="Factor Ocupacion Ordinarias">
                                    <ExcelColumn label="Zona" value="Zona"/>
                                    <ExcelColumn label="FactorOcupacionOrdinarias" value="FactorOcupacionOrdinarias"/>
                                    <ExcelColumn label="PorcentajeOcupacion" value="PorcentajeOcupacion"/>
                                </ExcelSheet>
                                <ExcelSheet data={hojaFactorOcupacionExtras} name="Factor Ocupacion Extras">
                                    <ExcelColumn label="Zona" value="Zona"/>
                                    <ExcelColumn label="FactorOcupacionExtras" value="FactorOcupacionExtras"/>
                                    <ExcelColumn label="PorcentajeOcupacion" value="PorcentajeOcupacion"/>
                                </ExcelSheet>
                                <ExcelSheet data={hojaFactorFt} name="Factor Tarifa">
                                    <ExcelColumn label="Zona" value="Zona"/>
                                    <ExcelColumn label="FactorTarifa" value="FactorTarifa"/>
                                </ExcelSheet>
                                <ExcelSheet data={hojaFactorFtOrdinarias} name="Factor Tarifa Ordinarias">
                                    <ExcelColumn label="Zona" value="Zona"/>
                                    <ExcelColumn label="FactorTarifaOrdinarias" value="FactorTarifaOrdinarias"/>
                                </ExcelSheet>
                                <ExcelSheet data={hojaFactorFtExtras} name="Factor Tarifa Extras">
                                    <ExcelColumn label="Zona" value="Zona"/>
                                    <ExcelColumn label="FactorTarifaExtras" value="FactorTarifaExtras"/>
                                </ExcelSheet>
                            </ExcelFile>
                        </div> : 
                        null
                }
                {
                    this.state.cargadosFactoresConcentrados ?
                        <div className="contenedor-boton">
                            <Alert variant="success">Reporte generado con exito!</Alert>
                            <ExcelFile element={<Button className="boton-descargar">Descargar reporte</Button>}>
                                <ExcelSheet data={hojaFactores} name="Factores">
                                    <ExcelColumn label="Corridas" value="Corridas"/>
                                    <ExcelColumn label="FactorOcupacion" value="FactorOcupacion"/>
                                    <ExcelColumn label="FactorTarifa" value="FactorTarifa"/>
                                    <ExcelColumn label="PorcentajeOcupacion" value="PorcentajeOcupacion"/>
                                </ExcelSheet>
                            </ExcelFile>
                        </div> : 
                        null
                }
            </div>
        );
    }
}

export default GenerarFactorOcupacion;