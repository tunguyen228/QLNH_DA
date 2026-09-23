import React from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { BsCash, BsBank, BsCreditCard, BsSlashCircle, BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const TransactionTable = ({
                              transactions = [],
                              totalItems = 0,
                              isLoading,
                              error,
                              currentPage = 1,
                              totalPages = 1,
                              onPageChange
                          }) => {
    const formatCurrency = (amount) => {
        if (!amount || amount === 0) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    const formatDateTime = (timeStr) => {
        if (!timeStr) return { date: '—', time: '—' };
        try {
            const d = new Date(timeStr);
            if (isNaN(d.getTime())) {
                const parts = timeStr.split(' ');
                return { date: parts[0] || '—', time: parts[1] || '—' };
            }
            return {
                date: d.toLocaleDateString('vi-VN'),
                time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
        } catch {
            return { date: timeStr, time: '' };
        }
    };
    const renderPaymentMethod = (method) => {
        const m = (method || '').toLowerCase();
        if (m.includes('tiền mặt') || m.includes('cash')) {
            return <div className="d-flex align-items-center" style={{ color: '#2e7d32', fontWeight: '500' }}><BsCash className="me-2 fs-5" /> Tiền mặt</div>;
        }
        if (m.includes('chuyển khoản') || m.includes('transfer') || m.includes('qr')) {
            return <div className="d-flex align-items-center" style={{ color: '#3b82f6', fontWeight: '500' }}><BsBank className="me-2 fs-5" /> Chuyển khoản</div>;
        }
        if (m.includes('thẻ') || m.includes('card') || m.includes('pos')) {
            return <div className="d-flex align-items-center" style={{ color: '#ea580c', fontWeight: '500' }}><BsCreditCard className="me-2 fs-5" /> Thẻ (POS)</div>;
        }
        return <div className="d-flex align-items-center text-muted" style={{ fontWeight: '500' }}><BsSlashCircle className="me-2 fs-5" /> {method || '—'}</div>;
    };
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100 p-5 bg-white rounded-4 shadow-sm">
                <Spinner animation="border" variant="success" />
                <span className="ms-3 fw-bold text-success">Đang tải dữ liệu giao dịch...</span>
            </div>
        );
    }
    if (error) {
        return <Alert variant="danger" className="m-2 shadow-sm border-0">Lỗi tải dữ liệu: {error}</Alert>;
    }

    return (
        <div className="d-flex flex-column h-100 bg-white rounded-4 shadow-sm overflow-hidden border">
            <div className="flex-grow-1 overflow-auto">
                <Table hover responsive className="align-middle border-0 mb-0" style={{ minWidth: '850px' }}>
                    <thead style={{ backgroundColor: '#f8faf8', position: 'sticky', top: 0, zIndex: 2 }}>
                    <tr style={{ color: '#6b7280', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                        <th className="py-3 px-4 border-0 text-uppercase">Mã HĐ</th>
                        <th className="py-3 px-4 border-0 text-uppercase">Thời gian</th>
                        <th className="py-3 px-4 border-0 text-uppercase">Bàn / Khu vực</th>
                        <th className="py-3 px-4 border-0 text-uppercase">Thu ngân</th>
                        <th className="py-3 px-4 border-0 text-uppercase">Thanh toán</th>
                        <th className="py-3 px-4 border-0 text-uppercase text-end">Tổng tiền</th>
                        <th className="py-3 px-4 border-0 text-uppercase text-center">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center py-5 text-muted">
                                Chưa có dữ liệu giao dịch nào.
                            </td>
                        </tr>
                    ) : (
                        transactions.map((tx, index) => {
                            const id = tx.invoiceId ?? tx.maHoaDon ?? tx.id ?? index;
                            const timeObj = formatDateTime(tx.time ?? tx.thoiGianRa ?? tx.thoiGianTao);
                            const table = tx.tableName ?? (tx.maBan ? `Bàn ${tx.maBan}` : 'Mang về');
                            const area = tx.area ?? (tx.tang ? `Tầng ${tx.tang}` : 'Khu vực chung');
                            const cashier = tx.cashier ?? tx.tenThuNgan ?? tx.tenNhanVien ?? 'Thu ngân';
                            const method = tx.paymentMethod ?? tx.phuongThucTt ?? 'Tiền mặt';
                            const total = tx.totalAmount ?? tx.tongTien ?? tx.tienKhachDua ?? 0;
                            const isCancelled = (tx.status ?? tx.trangThai) === 'Cancelled' || (tx.status ?? tx.trangThai) === 'Đã hủy';

                            return (
                                <tr key={id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td className="py-3 px-4">
                                            <span className="fw-bold" style={{ color: '#196841', fontSize: '0.95rem' }}>
                                                {id}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4" style={{ color: '#4b5563', fontSize: '0.85rem' }}>
                                        <div className="fw-semibold">{timeObj.date}</div>
                                        <small className="text-muted">{timeObj.time}</small>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="fw-bold" style={{ color: '#374151', fontSize: '0.9rem' }}>{table}</div>
                                        <small style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>{area}</small>
                                    </td>
                                    <td className="py-3 px-4" style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                                        {cashier}
                                    </td>
                                    <td className="py-3 px-4">
                                        {renderPaymentMethod(method)}
                                    </td>
                                    <td className="py-3 px-4 text-end">
                                            <span style={{
                                                fontSize: '0.95rem',
                                                fontWeight: isCancelled ? '500' : 'bold',
                                                color: isCancelled ? '#9ca3af' : '#196841',
                                                textDecoration: isCancelled ? 'line-through' : 'none'
                                            }}>
                                                {formatCurrency(total)}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {!isCancelled ? (
                                            <span style={{ backgroundColor: '#e1e8e3', color: '#196841', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'inline-block' }}>
                                                    Đã thanh toán
                                                </span>
                                        ) : (
                                            <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'inline-block' }}>
                                                    Đã hủy
                                                </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </Table>
            </div>
            <div className="d-flex flex-shrink-0 justify-content-between align-items-center px-4 py-3 border-top bg-white" style={{ borderColor: '#f3f4f6' }}>
                <div className="text-muted small">
                    Tổng số: <strong>{totalItems}</strong> hóa đơn (Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>)
                </div>
                <div className="d-flex gap-1 align-items-center">
                    <Button
                        variant="light"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="bg-white border text-muted d-flex align-items-center justify-content-center"
                        style={{ width: '34px', height: '34px', borderRadius: '6px' }}
                    >
                        <BsChevronLeft size={13} />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            size="sm"
                            onClick={() => onPageChange(page)}
                            variant={page === currentPage ? "success" : "light"}
                            className={`d-flex align-items-center justify-content-center fw-bold ${page === currentPage ? 'text-white border-0' : 'bg-white border text-dark'}`}
                            style={{
                                width: '34px',
                                height: '34px',
                                backgroundColor: page === currentPage ? '#196841' : 'white',
                                borderRadius: '6px'
                            }}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        variant="light"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="bg-white border text-muted d-flex align-items-center justify-content-center"
                        style={{ width: '34px', height: '34px', borderRadius: '6px' }}
                    >
                        <BsChevronRight size={13} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTable;