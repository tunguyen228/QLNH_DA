import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Button, ButtonGroup } from 'react-bootstrap';
import KitchenOrderCard from '../components/KitchenOrderCard';
import { getPendingOrders, getCookingOrders } from '../services/kitchenService';
import '../CSS/Kitchen.css'; 

const Kitchen = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [cookingOrders, setCookingOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const pending = await getPendingOrders();
            const cooking = await getCookingOrders();
            setPendingOrders(pending);
            setCookingOrders(cooking);
        };
        fetchData();
    }, []);

    const handleStartCooking = (orderId) => {
        console.log("Bắt đầu nấu món ID:", orderId);
    };

    const handleFinishCooking = (orderId) => {
        console.log("Hoàn thành món ID:", orderId);
    };

    return (
        <div className="kitchen-wrapper">
            <Navbar className="px-4 py-3 bg-white border-bottom shadow-sm">
            </Navbar>

            <Container fluid className="flex-grow-1 overflow-hidden p-4">
                <Row className="h-100 g-4">
                    <Col md={6} className="h-100 d-flex flex-column">
                        <div className="kitchen-card-panel shadow-sm h-100 d-flex flex-column p-4">
                            <div className="flex-grow-1 overflow-auto pe-2">
                                {pendingOrders.map(order => (
                                    <KitchenOrderCard
                                        key={order.id}
                                        order={order}
                                        status="pending"
                                        onActionClick={handleStartCooking}
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
                                        key={order.id}
                                        order={order}
                                        status="cooking"
                                        onActionClick={handleFinishCooking}
                                    />
                                ))}
                            </div>
                            {/* Nút đăng xuất */}
                        </div>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default Kitchen;