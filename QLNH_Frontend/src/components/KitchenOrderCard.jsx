import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const KitchenOrderCard = ({ order, status, onActionClick, onRemoveClick }) => {
    // status: 'pending' (chờ nấu) hoặc 'cooking' (đang nấu)
    const isPending = status === 'pending';

    return (
        <Card className={`mb-3 border-0 shadow-sm position-relative ${isPending ? 'order-card-pending' : 'order-card-cooking'}`}>

            {/* Nút "x" xóa/hủy order nằm ở góc trên bên phải */}
            {onRemoveClick && (
                <Button
                    variant="light"
                    className="position-absolute border bg-white text-dark d-flex align-items-center justify-content-center"
                    style={{ top: '12px', right: '12px', width: '28px', height: '28px', padding: 0, zIndex: 10 }}
                    onClick={() => onRemoveClick(order.id)}
                >
                    <span className="fw-bold" style={{ fontSize: '14px', lineHeight: 1 }}>x</span>
                </Button>
            )}

            <Card.Body className="p-3">
                {/* Thêm padding-right (pe-5) để chữ không bị đè dưới nút x */}
                <div className="d-flex justify-content-between align-items-start mb-2 pe-5">
                    <div>
                        <h6 className="fw-bold mb-1">{order.name}</h6>
                        <div className="text-muted fw-medium" style={{ fontSize: '14px' }}>
                            <i className="bi bi-geo-alt me-1"></i> {order.table}
                        </div>
                    </div>
                    <Badge className="px-3 py-2 rounded text-dark bg-light border" style={{ fontSize: '15px' }}>
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