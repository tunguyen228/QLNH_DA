import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Calendar, Filter } from 'react-bootstrap-icons';
import TransactionTable from '../components/TransactionTable';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/transaction/history', {
                    signal: controller.signal
                });

                if (!response.ok) throw new Error('Lỗi khi tải dữ liệu từ máy chủ');

                const data = await response.json();
                if (isMounted) {
                    setTransactions(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (err.name !== 'AbortError' && isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchTransactions();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    // Tính toán dữ liệu cho trang hiện tại
    const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
    const currentTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="d-flex flex-column h-100 p-4 overflow-hidden" style={{ backgroundColor: '#fcfaf5' }}>
            {/* Header và Bộ lọc: Cố định bên trên */}
            <div className="flex-shrink-0 mb-3 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1E3923' }}>Lịch sử hóa đơn</h4>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        Theo dõi danh sách các đơn thanh toán và giao dịch
                    </span>
                </div>
            </div>

            {/* Bảng danh sách & Phân trang: Co giãn trọn màn hình */}
            <div className="flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
                <TransactionTable
                    transactions={currentTransactions}
                    totalItems={transactions.length}
                    isLoading={isLoading}
                    error={error}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default TransactionHistory;