import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Navbar, Button } from 'react-bootstrap';
import KitchenOrderCard from '../components/KitchenOrderCard';
import { getPendingOrders, getCookingOrders, updateOrderStatus } from '../services/kitchenService';
import '../CSS/Kitchen.css';

const Kitchen = () => {
    const navigate = useNavigate();
    const [pendingOrders, setPendingOrders] = useState([]);
    const [cookingOrders, setCookingOrders] = useState([]);

    const loadData = async () => {
        try {
            const pending = await getPendingOrders();
            const cooking = await getCookingOrders();
            setPendingOrders(pending);
            setCookingOrders(cooking);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bếp:", error);
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    const handleStartCooking = async (maPhieu, maMon) => {
        try {
            await updateOrderStatus(maPhieu, maMon, "DangCheBien");
            await loadData();
        } catch (error) {
            console.error("Lỗi khi bắt đầu nấu:", error);
        }
    };

    const handleFinishCooking = async (maPhieu, maMon) => {
        try {
            await updateOrderStatus(maPhieu, maMon, "HoanThanh");
            await loadData();
        } catch (error) {
            console.error("Lỗi khi hoàn thành món:", error);
        }
    };

    const handleReportMissingIngredient = (order) => {
        console.log('Báo thiếu nguyên liệu:', order.tenMon, order.maPhieu, order.maMon);
    };

    const handleReportOutOfStock = (order) => {
        console.log('Báo hết món:', order.tenMon, order.maPhieu, order.maMon);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="kitchen-wrapper">
            <Navbar className="px-4 py-3 bg-white border-bottom shadow-sm">
                <Navbar.Brand className="fw-bold fs-4 text-dark mb-0">
                    <i className="bi bi-egg-fried me-2 text-success"></i>Màn hình Bếp
                </Navbar.Brand>
                <div className="ms-auto">
                    <Button variant="outline-danger" className="fw-bold" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                    </Button>
                </div>
            </Navbar>

            <Container fluid className="flex-grow-1 overflow-hidden p-4">
                <Row className="h-100 g-4">
                    <Col md={6} className="h-100 d-flex flex-column">
                        <div className="kitchen-card-panel shadow-sm h-100 d-flex flex-column p-4">
                            <div className="flex-grow-1 overflow-auto pe-2">
                                {pendingOrders.map(order => (
                                    <KitchenOrderCard
                                        key={`${order.maPhieu}-${order.maMon}`}
                                        order={order}
                                        status="pending"
                                        onActionClick={handleStartCooking}
                                        onReportMissingIngredient={handleReportMissingIngredient}
                                        onReportOutOfStock={handleReportOutOfStock}
                                    />
                                ))}
                            </div>
                        </div>
                    </Col>

                    <Col md={6} className="h-100 d-flex flex-column">
                        <div className="kitchen-card-panel shadow-sm h-100 d-flex flex-column p-4 position-relative">
                            <div className="flex-grow-1 overflow-auto pe-2">
                                {cookingOrders.map(order => (
                                    <KitchenOrderCard
                                        key={`${order.maPhieu}-${order.maMon}`}
                                        order={order}
                                        status="cooking"
                                        onActionClick={handleFinishCooking}
                                    />
                                ))}
                            </div>
                        </div>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default Kitchen;