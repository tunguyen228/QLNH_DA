import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Spinner, Button } from 'react-bootstrap';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaChartLine, FaBoxOpen } from 'react-icons/fa';
import SidebarQuanLy from '../components/SidebarQuanLy';
import { getMenuItems } from '../services/menuService';
import TransactionHistory from './TransactionHistory';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function QuanLy() {
    const navigate = useNavigate();
    const hoTen = localStorage.getItem('hoTen') || 'Quản lý';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#fcfaf5' }}>
            <SidebarQuanLy hoTen={hoTen} onLogout={handleLogout} />

            <div className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                <Routes>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<DashboardTab />} />
                    <Route path="staff" element={<StaffTab />} />
                    <Route path="menu" element={<MenuTab />} />
                    <Route path="lich-su" element={<TransactionHistory />} />
                </Routes>
            </div>
        </div>
    );
}

// TAB 1: Trang chủ & Thống kê (Gọi API từ DashboardController)
function DashboardTab() {
    const [stats, setStats] = useState({
        tongDoanhThu: 0,
        soDonHang: 0,
        doanhThuTuan: [],
        topMonAn: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Dashboard/stats`);
            setStats(response.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thống kê từ API:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;
    }

    return (
        <div style={{ color: '#2c3e50' }}>
            {/* 2 THẺ THỐNG KÊ (ĐÃ XÓA GIÁ TRỊ TRUNG BÌNH & CƠ CẤU KHU VỰC) */}
            <Row className="mb-4 g-4">
                <Col md={6}>
                    <Card className="shadow-sm border-0 p-3 h-100 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid #1E3923' }}>
                        <Card.Body className="p-2">
                            <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>TỔNG DOANH THU</span>
                            <h2 className="fw-bold my-2" style={{ color: '#1E3923' }}>
                                {Number(stats.tongDoanhThu).toLocaleString()}đ
                            </h2>
                            <p className="mb-0 text-success fw-semibold" style={{ fontSize: '0.85rem' }}><FaChartLine /> Cập nhật trực tiếp từ hệ thống</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm border-0 p-3 h-100 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid #8B4513' }}>
                        <Card.Body className="p-2">
                            <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>SỐ ĐƠN HÀNG</span>
                            <h2 className="fw-bold my-2" style={{ color: '#1E3923' }}>
                                {Number(stats.soDonHang).toLocaleString()}
                            </h2>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}><FaBoxOpen /> Tổng số đơn đã hoàn thành</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* BIỂU ĐỒ DOANH THU THEO TUẦN */}
            <Row className="mb-4">
                <Col xs={12}>
                    <Card className="shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '12px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0" style={{ color: '#1E3923' }}>Doanh thu theo tuần</h5>
                        </div>

                        <div className="d-flex align-items-end justify-content-around" style={{ height: '240px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                            {stats.doanhThuTuan.map((item, idx) => (
                                <div key={idx} className="d-flex flex-column align-items-center h-100 justify-content-end" style={{ width: '10%' }}>
                                    {item.active && (
                                        <span className="badge mb-2 shadow-sm" style={{ backgroundColor: '#2c3e50', fontSize: '0.65rem' }}>{item.label}</span>
                                    )}
                                    <div
                                        style={{
                                            width: '100%',
                                            height: `${item.val}%`,
                                            backgroundColor: item.active ? '#1E3923' : '#d4ded7',
                                            borderRadius: '6px 6px 0 0',
                                            transition: 'height 0.3s'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-around text-muted pt-2" style={{ fontSize: '0.85rem' }}>
                            {stats.doanhThuTuan.map((item, idx) => (
                                <span key={idx} style={{ width: '10%', textAlign: 'center', fontWeight: item.active ? 'bold' : 'normal', color: item.active ? '#1E3923' : '#6c757d' }}>
                  {item.day}
                </span>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* BẢNG TOP MÓN ĂN BÁN CHẠY */}
            <Card className="shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0" style={{ color: '#1E3923' }}>Top Món Ăn Bán Chạy</h5>
                </div>

                <Table hover responsive className="align-middle mb-0">
                    <thead>
                    <tr className="text-muted" style={{ fontSize: '0.8rem', backgroundColor: '#fcfaf5' }}>
                        <th className="py-3">STT</th>
                        <th className="py-3">MÓN ĂN</th>
                        <th className="py-3 text-center">SỐ LƯỢNG</th>
                        <th className="py-3 text-end">DOANH THU</th>
                        <th className="py-3 text-center">TRẠNG THÁI</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stats.topMonAn.map((mon) => (
                        <tr key={mon.id}>
                            <td className="text-muted fw-bold">{mon.id}</td>
                            <td>
                                <div className="fw-bold" style={{ color: '#1E3923' }}>{mon.name}</div>
                                {/*<small className="text-muted">{mon.desc}</small>*/}
                            </td>
                            <td className="text-center fw-semibold">{mon.qty}</td>
                            <td className="text-end fw-bold text-success">{mon.revenue}</td>
                            <td className="text-center">
                                <Badge bg={mon.status === 'Còn món' ? 'success' : 'warning'} text={mon.status === 'Còn món' ? 'white' : 'dark'}>
                                    {mon.status}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}

// TAB 2: Quản lý nhân viên
function StaffTab() {
    const [nhanVienList] = useState([
        { id: 1, hoTen: 'Nguyễn Văn A', chucVu: 'Thu ngân', sdt: '0901234567', trangThai: 'Đang làm' },
    ]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1E3923' }}>Quản lý nhân viên</h2>
                <Button variant="success" className="d-flex align-items-center gap-2" style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}>
                    <FaPlus /> Thêm nhân viên
                </Button>
            </div>

            <Card className="shadow-sm border-0 p-3 bg-white">
                <Table hover responsive className="align-middle">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Chức vụ</th>
                        <th>Số điện thoại</th>
                        <th>Trạng thái</th>
                        <th className="text-center">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {nhanVienList.map((nv) => (
                        <tr key={nv.id}>
                            <td>{nv.id}</td>
                            <td className="fw-bold">{nv.hoTen}</td>
                            <td>{nv.chucVu}</td>
                            <td>{nv.sdt}</td>
                            <td><Badge bg="success">{nv.trangThai}</Badge></td>
                            <td className="text-center">
                                <Button variant="outline-primary" size="sm" className="me-2"><FaEdit /></Button>
                                <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}

// TAB 3: Quản lý món ăn
function MenuTab() {
    const [monAnList, setMonAnList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const data = await getMenuItems();
            setMonAnList(data);
        } catch (error) {
            console.error("Lỗi tải món ăn:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1E3923' }}>Quản lý thực đơn món ăn</h2>
                <Button variant="success" className="d-flex align-items-center gap-2" style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}>
                    <FaPlus /> Thêm món mới
                </Button>
            </div>

            <Card className="shadow-sm border-0 p-3 bg-white">
                {loading ? (
                    <div className="text-center py-4"><Spinner animation="border" /></div>
                ) : (
                    <Table hover responsive className="align-middle">
                        <thead>
                        <tr>
                            <th>Mã Món</th>
                            <th>Tên món</th>
                            <th>Nhóm món</th>
                            <th>Đơn giá</th>
                            <th>Trạng thái kinh doanh</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {monAnList.map((mon) => (
                            <tr key={mon.maMon}>
                                <td>{mon.maMon}</td>
                                <td className="fw-bold">{mon.tenMon}</td>
                                <td>{mon.tenNhom}</td>
                                <td>{mon.giaTien?.toLocaleString()} đ</td>
                                <td>
                                    <Badge bg={mon.dangKinhDoanh ? 'success' : 'danger'}>
                                        {mon.dangKinhDoanh ? 'Đang kinh doanh' : 'Ngừng bán'}
                                    </Badge>
                                </td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" className="me-2"><FaEdit /></Button>
                                    <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
}