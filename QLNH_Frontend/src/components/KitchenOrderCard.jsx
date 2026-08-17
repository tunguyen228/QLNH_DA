import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const KitchenOrderCard = ({ order, status, onActionClick }) => {
    // status: 'pending' (chờ nấu) hoặc 'cooking' (đang nấu)
    const isPending = status === 'pending';

    return (
        <Card className={`mb-3 border-0 shadow-sm ${isPending ? 'order-card-pending' : 'order-card-cooking'}`}>
            <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 className="fw-bold mb-1">{order.name}</h6>
                        <div className="text-muted fw-medium fs-7">
                            <i className="bi bi-geo-alt me-1"></i> {order.table}
                        </div>
                    </div>
                    <Badge className="px-3 py-2 fs-6 rounded text-dark bg-light border">
                        x{order.qty}
                    </Badge>
                </div>

                {isPending ? (
                    <Button variant="outline-success" className="w-100 fw-bold py-2 mt-2" onClick={() => onActionClick(order.id)}>
                        <i className="bi bi-play-circle me-2"></i> BẮT ĐẦU NẤU
                    </Button>
                ) : (
                    <Button variant="success" className="w-100 fw-bold py-2 mt-2 text-white" onClick={() => onActionClick(order.id)}>
                        <i className="bi bi-check2-circle me-2 fs-5"></i> XONG
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default KitchenOrderCard;