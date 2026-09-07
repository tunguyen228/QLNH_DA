import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Table, InputGroup, Spinner } from 'react-bootstrap';
import { ArrowLeft, QrCode, Cash, CreditCard, Printer } from 'react-bootstrap-icons';
import SidebarThuNgan from '../components/SidebarThuNgan';
import checkoutService from '../services/checkoutService';
// Đảm bảo đường dẫn này trỏ ĐÚNG vào file ToastProvider của bạn
import { ToastProvider, useToast } from '../contexts/ToastProvider';

// Tách ruột của GiaoDienThanhToan ra một component con để có thể dùng được useToast()
const GiaoDienThanhToanContent = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('qr');

    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [orderItems, setOrderItems] = useState([]);

    const [loadingTables, setLoadingTables] = useState(false);
    const [loadingOrder, setLoadingOrder] = useState(false);

    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
    const [invoiceCode, setInvoiceCode] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProceedToPayment = async () => {
        if (!selectedTable) return;
        setIsGeneratingInvoice(true);
        try {
            const realInvoiceCode = await checkoutService.getNextInvoiceCode();
            setInvoiceCode(realInvoiceCode);
            setStep(2);
        } catch (error) {
            addToast("Lỗi khi tạo mã hóa đơn. Vui lòng thử lại!", "danger");
        } finally {
            setIsGeneratingInvoice(false);
        }
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        try {
            const phuongThuc = paymentMethod === 'cash' ? 'Tiền mặt' : paymentMethod === 'qr' ? 'Chuyển khoản' : 'Quẹt thẻ';
            const payload = {
                MaBan: parseInt(selectedTable),
                SoDienThoai: phoneNumber,
                PhuongThucTt: phuongThuc
            };

            const result = await checkoutService.processCheckout(payload);

            if (result.success) {
                addToast(`Thanh toán thành công! Điểm cộng: ${result.earnedPoints}`, "success");

                // Reset lại giao diện về bước 1
                setStep(1);
                setSelectedTable('');
                setOrderItems([]);
                setPhoneNumber('');

                // Cập nhật lại danh sách bàn (loại bỏ bàn vừa thanh toán)
                setLoadingTables(true);
                const newData = await checkoutService.getTablesToCheckout();
                setTables(newData);
                setLoadingTables(false);
            } else {
                addToast(`Lỗi: ${result.message}`, "danger");
            }
        } catch (error) {
            addToast("Lỗi kết nối đến hệ thống. Vui lòng thử lại!", "danger");
        } finally {
            setIsProcessing(false);
        }
    };

    const [tenThuNgan, setTenThuNgan] = useState(localStorage.getItem('hoTen') || 'Thu Ngân');

    const BANK_ID = "MB";
    const ACCOUNT_NO = "1234567890";
    const ACCOUNT_NAME = "NGUYEN THI CAM TU";

    useEffect(() => {
        const fetchTables = async () => {
            setLoadingTables(true);
            try {
                const data = await checkoutService.getTablesToCheckout();
                setTables(data);
            } catch (error) {
                console.error("Lỗi lấy danh sách bàn:", error);
            } finally {
                setLoadingTables(false);
            }
        };
        fetchTables();
    }, []);

    useEffect(() => {
        if (!selectedTable) {
            setOrderItems([]);
            return;
        }

        const fetchOrderDetails = async () => {
            setLoadingOrder(true);
            try {
                const data = await checkoutService.getOrderDetailsByTable(selectedTable);
                setOrderItems(data);
            } catch (error) {
                setOrderItems([]);
            } finally {
                setLoadingOrder(false);
            }
        };
        fetchOrderDetails();
    }, [selectedTable]);

    const subTotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const vat = subTotal * 0.1;
    const discount = 0;
    const grandTotal = subTotal + vat - discount;

    const addInfo = encodeURIComponent(`Thanh toan HD ${invoiceCode}`);
    const accountNameEncoded = encodeURIComponent(ACCOUNT_NAME);
    const vietQrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${grandTotal}&addInfo=${addInfo}&accountName=${accountNameEncoded}`;

    return (
        <div className="d-flex" style={{ height: '100vh', backgroundColor: '#fcfaf5' }}>
            <SidebarThuNgan hoTen={tenThuNgan} onLogout={handleLogout} />

            <Container fluid className="p-0 overflow-hidden d-flex flex-column" style={{ fontSize: '0.8rem' }}>
                <div className="flex-grow-1 overflow-hidden">
                    {step === 1 ? (
                        <Row className="h-100 g-0">
                            <Col md={8} className="d-flex flex-column h-100 p-4 border-end">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center">
                                        <Form.Select className="fw-bold text-success w-auto" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} disabled={loadingTables}>
                                            <option value="">Chọn bàn</option>
                                            {tables.map(table => (<option key={table.id} value={table.id}>{table.name}</option>))}
                                        </Form.Select>
                                        {loadingTables && <Spinner animation="border" size="sm" className="ms-2 text-success" />}
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-auto bg-white rounded shadow-sm border p-3">
                                    <Table hover responsive className="align-middle">
                                        <thead className="table-light text-muted">
                                        <tr>
                                            <th>SẢN PHẨM</th>
                                            <th className="text-center">SỐ LƯỢNG</th>
                                            <th className="text-end">ĐƠN GIÁ</th>
                                            <th className="text-end">THÀNH TIỀN</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {!selectedTable ? (
                                            <tr><td colSpan="4" className="text-center py-5 text-muted">Vui lòng chọn bàn để xem phiếu gọi</td></tr>
                                        ) : loadingOrder ? (
                                            <tr><td colSpan="4" className="text-center py-5"><Spinner animation="border" variant="success" /></td></tr>
                                        ) : orderItems.length > 0 ? (
                                            orderItems.map(item => (
                                                <tr key={item.id}>
                                                    <td className="fw-bold">{item.name}</td>
                                                    <td className="text-center"><span className="bg-light px-3 py-1 rounded fw-bold">{item.qty}</span></td>
                                                    <td className="text-end text-muted">{item.price.toLocaleString()}đ</td>
                                                    <td className="text-end fw-bold text-success">{(item.price * item.qty).toLocaleString()}đ</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="text-center py-5 text-muted">Bàn này chưa gọi món nào.</td></tr>
                                        )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                            <Col md={4} className="bg-white d-flex flex-column h-100 shadow-sm p-4">
                                <h5 className="fw-bold mb-4">Thông tin thanh toán</h5>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold small text-muted">MÃ GIẢM GIÁ</Form.Label>
                                    <InputGroup>
                                        <Form.Control placeholder="Nhập mã KM..." className="text-uppercase" />
                                        <Button variant="outline-success">Áp dụng</Button>
                                    </InputGroup>
                                </Form.Group>
                                <hr className="text-muted" />
                                <div className="mb-2 d-flex justify-content-between"><span className="text-muted">Tạm tính</span><strong>{subTotal.toLocaleString()}đ</strong></div>
                                <div className="mb-2 d-flex justify-content-between"><span className="text-muted">Thuế VAT (10%)</span><strong>{vat.toLocaleString()}đ</strong></div>
                                <div className="mb-4 d-flex justify-content-between text-success"><span>Khuyến mãi</span><strong>- {discount}đ</strong></div>
                                <div className="mt-auto pt-3 border-top">
                                    <div className="d-flex justify-content-between align-items-end mb-4">
                                        <span className="fw-bold text-muted">TỔNG THANH TOÁN</span>
                                        <div className="text-end"><h2 className="text-success fw-bold mb-0">{grandTotal.toLocaleString()}đ</h2></div>
                                    </div>
                                    <Button variant="success" size="lg" className="w-100 mb-2 fw-bold" onClick={handleProceedToPayment} disabled={!selectedTable || orderItems.length === 0 || isGeneratingInvoice}>
                                        {isGeneratingInvoice ? <Spinner size="sm" animation="border"/> : 'Tiến hành thanh toán'}
                                    </Button>
                                    <Button variant="outline-secondary" size="lg" className="w-100 fw-bold" disabled={!selectedTable || orderItems.length === 0}>
                                        Tách hóa đơn
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                        <Row className="h-100 g-0">
                            <Col md={7} className="p-4 d-flex flex-column h-100 bg-white overflow-auto">
                                <Button variant="link" className="text-decoration-none text-muted p-0 mb-3 text-start fw-bold" onClick={() => setStep(1)}><ArrowLeft className="me-2" /> Quay lại đơn hàng</Button>
                                <Row className="g-3 mb-3">
                                    <Col><Card className={`text-center py-3 cursor-pointer border-2 ${paymentMethod === 'cash' ? 'border-success bg-success bg-opacity-10 text-success' : 'border-light'}`} onClick={() => setPaymentMethod('cash')}><Cash size={28} className="mx-auto mb-2" /><span className="fw-bold small">Tiền mặt</span></Card></Col>
                                    <Col><Card className={`text-center py-3 cursor-pointer border-2 ${paymentMethod === 'qr' ? 'border-success bg-success text-white shadow' : 'border-light'}`} onClick={() => setPaymentMethod('qr')}><QrCode size={28} className="mx-auto mb-2" /><span className="fw-bold small">Chuyển khoản QR</span></Card></Col>
                                    <Col><Card className={`text-center py-3 cursor-pointer border-2 ${paymentMethod === 'card' ? 'border-success bg-success bg-opacity-10 text-success' : 'border-light'}`} onClick={() => setPaymentMethod('card')}><CreditCard size={28} className="mx-auto mb-2" /><span className="fw-bold small">Quẹt thẻ POS</span></Card></Col>
                                </Row>
                                {paymentMethod === 'qr' && (
                                    <Card className="border-0 shadow-sm text-center p-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center bg-light rounded-4">
                                        <div className="bg-white p-2 rounded-4 mb-3 shadow-sm"><img src={vietQrUrl} alt="VietQR" style={{ width: '250px', height: 'auto', objectFit: 'contain' }} /></div>
                                        <h3 className="fw-bold text-success mb-1">{grandTotal.toLocaleString()} VNĐ</h3>
                                        <small className="text-muted">Nội dung CK: <strong className="text-dark">Thanh toan HD {invoiceCode}</strong></small>
                                        <small className="text-muted">Đang chờ khách hàng thanh toán...</small>
                                    </Card>
                                )}
                                <Button variant="success" size="lg" className="w-100 fw-bold mt-3 shadow-sm" onClick={handleConfirmPayment} disabled={isProcessing}>
                                    {isProcessing ? <><Spinner animation="border" size="sm" className="me-2"/> Đang xử lý...</> : <><Printer className="me-2" /> Xác nhận & In hóa đơn</>}
                                </Button>
                            </Col>
                            <Col md={5} className="bg-light border-start p-4 h-100 overflow-auto">
                                <h6 className="fw-bold mb-3 text-center text-muted">Xem trước hóa đơn</h6>
                                <Card className="border-0 shadow-sm p-4" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold mb-1">NHÀ HÀNG</h4><small className="d-block">XXX Đường YYY, Hồ Chí Minh</small><small className="d-block">Thu ngân: {tenThuNgan}</small>
                                    </div>
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    <div className="d-flex justify-content-between fw-bold mb-2"><span>{tables.find(t => t.id == selectedTable)?.name || selectedTable}</span><span>MÃ HĐ: {invoiceCode}</span></div>
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    <Table borderless size="sm" className="mb-0">
                                        <thead><tr className="border-bottom"><th>MÓN</th><th className="text-center">SL</th><th className="text-end">T.TIỀN</th></tr></thead>
                                        <tbody>
                                        {orderItems.map(item => (
                                            <tr key={item.id}><td>{item.name}</td><td className="text-center">{item.qty}</td><td className="text-end">{(item.price * item.qty).toLocaleString()}</td></tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    <div className="d-flex justify-content-between mb-1"><span>Tạm tính</span><span>{subTotal.toLocaleString()}</span></div>
                                    <div className="d-flex justify-content-between mb-1"><span>VAT (10%)</span><span>{vat.toLocaleString()}</span></div>
                                    <div className="d-flex justify-content-between mb-2"><span>Khuyến mãi</span><span>{discount.toLocaleString()}</span></div>
                                    <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2"><span>TỔNG CỘNG</span><span>{grandTotal.toLocaleString()}</span></div>
                                    <div className="text-center mt-4 text-muted small fst-italic">"Cám ơn Quý khách đã ủng hộ NĂM NHỎ.<br/>Hẹn gặp lại quý khách lần sau!"</div>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </div>
            </Container>
        </div>
    );
};

// Component chính export ra ngoài sẽ bao bọc ToastProvider
const GiaoDienThanhToan = () => {
    return (
        <ToastProvider>
            <GiaoDienThanhToanContent />
        </ToastProvider>
    );
};

export default GiaoDienThanhToan;