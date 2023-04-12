import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import { Snackbar } from '@mui/material';
import AddCar from './AddCar';
import EditCar from './EditCar';
import {API_URL} from '../constants';

function Carlist (){

const [cars, setCars] = useState([]);
const [open, setOpen] = useState(false);  // boolean state
const [msg, setMsg] = useState('');

const [columnDefs] = useState([
    {field: 'brand', filter: true, sortable: true},
    {field: 'model', filter: true, sortable: true},
    {field: 'color', filter: true, sortable: true, width: 150},
    {field: 'fuel', filter: true, sortable: true, width: 100},
    {field: 'year', filter: true,  sortable: true, width: 100},
    {field: 'price', filter: true,  sortable: true, width: 100},
    {cellRenderer: params => <EditCar updateCar={updateCar} params={params.data} />, width: 120},
    {cellRenderer: params => 
        <Button size="small" color="error" onClick={() => deleteCar(params)}>
                Delete
        </Button>, 
        width: 120}
])

useEffect(()=> {
   getCars();
   
}, []);  // tyhjä taulukko, haku ensimmäisen renderöinnin jälkeen

const getCars = () =>{
    fetch(API_URL)
   .then(response => response.json())
   .then(data => setCars(data._embedded.cars))
   .catch(err => console.error(err))
}

const deleteCar = (params) => {
    // console.log(params); // tutki tätä ensin
    // console.log(params.data._links.car.href); tutki toka
   if (window.confirm('Are you sure')){
    fetch(params.data._links.car.href, {method: 'DELETE'})
    .then(response => {
        if (response.ok){
            setMsg('Car deleted successfully');
            setOpen(true);
            getCars();  // haetaan tietokannasta muuttunut tilanne, jossa mukana myös muiden käyttäjien muutokset
                        // staten päivitys ei toisi esille muiden käyttäjien muutoksia
        } else
           alert('Something went wrong in deletion: ' + response.status);   
    })
    .catch(err => console.error(err)); // console.log/console.error/console.warning
 }
}

const addCar = (car) => {
    fetch(API_URL, {
        method:'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(car)
    })
    .then(response => {
        if (response.ok)
            getCars();
        else 
            alert('Something went wrong when adding a new car');    
    })
    .catch(err => console.error(err))
}

const updateCar = (url, updatedCar) => {
    fetch(url, {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(updatedCar)
    })
    .then(response => {
        if (response.ok){
            setMsg('Car updated successfully');
            setOpen(true);
            getCars();
        } else  
            alert('Something went wrong when updating a car' + response.statusText);  
    })
    .catch(err => console.error(err))
}


return (
 <>
 <AddCar addCar={addCar} />
 <h1>Carlist</h1>
 <div 
    className='ag-theme-material' 
    style={{height: 600, width: '90%', margin:'auto'}}
>
<AgGridReact
    pagination={true}
    paginationPageSize={10}
    rowData={cars}
    columnDefs={columnDefs}
/>
<Snackbar
    open={open}
    autoHideDuration={3000}
    onClose= { () => setOpen(false)} 
    message = {msg}
/>
 </div>
 </>
);

}

export default Carlist;