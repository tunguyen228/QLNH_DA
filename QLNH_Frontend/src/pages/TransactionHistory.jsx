import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
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
        <Container fluid className="p-0 d-flex flex-column h-100 overflow-hidden" style={{ backgroundColor: '#fcfaf5' }}>
            {/* THANH CÔNG CỤ LỌC */}
            <div className="px-4 pt-4 pb-2 flex-shrink-0">
                <div className="d-flex align-items-end gap-3 p-3 rounded-4" style={{ backgroundColor: '#f4f4f0' }}>

                    {/* Khoảng ngày */}
                    <div className="flex-grow-1">
                        <label className="text-muted fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                            KHOẢNG NGÀY
                        </label>
                        <div className="d-flex align-items-center bg-white rounded-3 px-3 py-2 border" style={{ color: '#4b5563', cursor: 'pointer' }}>
                            <Calendar className="me-2 text-muted" />
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>01/10/2023 - 31/10/2023</span>
                        </div>
                    </div>

                    {/* Nhân viên */}
                    <div className="flex-grow-1">
                        <label className="text-muted fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                            NHÂN VIÊN
                        </label>
                        <Form.Select className="border shadow-none bg-white rounded-3 py-2 fw-medium" style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                            <option>Tất cả nhân viên</option>
                        </Form.Select>
                    </div>

                    {/* Phương thức */}
                    <div className="flex-grow-1">
                        <label className="text-muted fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                            PHƯƠNG THỨC
                        </label>
                        <Form.Select className="border shadow-none bg-white rounded-3 py-2 fw-medium" style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                            <option>Tất cả phương thức</option>
                        </Form.Select>
                    </div>

                    {/* Nút Lọc kết quả */}
                    <div>
                        <Button
                            className="border-0 text-dark fw-bold d-flex align-items-center justify-content-center px-4 py-2 rounded-3 shadow-sm"
                            style={{ backgroundColor: '#efa77f', fontSize: '0.95rem', minWidth: '150px' }}
                        >
                            <Filter className="me-2" size={20} /> Lọc kết quả
                        </Button>
                    </div>

                </div>
            </div>

            {/* BẢNG DỮ LIỆU CỐ ĐỊNH CHIỀU CAO */}
            <div className="flex-grow-1 overflow-hidden d-flex flex-column px-4 pb-4">
                <TransactionTable transactions={transactions} isLoading={isLoading} error={error} />
            </div>
        </Container>
    );
};

export default TransactionHistory;