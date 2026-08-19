import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../CSS/TableMap.css';
import { getTableMap } from '../services/tableService';  

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

            const allTablesRaw = dbData.areas.flatMap(area => area.tables);

            const formattedTables = allTablesRaw.map(table => {
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
        navigate(`/phuc-vu/menu/${tableId}`);
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    const displayedTables = allTables.filter(table => table.tang === currentFloor);

    return (
        <Container fluid className="p-4 min-vh-100" style={{ backgroundColor: '#fcfaf5' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <div className="fw-bold fs-4 mb-0" style={{ color: '#2b5c38' }}>
                        <i className="bi bi-egg-fried me-2"></i>Sơ Đồ Bàn Ăn
                    </div>
                </div>
                <div className="bg-white rounded-pill p-1 shadow-sm d-flex">
                    <Button
                        variant="light"
                        className={`rounded-pill px-4 fw-bold border-0 floor-btn ${currentFloor === 1 ? 'active' : ''}`}
                        onClick={() => setCurrentFloor(1)}
                    > Tầng 1
                    </Button>
                    <Button
                        variant="light"
                        className={`rounded-pill px-4 fw-bold border-0 floor-btn ${currentFloor === 2 ? 'active' : ''}`}
                        onClick={() => setCurrentFloor(2)}
                    > Tầng 2
                    </Button>
                </div>
            </div>

            <Row className="g-4">
                {displayedTables.length > 0 ? (
                    displayedTables.map(table => (
                        <Col xs={12} md={table.colSpan} key={table.id}>
                            <Card
                                className={`table-card ${getStatusClass(table.status)} h-100 p-3`}
                                onClick={() => handleTableClick(table.id)}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <h3 className="fw-bold mb-0 table-name">
                                        {table.name.replace('Bàn ', ' ')} 
                                    </h3>
                                    <span className="status-badge text-uppercase">
                                        {table.statusText}
                                    </span>
                                </div>
                                <div className="mt-auto d-flex align-items-center seats-info fw-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill me-2" viewBox="0 0 16 16">
                                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                                    </svg>
                                    <span>{table.seats < 10 ? `0${table.seats}` : table.seats} Khách</span>
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