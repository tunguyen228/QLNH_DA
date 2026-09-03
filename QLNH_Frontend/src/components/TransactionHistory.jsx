import React, { useState, useEffect } from 'react';
import { Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { BsCash, BsBank, BsCreditCard, BsSlashCircle } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';

const TransactionHistory = () => {
    // 1. Khởi tạo state rỗng thay vì gán cứng dữ liệu
    const [transactions, setTransactions] = useState([]);

    // State để quản lý trạng thái loading và lỗi
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Sử dụng useEffect để gọi API khi component vừa được render
    useEffect(() => {
        // Thay thế URL này bằng URL API thực tế của backend C# của bạn
        // Ví dụ chạy local: https://localhost:7001/api/transaction/history
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://localhost:5001/api/transaction/history');

                if (!response.ok) {
                    throw new Error('Lỗi khi tải dữ liệu từ máy chủ');
                }

                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []); // Mảng rỗng [] giúp API chỉ gọi 1 lần khi load trang

    // Hàm format tiền tệ VNĐ
    const formatCurrency = (amount) => {
        if (amount === 0) return '0đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Render icon và text phương thức thanh toán
    const renderPaymentMethod = (method) => {
        switch (method) {
            case 'Cash': return <span className="text-success"><BsCash className="me-2" />Tiền mặt</span>;
            case 'Transfer': return <span className="text-primary"><BsBank className="me-2" />Chuyển khoản</span>;
            case 'Card': return <span className="text-danger"><BsCreditCard className="me-2" />Thẻ (POS)</span>;
            default: return <span className="text-muted"><BsSlashCircle className="me-2" />—</span>;
        }
    };

    // Hiển thị giao diện Loading
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <Spinner animation="border" variant="success" />
                <span className="ms-2">Đang tải dữ liệu...</span>
            </div>
        );
    }

    // Hiển thị thông báo Lỗi nếu API hỏng
    if (error) {
        return <Alert variant="danger" className="m-4">Lỗi: {error}</Alert>;
    }

    // Giao diện bảng (khi đã có dữ liệu)
    return (
        <div className="p-4" style={{ backgroundColor: '#fdfdfd' }}>
            <Table hover responsive className="align-middle border-0" style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                    <th className="py-3 border-0">MÃ HĐ</th>
                    <th className="py-3 border-0">THỜI GIAN</th>
                    <th className="py-3 border-0">BÀN / KHU VỰC</th>
                    <th className="py-3 border-0">THU NGÂN</th>
                    <th className="py-3 border-0">THANH TOÁN</th>
                    <th className="py-3 border-0 text-end">TỔNG TIỀN</th>
                    <th className="py-3 border-0 text-center">TRẠNG THÁI</th>
                </tr>
                </thead>
                <tbody>
                {transactions.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">Không có giao dịch nào.</td>
                    </tr>
                ) : (
                    transactions.map((tx, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            {/* Mã HĐ */}
                            <td className="fw-bold" style={{ color: '#2e7d32', width: '12%' }}>{tx.invoiceId}</td>

                            {/* Thời gian */}
                            <td style={{ color: '#555', width: '15%' }}>{tx.time}</td>

                            {/* Bàn / Khu vực */}
                            <td style={{ width: '15%' }}>
                                <div className="fw-bold" style={{ color: '#333' }}>{tx.tableName}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{tx.area}</div>
                            </td>

                            {/* Thu ngân */}
                            <td style={{ color: '#555', width: '15%' }}>{tx.cashier}</td>

                            {/* Thanh toán */}
                            <td style={{ width: '15%' }}>{renderPaymentMethod(tx.paymentMethod)}</td>

                            {/* Tổng tiền */}
                            <td className="text-end" style={{ width: '13%' }}>
                                    <span style={{
                                        fontWeight: tx.status === 'Cancelled' ? 'normal' : 'bold',
                                        color: tx.status === 'Cancelled' ? '#adb5bd' : '#2e7d32',
                                        fontStyle: tx.status === 'Cancelled' ? 'italic' : 'normal'
                                    }}>
                                        {formatCurrency(tx.totalAmount)}
                                    </span>
                            </td>

                            {/* Trạng thái */}
                            <td className="text-center" style={{ width: '15%' }}>
                                {tx.status === 'Paid' ? (
                                    <Badge style={{ backgroundColor: '#d4edda', color: '#155724', padding: '8px 16px', borderRadius: '20px', fontWeight: '600' }}>
                                        Đã thanh toán
                                    </Badge>
                                ) : (
                                    <Badge style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '8px 16px', borderRadius: '20px', fontWeight: '600' }}>
                                        Đã hủy
                                    </Badge>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default TransactionHistory;