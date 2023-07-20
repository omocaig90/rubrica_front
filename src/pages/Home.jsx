import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import { BoxArrowRight, Trash, Eye } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFalse } from '../redux/slice/authReducer';

function Home() {
    const [rows, setRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
            const fetchData = async () => {
                const response = await axios.get('http://localhost:5000/rubrica');
                const dataWithIds = response.data.map((row, index) => {
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
            await axios.delete(`http://localhost:5000/rubrica`, { data: { id } });
            setRows(rows.filter(row => row.id !== id));
        } catch (error) {
            console.error("Errore durante la cancellazione del record:", error);
        }
    };

    const handleDetail = (rowData) => {
        setSelectedRow(rowData);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
            field: 'detail',
            headerName: 'Dettaglio',
            sortable: false,
            width: 100,
            renderCell: (params) => {
                return <Eye onClick={() => handleDetail(params.row)} />;
            },
        },
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
                    <Navbar.Brand>Rubrica</Navbar.Brand>
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
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dettaglio Contatto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRow && (
                        <div>
                            <p><strong>Nome:</strong> {selectedRow.nome}</p>
                            <p><strong>Cognome:</strong> {selectedRow.cognome}</p>
                            <p><strong>Sesso:</strong> {selectedRow.sesso}</p>
                            <p><strong>Data di Nascita:</strong> {selectedRow.data_di_nascita}</p>
                            <p><strong>Numero di Telefono:</strong> {selectedRow.numero_di_telefono}</p>
                            <p><strong>Email:</strong> {selectedRow.email}</p>
                            <p><strong>Città:</strong> {selectedRow.citta}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Chiudi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Home;
