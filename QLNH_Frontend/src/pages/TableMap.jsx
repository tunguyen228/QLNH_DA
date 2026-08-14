import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../CSS/TableMap.css';
import { getTableMap } from '../services/tableService';   // trước: './tableService'

const TableMap = () => {
    const [allTables, setAllTables] = useState([]);
    const [currentFloor, setCurrentFloor] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTableData();
    }, []);

    const fetchTableData = async () => {
        try {
            const dbData = await getTableMap();

            // Gộp bàn từ tất cả khu vực (areas) thành 1 mảng phẳng
            const allTablesRaw = dbData.areas.flatMap(area => area.tables);

            const formattedTables = allTablesRaw.map(table => {
                // Backend chỉ có 2 trạng thái: 0 = Empty (Trống), 1 = InUse (Đang phục vụ)
                const statusText = table.status === 1 ? 'ĐANG PHỤC VỤ' : 'TRỐNG';

                return {
                    id: table.id,
                    name: `Bàn ${table.id}`,
                    status: table.status,
                    statusText: statusText,
                    seats: table.capacity,
                    tang: Number(table.floor),
                    colSpan: table.capacity >= 8 ? 6 : 3
                };
            });

            setAllTables(formattedTables);
        } catch (error) {
            console.error("Lỗi khi tải sơ đồ bàn:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 1: return 'status-in-use';
            default: return 'status-empty';
        }
    };

    const handleTableClick = (tableId) => {
        console.log("Điều hướng tới menu của bàn:", tableId);
        navigate(`/dashboard/menu/${tableId}`);
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    const displayedTables = allTables.filter(table => table.tang === currentFloor);

    return (
        <Container fluid className="p-4 min-vh-100" style={{ backgroundColor: '#f4ece1' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#2c3e50' }}>Quản lý sơ đồ bàn</h2>
                <div className="bg-white rounded-pill p-1 shadow-sm border d-flex">
                    <Button
                        variant={currentFloor === 1 ? "success" : "light"}
                        className={`rounded-pill px-4 fw-bold border-0 ${currentFloor === 1 ? '' : 'text-muted bg-transparent'}`}
                        style={currentFloor === 1 ? { backgroundColor: '#8aab8a' } : {}}
                        onClick={() => setCurrentFloor(1)}
                    >
                        Tầng 1
                    </Button>
                    <Button
                        variant={currentFloor === 2 ? "success" : "light"}
                        className={`rounded-pill px-4 fw-bold border-0 ${currentFloor === 2 ? '' : 'text-muted bg-transparent'}`}
                        style={currentFloor === 2 ? { backgroundColor: '#8aab8a' } : {}}
                        onClick={() => setCurrentFloor(2)}
                    >
                        Tầng 2
                    </Button>
                </div>
            </div>

            <Row className="g-3">
                {displayedTables.length > 0 ? (
                    displayedTables.map(table => (
                        <Col xs={12} md={table.colSpan} key={table.id}>
                            <Card
                                className={`table-card ${getStatusClass(table.status)} border-0 h-100`}
                                onClick={() => handleTableClick(table.id)}
                                style={{ borderRadius: '16px', minHeight: '140px', cursor: 'pointer' }}
                            >
                                <div
                                    className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill d-flex align-items-center"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        color: table.status === 0 ? '#666' : '#fff'
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-people-fill me-1" viewBox="0 0 16 16">
                                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                                    </svg>
                                    {table.seats}
                                </div>

                                <div className="d-flex flex-column justify-content-center align-items-center h-100 p-3">
                                    <h3 className={`fw-bold mb-2 ${table.status === 0 ? 'text-success' : 'text-white'}`}>
                                        {table.name}
                                    </h3>
                                    <span
                                        className="fw-bold opacity-75"
                                        style={{ fontSize: '0.85rem', letterSpacing: '1px' }}
                                    >
                                        {table.statusText}
                                    </span>
                                </div>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <div className="text-center text-muted mt-5 w-100">
                        <h5>Chưa có bàn nào ở tầng này.</h5>
                    </div>
                )}
            </Row>
        </Container>
    );
};

export default TableMap;