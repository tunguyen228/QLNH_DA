import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Navbar, Button, Card, ListGroup, Image } from 'react-bootstrap';
import KitchenOrderCard from '../components/KitchenOrderCard';
import { useNotifications } from '../contexts/NotificationProvider';
import { getPendingOrders, getCookingOrders, updateOrderStatus, getKitchenStaff } from '../services/kitchenService';
import '../CSS/Kitchen.css';

const Kitchen = () => {
    const navigate = useNavigate();
    const [pendingOrders, setPendingOrders] = useState([]);
    const [cookingOrders, setCookingOrders] = useState([]);
    const [kitchenStaff, setKitchenStaff] = useState([]); // State lưu nhân sự bếp
    const { kitchenRefreshTrigger } = useNotifications();
    
    const loadData = async () => {
        try {
            const pending = await getPendingOrders();
            const cooking = await getCookingOrders();

            console.log("Dữ liệu chờ chế biến (pending):", pending);
            console.log("Dữ liệu đang chế biến (cooking):", cooking);
            
            // Gọi hàm lấy nhân sự (nếu api lỗi thì gán mảng rỗng để không bị crash)
            let staff = [];
            try {
                staff = await getKitchenStaff();
            } catch (e) {
                console.warn("Chưa có API nhân sự");
            }

            setPendingOrders(pending);
            setCookingOrders(cooking);
            setKitchenStaff(staff);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bếp:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, [kitchenRefreshTrigger]);

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
        <div className="kitchen-wrapper min-vh-100" style={{ backgroundColor: '#f4f1ea' }}>
            <Navbar sticky="top" className="px-4 py-3 bg-white border-bottom shadow-sm d-flex justify-content-between" style={{ zIndex: 1020 }}>
                <Navbar.Brand className="fw-bold fs-4 mb-0" style={{ color: '#2b5c38' }}>
                    <i className="bi bi-egg-fried me-2"></i>Màn Hình Bếp
                </Navbar.Brand>
                <div
                    className="d-flex align-items-center fw-bold"
                    style={{ color: '#d9534f', cursor: 'pointer', gap: '8px' }}
                    onClick={handleLogout}
                >
                    <span className="d-flex align-items-center justify-content-center" style={{ width: '22px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                    </span>
                    Đăng xuất
                </div>
            </Navbar>

            <Container fluid className="flex-grow-1 overflow-hidden p-4">
                <Row className="h-100 g-4">
                    <Col lg={3} md={4} className="h-100 overflow-auto hide-scrollbar pb-4">
                        <Card className="border-0 shadow-sm bg-white" style={{ borderRadius: '20px' }}>
                            <Card.Body className="p-4">
                                <h6 className="fw-bold text-secondary mb-4">NHÂN VIÊN BẾP</h6>
                                <ListGroup variant="flush">
                                    {kitchenStaff.length > 0 ? kitchenStaff.map(staff => (
                                        <ListGroup.Item key={staff.id} className="bg-transparent border-0 px-0 py-2 d-flex align-items-center">
                                            <Image
                                                src={staff.avatar || "https://ui-avatars.com/api/?name=" + staff.hoTen}
                                                roundedCircle width={45} height={45}
                                                className="me-3 object-fit-cover shadow-sm"
                                            />
                                            <div className="flex-grow-1">
                                                <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>{staff.hoTen}</div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>
                                                    {staff.chucVu} • {staff.trangThai}
                                                </div>
                                            </div>
                                            <div
                                                className={`rounded-circle ${staff.isOnline ? 'bg-success' : 'bg-secondary'}`}
                                                style={{ width: '10px', height: '10px' }}
                                            ></div>
                                        </ListGroup.Item>
                                    )) : (
                                        <div className="text-muted fs-7">Chưa có dữ liệu nhân sự...</div>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={9} md={8} className="h-100">
                        <Row className="h-100 g-4">
                            <Col md={6} className="h-100 d-flex flex-column">
                                <div className="kitchen-card-panel shadow-sm h-100 d-flex flex-column p-4 bg-white" style={{ borderRadius: '15px' }}>
                                    <h6 className="fw-bold text-dark mb-3">CHỜ CHẾ BIẾN ({pendingOrders.length})</h6>
                                    <div className="flex-grow-1 overflow-auto pe-2 hide-scrollbar">
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
                                <div className="kitchen-card-panel shadow-sm h-100 d-flex flex-column p-4 bg-white" style={{ borderRadius: '15px' }}>
                                    <h6 className="fw-bold text-dark mb-3">ĐANG CHẾ BIẾN ({cookingOrders.length})</h6>
                                    <div className="flex-grow-1 overflow-auto pe-2 hide-scrollbar">
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
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default Kitchen;