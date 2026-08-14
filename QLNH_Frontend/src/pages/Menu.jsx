import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup } from 'react-bootstrap';
import { fetchCategories, fetchMenuItems } from '../services/menuService';
import '../CSS/Menu.css';

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState(1); // Mặc định là 1 (Tất cả), kiểu int
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            const cats = await fetchCategories();
            setCategories(cats);

            const items = await fetchMenuItems(activeCategory);
            setMenuItems(items);

            // Giả lập giỏ hàng hiện tại (có thể thay bằng gọi API lấy order bàn)
            setCart([
                { MaMon: 101, TenMon: 'Gỏi Cuốn Tôm Thịt', Gia: 85000, SoLuong: 2, GhiChu: '' },
                { MaMon: 102, TenMon: 'Phở Bò Lantana', Gia: 125000, SoLuong: 1, GhiChu: 'Ít hành, không giá' }
            ]);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const loadMenuByCat = async () => {
            const items = await fetchMenuItems(activeCategory);
            setMenuItems(items);
        };
        loadMenuByCat();
    }, [activeCategory]);

    const formatVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const subTotal = cart.reduce((sum, item) => sum + (item.Gia * item.SoLuong), 0);
    const serviceFee = subTotal * 0.05;
    const total = subTotal + serviceFee;

    return (
        <div className="menu-wrapper p-4 w-100">
            <Row className="h-100">
                {/* --- PHẦN DANH SÁCH MÓN --- */}
                <Col lg={8} xl={9} className="d-flex flex-column h-100">

                    {/* Thanh tìm kiếm & Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <InputGroup className="w-50 bg-white rounded-pill overflow-hidden shadow-sm border-0">
                            <InputGroup.Text className="bg-white border-0 ps-3">
                                <i className="bi bi-search text-muted"></i>
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Tìm kiếm món ăn..."
                                className="border-0 shadow-none py-2 bg-white"
                            />
                        </InputGroup>
                        <div className="d-flex align-items-center gap-4">
                            <i className="bi bi-bell-fill fs-5 text-success"></i>
                            <i className="bi bi-gear-fill fs-5 text-success"></i>
                            <i className="bi bi-question-circle-fill fs-5 text-success"></i>
                            <div className="d-flex align-items-center border-start ps-3 ms-2">
                                <div className="text-end me-3">
                                    <div className="fw-bold" style={{ fontSize: '14px' }}>Admin User</div>
                                    <div className="text-muted" style={{ fontSize: '12px' }}>Ca chiều</div>
                                </div>
                                <div className="bg-warning text-dark rounded-3 d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>U</div>
                            </div>
                        </div>
                    </div>

                    {/* Bộ lọc nhóm món */}
                    <div className="d-flex gap-2 mb-4 overflow-auto hide-scrollbar pb-2">
                        {categories.map((cat) => (
                            <Button
                                key={cat.MaNhom}
                                variant={activeCategory === cat.MaNhom ? "" : "light"}
                                className={`px-4 py-2 fw-medium shadow-sm btn-category ${activeCategory === cat.MaNhom ? 'active-cat' : 'bg-white text-dark border-0'}`}
                                onClick={() => setActiveCategory(cat.MaNhom)}
                            >
                                {cat.TenNhom}
                            </Button>
                        ))}
                    </div>

                    {/* Lưới sản phẩm */}
                    <Row className="g-4 overflow-auto hide-scrollbar flex-grow-1 pb-4">
                        {menuItems.map((item) => (
                            <Col sm={6} md={6} lg={4} xl={3} key={item.MaMon}>
                                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                                    <div className="position-relative food-img-placeholder">
                                        <i className="bi bi-image fs-1"></i>
                                        <Badge bg="dark" className="position-absolute top-0 end-0 m-2 px-2 py-1 opacity-75">
                                            {item.Loai}
                                        </Badge>
                                    </div>
                                    <Card.Body className="d-flex flex-column p-3">
                                        <Card.Title className="fs-6 fw-bold mb-1">{item.TenMon}</Card.Title>
                                        <Card.Text className="text-muted mb-3" style={{ fontSize: '0.8rem', flexGrow: 1 }}>
                                            {item.MoTa}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <span className="fw-bold">{formatVND(item.Gia)}</span>
                                            <Button
                                                variant="light"
                                                className="rounded-3 text-success fw-bold border-0 d-flex align-items-center justify-content-center"
                                                style={{ backgroundColor: '#EBF4ED', width: '32px', height: '32px' }}
                                            >
                                                <i className="bi bi-plus-lg"></i>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>

                {/* --- PHẦN CHI TIẾT ĐƠN HÀNG --- */}
                <Col lg={4} xl={3}>
                    <Card className="shadow-sm border-0 rounded-4 h-100 bg-white d-flex flex-column">
                        <Card.Body className="d-flex flex-column p-4 overflow-hidden">

                            {/* Tiêu đề & Bàn */}
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <h5 className="fw-bold mb-0">Chi tiết đơn hàng</h5>
                                <Badge className="px-3 py-2 rounded-3 border-0" style={{ backgroundColor: '#F39C6B' }}>BÀN 08</Badge>
                            </div>
                            <div className="text-muted mb-3 pb-3 border-bottom" style={{ fontSize: '0.85rem' }}>
                                ID: #ORD-1284 | 14:35
                            </div>

                            {/* Danh sách món trong giỏ */}
                            <ListGroup variant="flush" className="flex-grow-1 overflow-auto hide-scrollbar mb-3">
                                {cart.map((cartItem, index) => (
                                    <ListGroup.Item key={index} className="px-0 py-3 border-bottom border-light">
                                        <div className="d-flex gap-3">
                                            <div className="bg-light rounded d-flex justify-content-center align-items-center" style={{ width: '45px', height: '45px', flexShrink: 0 }}>
                                                <i className="bi bi-cup-hot text-muted"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                    <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{cartItem.TenMon}</span>
                                                    <span className="fw-bold" style={{ fontSize: '0.9rem' }}>{formatVND(cartItem.Gia * cartItem.SoLuong)}</span>
                                                </div>
                                                <div className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>
                                                    {formatVND(cartItem.Gia)} / phần
                                                </div>

                                                <div className="d-flex justify-content-between align-items-end">
                                                    <div className="w-50">
                                                        {cartItem.GhiChu && (
                                                            <div className="text-danger fst-italic" style={{ fontSize: '0.75rem' }}>
                                                                Ghi chú: {cartItem.GhiChu}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Chỉnh số lượng */}
                                                    <div className="d-flex align-items-center bg-light rounded-pill px-2 py-1">
                                                        <Button variant="link" className="p-0 text-muted text-decoration-none border-0" size="sm"><i className="bi bi-dash"></i></Button>
                                                        <span className="mx-3 fw-bold" style={{ fontSize: '0.85rem' }}>{cartItem.SoLuong}</span>
                                                        <Button variant="link" className="p-0 text-muted text-decoration-none border-0" size="sm"><i className="bi bi-plus"></i></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                            {/* Thanh toán */}
                            <div className="mt-auto pt-3 border-top">
                                <div className="d-flex justify-content-between mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                                    <span>Tạm tính</span>
                                    <span>{formatVND(subTotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 text-muted" style={{ fontSize: '0.9rem' }}>
                                    <span>Phí phục vụ (5%)</span>
                                    <span>{formatVND(serviceFee)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="fw-bold fs-6">TỔNG TIỀN</span>
                                    <span className="fw-bold fs-5" style={{ color: '#114E29' }}>{formatVND(total)}</span>
                                </div>
                                <Row className="g-2">
                                    <Col>
                                        <Button variant="outline-success" className="w-100 py-2 rounded-3 fw-bold" style={{ color: '#114E29', borderColor: '#114E29' }}>
                                            Gửi bếp
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button variant="success" className="w-100 py-2 rounded-3 fw-bold border-0" style={{ backgroundColor: '#114E29' }}>
                                            Thanh toán
                                        </Button>
                                    </Col>
                                </Row>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Menu;