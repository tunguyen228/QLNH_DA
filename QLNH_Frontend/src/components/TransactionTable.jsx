import React from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { BsCash, BsBank, BsCreditCard, BsSlashCircle, BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const TransactionTable = ({ transactions, isLoading, error }) => {
    const formatCurrency = (amount) => {
        if (amount === 0) return '0đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const renderPaymentMethod = (method) => {
        switch (method) {
            case 'Cash':
                return <div className="d-flex align-items-center" style={{ color: '#2e7d32', fontWeight: '500' }}><BsCash className="me-2 fs-5" /> Tiền mặt</div>;
            case 'Transfer':
                return <div className="d-flex align-items-center" style={{ color: '#3b82f6', fontWeight: '500' }}><BsBank className="me-2 fs-5" /> Chuyển khoản</div>;
            case 'Card':
                return <div className="d-flex align-items-center" style={{ color: '#ea580c', fontWeight: '500' }}><BsCreditCard className="me-2 fs-5" /> Thẻ (POS)</div>;
            default:
                return <div className="d-flex align-items-center text-muted" style={{ fontWeight: '500' }}><BsSlashCircle className="me-2 fs-5" /> —</div>;
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100 p-5">
                <Spinner animation="border" variant="success" />
                <span className="ms-3 fw-bold text-success">Đang tải dữ liệu giao dịch...</span>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="m-4 shadow-sm border-0">Lỗi tải dữ liệu: {error}</Alert>;
    }

    return (
        <div className="px-4 pb-4 h-100 d-flex flex-column" style={{ backgroundColor: '#fcfaf5' }}>
            <div className="d-flex flex-column flex-grow-1" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                overflow: 'hidden'
            }}>

                {/* PHẦN DANH SÁCH CUỘN ĐƯỢC */}
                <div className="flex-grow-1 overflow-auto">
                    <Table hover responsive className="align-middle border-0 mb-0" style={{ minWidth: '900px' }}>
                        <thead style={{ backgroundColor: '#f5f7f5', position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr style={{ color: '#6b7280', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                            <th className="py-3 px-4 border-0 text-uppercase">Mã HĐ</th>
                            <th className="py-3 px-4 border-0 text-uppercase">Thời gian</th>
                            <th className="py-3 px-4 border-0 text-uppercase" style={{ width: '12%' }}>Bàn / Khu vực</th>
                            <th className="py-3 px-4 border-0 text-uppercase">Thu ngân</th>
                            <th className="py-3 px-4 border-0 text-uppercase">Thanh toán</th>
                            <th className="py-3 px-4 border-0 text-uppercase text-center">Tổng tiền</th>
                            <th className="py-3 px-4 border-0 text-uppercase text-center">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-5 text-muted">Chưa có dữ liệu giao dịch nào.</td>
                            </tr>
                        ) : (
                            transactions.map((tx, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td className="py-4 px-4"><span className="fw-bold" style={{ color: '#196841', fontSize: '0.95rem' }}>{tx.invoiceId}</span></td>
                                    <td className="py-4 px-4" style={{ color: '#4b5563', fontSize: '0.85rem', fontWeight: '500' }}>
                                        <div>{tx.time.split(' ')[0]}</div>
                                        <div>{tx.time.split(' ')[1]}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="fw-bold" style={{ color: '#374151', fontSize: '0.9rem' }}>{tx.tableName}</div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '2px', textTransform: 'uppercase' }}>{tx.area}</div>
                                    </td>
                                    <td className="py-4 px-4" style={{ color: '#4b5563', fontSize: '0.9rem' }}>{tx.cashier}</td>
                                    <td className="py-4 px-4">{renderPaymentMethod(tx.paymentMethod)}</td>
                                    <td className="py-4 px-4 text-center">
                                            <span style={{ fontSize: '1rem', fontWeight: tx.status === 'Cancelled' ? '500' : 'bold', color: tx.status === 'Cancelled' ? '#9ca3af' : '#196841', fontStyle: tx.status === 'Cancelled' ? 'italic' : 'normal' }}>
                                                {formatCurrency(tx.totalAmount)}
                                            </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {tx.status === 'Paid' ? (
                                            <span style={{ backgroundColor: '#e1e8e3', color: '#196841', padding: '8px 16px', borderRadius: '24px', fontSize: '0.8rem', fontWeight: '600', display: 'inline-block', minWidth: '110px' }}>Đã thanh toán</span>
                                        ) : (
                                            <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '8px 16px', borderRadius: '24px', fontSize: '0.8rem', fontWeight: '600', display: 'inline-block', minWidth: '110px' }}>Đã hủy</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                </div>

                {/* PHẦN PHÂN TRANG CỐ ĐỊNH Ở ĐÁY BẢNG (HÌNH 3) */}
                <div className="d-flex flex-shrink-0 justify-content-between align-items-center px-4 py-3 border-top bg-white" style={{ borderColor: '#f3f4f6' }}>
                    <div className="d-flex gap-2 align-items-center">
                        <Button variant="light" size="sm" className="bg-white border text-muted d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '6px' }}>
                            <BsChevronLeft size={14} />
                        </Button>
                        <Button variant="success" size="sm" className="border-0 fw-bold d-flex align-items-center justify-content-center text-white" style={{ width: '36px', height: '36px', backgroundColor: '#196841', borderRadius: '6px' }}>
                            1
                        </Button>
                        <Button variant="light" size="sm" className="bg-white border-0 text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '6px' }}>
                            2
                        </Button>
                        <Button variant="light" size="sm" className="bg-white border-0 text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '6px' }}>
                            3
                        </Button>
                        <Button variant="light" size="sm" className="bg-white border text-muted d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '6px' }}>
                            <BsChevronRight size={14} />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TransactionTable;