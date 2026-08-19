import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const KitchenOrderCard = ({ order, status, onActionClick, onReportMissingIngredient, onReportOutOfStock }) => {
    const isPending = status === 'pending';

    return (
        <Card className={`mb-3 border-0 shadow-sm position-relative ${isPending ? 'order-card-pending' : 'order-card-cooking'}`}>
            <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2 pe-2">
                    <div>
                        <h6 className="fw-bold mb-1">{order.tenMon}</h6>
                        <div className="text-muted fw-medium" style={{ fontSize: '14px' }}>
                            <i className="bi bi-geo-alt me-1"></i> Bàn: {order.tenBan}
                        </div>
                        {order.ghiChu && (
                            <div className="text-danger mt-1" style={{ fontSize: '13px', fontStyle: 'italic' }}>
                                * Ghi chú: {order.ghiChu}
                            </div>
                        )}
                    </div>
                    <Badge className="px-3 py-2 rounded text-dark bg-light border" style={{ fontSize: '15px' }}>
                        x{order.soLuong}
                    </Badge>
                </div>

                {isPending ? (
                    <Button variant="outline-success" className="w-100 fw-bold py-2 mt-2"
                            onClick={() => onActionClick(order.maPhieu, order.maMon)}>
                        <i className="bi bi-play-circle me-2"></i> BẮT ĐẦU NẤU
                    </Button>
                ) : (
                    <Button variant="success" className="w-100 fw-bold py-2 mt-2 text-white"
                            onClick={() => onActionClick(order.maPhieu, order.maMon)}>
                        <i className="bi bi-check2-circle me-2 fs-5"></i> XONG
                    </Button>
                )}

                {/* Báo thiếu nguyên liệu / báo hết món — chỉ mới thiết kế giao diện, chưa nối API */}
                <div className="d-flex gap-2 mt-2">
                    <Button
                        variant="outline-warning"
                        size="sm"
                        className="flex-fill fw-medium"
                        onClick={() => onReportMissingIngredient(order)}
                    >
                        <i className="bi bi-exclamation-triangle me-1"></i> Thiếu nguyên liệu
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="flex-fill fw-medium"
                        onClick={() => onReportOutOfStock(order)}
                    >
                        <i className="bi bi-slash-circle me-1"></i> Hết món
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default KitchenOrderCard;