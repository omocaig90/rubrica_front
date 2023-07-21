import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Card, Container, Form, Button, Alert } from 'react-bootstrap';
import { setTrue } from '../redux/slice/authReducer';
import { useDispatch } from 'react-redux';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            if (response.status === 200) {
                dispatch(setTrue());
                navigate('/home');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setAlertMsg('Username e password errati');
                setShowAlert(true);
            }
        }
    };

    return (
        <Container style={{ maxWidth: '500px', marginTop: '50px' }}>
            {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>{alertMsg}</Alert>}
            <Card>
                <Card.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login;
