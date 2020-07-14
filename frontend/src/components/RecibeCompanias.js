import React, { Component } from 'react';
import * as XLSX from "xlsx";
import axios from 'axios';
const ip = "http://localhost:4000";

class RecibeCompanias extends Component {
    handleInputChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        let hojas = [];
        if (name === 'file'){
            let reader = new FileReader();
            reader.readAsArrayBuffer(target.files[0]);
            reader.onloadend = async (e) => {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {type: 'array'});
                var XL_row_object = await XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Consulta']);
                console.log(XL_row_object);
                await axios.post(ip + '/companias', XL_row_object);
            }
        }
    }
    render() {
        return (
            <div>
                <h3>Ingresa el excel con las companias de SQL Server</h3>
                <br></br>
                <input 
                    required
                    type="file"
                    name="file"
                    id="file"
                    onChange={this.handleInputChange}
                    placeholder="Archivo de Excel"
                />
            </div>
        );
    }
}

export default RecibeCompanias;