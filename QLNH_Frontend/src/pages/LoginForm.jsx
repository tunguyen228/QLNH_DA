import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersonVcard, Lock, Eye, EyeSlash, ArrowRight } from 'react-bootstrap-icons';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/Auth/login', {
                username,
                password
            });

            const { token, hoTen, role, maNv } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('hoTen', hoTen);
            localStorage.setItem('role', role);
            localStorage.setItem('maNv', maNv);
            
            if (role === 'Phục vụ') {
                navigate('/phuc-vu');
            } else if (role=== 'Bếp') {
                navigate('/bep');
            } else if(role === 'Thu ngân') {
                navigate('/thu-ngan');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error("Chi tiết lỗi JS/Network:", err);
            
            if (err.response && err.response.status === 401) {
                setError('Tài khoản hoặc mật khẩu không chính xác.');
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra kết nối Server.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const styles = {
        container: {
            backgroundColor: '#F9F8F3',
            minHeight: '100vh',
        },
        formBox: {
            backgroundColor: 'white',
            borderRadius: '12px',
        },
        inputField: {
            backgroundColor: '#F0EFEA',
            border: 'none',
            boxShadow: 'none',
        },
        inputIcon: {
            backgroundColor: '#F0EFEA',
            border: 'none',
            color: '#888',
        },
        submitButton: {
            backgroundColor: '#1E3923',
            borderColor: '#1E3923',
            padding: '12px',
            fontWeight: '600',
        },
        textSmall: {
            fontSize: '0.85rem',
            color: '#888',
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center p-0" style={styles.container}>
            <Row className="w-100 m-0 justify-content-center">
                <Col xs={11} sm={8} md={6} lg={5} xl={4} className="d-flex flex-column p-4 p-md-5 shadow-sm" style={styles.formBox}>

                    <div className="mx-auto w-100" style={{ maxWidth: '400px' }}>
                        <h2 className="fw-bold mb-2" style={{ color: '#1E3923' }}>Đăng nhập hệ thống</h2>
                        <p className="mb-4" style={{ color: '#666', fontSize: '0.95rem' }}>
                            Chào mừng trở lại, vui lòng điền thông tin để tiếp tục.
                        </p>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-4" controlId="formUsername">
                                <Form.Label className="fw-bold text-uppercase" style={{ fontSize: '0.8rem', color: '#555' }}>
                                    Mã nhân viên
                                </Form.Label>
                                <InputGroup>
                                    <InputGroup.Text style={styles.inputIcon}>
                                        <PersonVcard />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        style={styles.inputField}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-5" controlId="formPassword">
                                <Form.Label className="fw-bold text-uppercase" style={{ fontSize: '0.8rem', color: '#555' }}>
                                    Mật khẩu
                                </Form.Label>
                                <InputGroup>
                                    <InputGroup.Text style={styles.inputIcon}>
                                        <Lock />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        style={styles.inputField}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <InputGroup.Text
                                        style={{ ...styles.inputIcon, cursor: 'pointer' }}
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <EyeSlash /> : <Eye />}
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            <Button variant="success" type="submit" className="w-100 mb-4 d-flex justify-content-center align-items-center gap-2" style={styles.submitButton}>
                                ĐĂNG NHẬP <ArrowRight size={18} />
                            </Button>

                            <div className="text-center mb-4">
                                <span style={styles.textSmall}>Gặp sự cố khi đăng nhập? </span>
                                <a href="#" className="text-decoration-none fw-bold" style={{ color: '#C44536', fontSize: '0.85rem' }}>
                                    Liên hệ hỗ trợ
                                </a>
                            </div>
                        </Form>
                    </div>

                    {/* Footer */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between mt-auto pt-4 border-top" style={styles.textSmall}>
                        <span className="mb-2 mb-sm-0">© 2026</span>
                        <div className="d-flex gap-4">
                            <a href="#" className="text-decoration-none text-muted">CHÍNH SÁCH</a>
                            <a href="#" className="text-decoration-none text-muted">HỖ TRỢ</a>
                        </div>
                    </div>

                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;