import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Navbar, Nav, Button } from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Aggiungi questo import
import { setFalse } from '../redux/slice/authReducer';
import { Trash } from 'react-bootstrap-icons';

function Home() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth);
    const dispatch = useDispatch(); // Ottieni lo stato del flag

    useEffect(() => {
        // Se non autenticato, naviga alla pagina di login
        if (!isAuthenticated) {
            navigate('/');
        } else {
            const fetchData = async () => {
                const response = await axios.get('http://localhost:5000/rubrica');
                const dataWithIds = response.data.map((row, index) => {
                    // Se la data di nascita è null, sostituiscila con una stringa vuota
                    if (row.data_di_nascita === 'None') {
                        row.data_di_nascita = '';
                    }
                    return { id: index, ...row };
                });
                setRows(dataWithIds);
            };
            fetchData();
        }
    }, [isAuthenticated, navigate]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/rubrica`, { data: { id } }); // Mandiamo un DELETE request con l'ID del record
            // Filtriamo le righe per rimuovere la riga cancellata
            setRows(rows.filter(row => row.id !== id));
        } catch (error) {
            console.error("Errore durante la cancellazione del record:", error);
        }
    };
    

    const columns = [
        
        { field: 'nome', headerName: 'Nome', width: 150 },
        { field: 'cognome', headerName: 'Cognome', width: 150 },
        { field: 'sesso', headerName: 'Sesso', width: 120 },
        { field: 'data_di_nascita', headerName: 'Data di nascita', width: 200 },
        { field: 'numero_di_telefono', headerName: 'Numero di telefono', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'citta', headerName: 'Città', width: 150 },
        {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 100,
            renderCell: (params) => {
                return <Trash onClick={() => handleDelete(params.row.id)} />;
            },
        },
    ];

    const handleLogout = () => {
        dispatch(setFalse());
        navigate('/');
    };

    return (
        <div>
            <Navbar bg="light" expand="lg" className="d-flex flex-column">
                <div className="w-100">
                    <Navbar.Brand >Rubrica</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/AddContatto">Aggiungi contatto</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                
                <Nav className="ml-auto mt-auto">
                    <Button variant="outline-secondary" onClick={handleLogout}>
                        <BoxArrowRight size={24} /> Logout
                    </Button>
                </Nav>
                </div>
            </Navbar>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid 
                    rows={rows} 
                    columns={columns}  
                    components={{
                        Toolbar: GridToolbar,
                    }} 
                />
            </div>
        </div>
    );
}

export default Home;
