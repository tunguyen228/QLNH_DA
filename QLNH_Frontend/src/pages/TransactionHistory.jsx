import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Table } from 'react-bootstrap'; // Đã thêm Card, Table
import { Calendar, Filter } from 'react-bootstrap-icons';
import TransactionTable from '../components/TransactionTable';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/transaction/history');

                if (!response.ok) throw new Error('Lỗi khi tải dữ liệu từ máy chủ');

                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="d-flex flex-column h-100 p-4" style={{ backgroundColor: '#fcfaf5' }}>
            {/* 1. Header & Bộ lọc: Cố định trên cùng */}
            <div className="flex-shrink-0 mb-3 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0" style={{ color: '#1E3923' }}>Lịch sử hóa đơn</h4>
                <div className="d-flex gap-2">
                    {/* Bộ lọc ngày, tìm kiếm... */}
                </div>
            </div>

            {/* 2. Khung chứa bảng và chân trang */}
            <Card className="border-0 shadow-sm flex-grow-1 d-flex flex-column overflow-hidden bg-white" style={{ borderRadius: '12px' }}>
                {/* Vùng thân bảng: Chỉ cuộn riêng vùng này */}
                <div className="flex-grow-1 overflow-auto">
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                        <tr>
                            <th>MÃ HĐ</th>
                            <th>BÀN</th>
                            <th>THỜI GIAN</th>
                            <th>THU NGÂN</th>
                            <th className="text-end">TỔNG TIỀN</th>
                            <th className="text-center">PHƯƠNG THỨC</th>
                            <th className="text-center">THAO TÁC</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Render danh sách hóa đơn */}
                        </tbody>
                    </Table>
                </div>

                {/* 3. Phần cuối bảng (Footer / Phân trang / Tổng kết): Cố định không bao giờ bị cuộn */}
                <div className="flex-shrink-0 border-top p-3 bg-white d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                        Hiển thị <strong>10</strong> trên tổng số <strong>120</strong> hóa đơn
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold" style={{ color: '#1E3923' }}>
                            Tổng trang: 12.500.000 đ
                        </span>
                        {/* Các nút phân trang */}
                        <div className="btn-group btn-group-sm">
                            <Button variant="outline-secondary">Trước</Button>
                            <Button variant="outline-secondary">Sau</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TransactionHistory;