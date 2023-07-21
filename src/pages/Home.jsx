import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Navbar, Nav, Button, Modal, Form } from 'react-bootstrap';
import { BoxArrowRight, Trash, Eye, PencilSquare } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFalse } from '../redux/slice/authReducer';
import { Link } from 'react-router-dom';

function Home() {
    const [rows, setRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateForm, setUpdateForm] = useState({});
    const [cittaList, setCittaList] = useState([]);

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
    }, [isAuthenticated, navigate, showUpdateModal]);

    useEffect(() => {
        const fetchCitta = async () => {
            const response = await axios.get('http://localhost:5000/citta');
            setCittaList(response.data);
        };
        fetchCitta();
    }, []);

    const handleUpdate = (rowData) => {
        setSelectedRow(rowData);
        setUpdateForm(rowData);
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
        let submitForm = { ...updateForm };
        if (submitForm.data_di_nascita === '') {
            submitForm.data_di_nascita = null;
        }
        try {
            await axios.put(`http://localhost:5000/rubrica`, submitForm);
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Errore durante l'aggiornamento del record:", error);
        }
    };

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

    const handleInputChange = (event) => {
        setUpdateForm({ ...updateForm, [event.target.name]: event.target.value });
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

        {
            field: 'update',
            headerName: 'Aggiorna',
            sortable: false,
            width: 100,
            renderCell: (params) => {
                return <PencilSquare onClick={() => handleUpdate(params.row)} />;
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
                            <Nav.Link as={Link} to="/AddContatto">Aggiungi contatto</Nav.Link>
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
            {selectedRow && (
                <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modifica Contatto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group controlId="formNome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="Nome" name="nome" value={updateForm.nome || ''} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formCognome">
                                <Form.Label>Cognome</Form.Label>
                                <Form.Control type="text" placeholder="Cognome" name="cognome" value={updateForm.cognome || ''} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formSesso">
                                <Form.Label>Sesso</Form.Label>
                                <Form.Control type="text" placeholder="Sesso" name="sesso" value={updateForm.sesso || ''} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formDataDiNascita">
                                <Form.Label>Data di Nascita</Form.Label>
                                <Form.Control type="date" name="data_di_nascita" value={updateForm.data_di_nascita || ''} onChange={handleInputChange}  />
                            </Form.Group>
                            <Form.Group controlId="formNumeroDiTelefono">
                                <Form.Label>Numero di Telefono</Form.Label>
                                <Form.Control type="text" placeholder="Numero di Telefono" name="numero_di_telefono" value={updateForm.numero_di_telefono || ''} onChange={handleInputChange}  />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email" name="email" value={updateForm.email || ''} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group controlId="formCitta">
                                <Form.Label>Città</Form.Label>
                                <Form.Select name="citta" value={updateForm.citta || ''} onChange={handleInputChange} >
                                    <option value="">-- Seleziona una città --</option>
                                    {cittaList.map((citta, index) => (
                                        <option key={index} value={citta}>{citta}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Button variant="primary" type="submit">Aggiorna</Button>
                        </Form>
                    </Modal.Body>


                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                            Chiudi
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
}

export default Home;
