import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { setTrue } from '../redux/slice/authReducer';
import { useDispatch } from 'react-redux'; // Aggiungi useSelector

function NewContatto() {
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [sesso, setSesso] = useState('');
    const [dataDiNascita, setDataDiNascita] = useState('');
    const [numeroDiTelefono, setNumeroDiTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [citta, setCitta] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [cittaList, setCittaList] = useState([]);


    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCitta = async () => {
            const response = await axios.get('http://localhost:5000/citta');
            setCittaList(response.data);
        };
        fetchCitta();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nome === '' || cognome === '' || sesso === '' || email === '') {
            setShowAlert(true);
        } else {
            setShowAlert(false);

            const nuovoContatto = {
                nome: nome,
                cognome: cognome,
                sesso: sesso,
                data_di_nascita: dataDiNascita || null,
                numero_di_telefono: numeroDiTelefono,
                email: email,
                citta: citta
            };

            try {
                const response = await axios.post('http://localhost:5000/rubrica', nuovoContatto);
                if (response.data.success) {
                    dispatch(setTrue());
                    navigate('/home');
                } else {
                    // Gestisci qui eventuali errori restituiti dal backend
                }
            } catch (error) {
                // Gestisci qui gli errori di rete o altri errori non gestiti dal backend
                console.error(error);
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} sm={8} md={6}>
                    <Form onSubmit={handleSubmit}>
                        {showAlert && <Alert variant="danger">Nome, Cognome, Sesso e Email sono obbligatori</Alert>}
                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Cognome</Form.Label>
                            <Form.Control type="text" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Sesso</Form.Label>
                            <Form.Control as="select" value={sesso} onChange={(e) => setSesso(e.target.value)} required>
                                <option value="">Seleziona...</option>
                                <option value="M">M</option>
                                <option value="F">F</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Data di Nascita</Form.Label>
                            <Form.Control type="date" value={dataDiNascita} onChange={(e) => setDataDiNascita(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Numero di Telefono</Form.Label>
                            <Form.Control type="text" value={numeroDiTelefono} onChange={(e) => setNumeroDiTelefono(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Città</Form.Label>
                            <Form.Control as="select" value={citta} onChange={(e) => setCitta(e.target.value)}>
                                <option value="" disabled defaultValue>Seleziona una città</option>
                                {cittaList.map((citta, index) =>
                                    <option key={index} value={citta}>{citta}</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit">Aggiungi Contatto</Button>
                        <Button variant="danger" onClick={() => {
                            dispatch(setTrue());
                            navigate('/home');
                        }}>Torna Indietro</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default NewContatto;
