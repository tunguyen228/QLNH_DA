import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Spinner, Button, Form } from 'react-bootstrap';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaChartLine, FaBoxOpen, FaFilter } from 'react-icons/fa';
import SidebarQuanLy from '../components/SidebarQuanLy';
import TransactionHistory from './TransactionHistory';
import StaffModal from '../components/StaffModal';
import { getAllStaff, createStaff, updateStaff, deleteStaff } from '../services/staffService';
import MenuModal from '../components/MenuModal';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getAllNhomMon, toggleTamHet } from '../services/menuService';
import TableModal from '../components/TableModal';
import { fetchAllTables, createTable, updateTable, deleteTable } from '../services/tableService';
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
        <div className="d-flex" style={{ height: '100vh', backgroundColor: '#fcfaf5', overflow: 'hidden' }}>
            <SidebarQuanLy hoTen={hoTen} onLogout={handleLogout} />
            <div className="flex-grow-1 d-flex flex-column overflow-hidden" style={{ minWidth: 0 }}>
                <Routes>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<div className="h-100 overflow-auto p-4"><DashboardTab /></div>} />
                    <Route path="staff" element={<div className="h-100 overflow-auto p-4"><StaffTab /></div>} />
                    <Route path="menu" element={<div className="h-100 overflow-auto p-4"><MenuTab /></div>} />
                    <Route path="lich-su" element={<TransactionHistory />} />
                </Routes>
            </div>
        </div>
    );
}

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function DashboardTab() {
    const [revDate, setRevDate] = useState({
        from: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
        to: formatDate(new Date())
    });
    const [revStats, setRevStats] = useState({
        tongDoanhThu: 0,
        soDonHang: 0,
        doanhThuTuan: []
    });
    const [loadingRev, setLoadingRev] = useState(true);

    const [topDate, setTopDate] = useState({
        from: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
        to: formatDate(new Date())
    });
    const [topMonAn, setTopMonAn] = useState([]);
    const [loadingTop, setLoadingTop] = useState(true);

    const fetchRevenue = async (fromVal = revDate.from, toVal = revDate.to) => {
        setLoadingRev(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/Dashboard/revenue`, {
                params: { from: fromVal, to: toVal }
            });
            setRevStats({
                tongDoanhThu: res.data.tongDoanhThu || 0,
                soDonHang: res.data.soDonHang || 0,
                doanhThuTuan: res.data.doanhThuTuan || []
            });
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu doanh thu:", error);
        } finally {
            setLoadingRev(false);
        }
    };

    const fetchTopDishes = async (fromVal = topDate.from, toVal = topDate.to) => {
        setLoadingTop(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/Dashboard/top-dishes`, {
                params: { from: fromVal, to: toVal }
            });
            setTopMonAn(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải top món ăn:", error);
        } finally {
            setLoadingTop(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
        fetchTopDishes();
    }, []);

    const handleQuickRevFilter = (type) => {
        const now = new Date();
        let from = new Date();
        if (type === 'today') from = now;
        else if (type === 'week') {
            const dayOfWeek = now.getDay() || 7;
            from.setDate(now.getDate() - dayOfWeek + 1);
        } else if (type === 'month') {
            from = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        const newFrom = formatDate(from);
        const newTo = formatDate(now);
        setRevDate({ from: newFrom, to: newTo });
        fetchRevenue(newFrom, newTo);
    };

    const handleQuickTopFilter = (type) => {
        const now = new Date();
        let from = new Date();
        if (type === 'today') from = now;
        else if (type === 'week') {
            const dayOfWeek = now.getDay() || 7;
            from.setDate(now.getDate() - dayOfWeek + 1);
        } else if (type === 'month') {
            from = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        const newFrom = formatDate(from);
        const newTo = formatDate(now);
        setTopDate({ from: newFrom, to: newTo });
        fetchTopDishes(newFrom, newTo);
    };

    return (
        <div style={{ color: '#2c3e50' }}>
            {/* THỐNG KÊ DOANH THU */}
            <Card className="shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <h4 className="fw-bold mb-1" style={{ color: '#1E3923' }}>Thống Kê Doanh Thu</h4>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Theo dõi doanh thu và lượng đơn hoàn thành</span>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => handleQuickRevFilter('today')}>Hôm nay</Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => handleQuickRevFilter('week')}>Tuần này</Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => handleQuickRevFilter('month')}>Tháng này</Button>

                        <div className="d-flex align-items-center gap-1 ms-lg-2">
                            <Form.Control
                                type="date"
                                size="sm"
                                value={revDate.from}
                                onChange={(e) => setRevDate({ ...revDate, from: e.target.value })}
                            />
                            <span>-</span>
                            <Form.Control
                                type="date"
                                size="sm"
                                value={revDate.to}
                                onChange={(e) => setRevDate({ ...revDate, to: e.target.value })}
                            />
                            <Button
                                variant="success"
                                size="sm"
                                style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}
                                onClick={() => fetchRevenue(revDate.from, revDate.to)}
                            >
                                <FaFilter className="me-1" /> Lọc
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {loadingRev ? (
                <div className="text-center py-4 mb-4"><Spinner animation="border" variant="success" /></div>
            ) : (
                <>
                    <Row className="mb-4 g-4">
                        <Col md={6}>
                            <Card className="shadow-sm border-0 p-4 h-100 bg-white rounded-4" style={{ borderLeft: '5px solid #1E3923' }}>
                                <Card.Body className="p-0">
                                    <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>TỔNG DOANH THU</span>
                                    <h2 className="fw-bold my-2" style={{ color: '#1E3923' }}>
                                        {Number(revStats.tongDoanhThu).toLocaleString()}đ
                                    </h2>
                                    <p className="mb-0 text-success fw-semibold" style={{ fontSize: '0.85rem' }}>
                                        <FaChartLine className="me-1" /> Tính từ {revDate.from} đến {revDate.to}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm border-0 p-4 h-100 bg-white rounded-4" style={{ borderLeft: '5px solid #8B4513' }}>
                                <Card.Body className="p-0">
                                    <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>SỐ ĐƠN HÀNG</span>
                                    <h2 className="fw-bold my-2" style={{ color: '#1E3923' }}>
                                        {Number(revStats.soDonHang).toLocaleString()}
                                    </h2>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                                        <FaBoxOpen className="me-1" /> Tổng số đơn trong khoảng thời gian này
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col xs={12}>
                            <Card className="shadow-sm border-0 p-4 bg-white rounded-4">
                                <h6 className="fw-bold mb-4" style={{ color: '#1E3923' }}>Doanh thu các ngày trong tuần</h6>
                                <div className="d-flex align-items-end justify-content-around" style={{ height: '240px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                                    {revStats.doanhThuTuan.map((item, idx) => (
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
                                <div className="d-flex justify-content-around text-muted pt-3" style={{ fontSize: '0.85rem' }}>
                                    {revStats.doanhThuTuan.map((item, idx) => (
                                        <span key={idx} style={{ width: '10%', textAlign: 'center', fontWeight: item.active ? 'bold' : 'normal', color: item.active ? '#1E3923' : '#6c757d' }}>
                                            {item.day}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* TOP MÓN BÁN CHẠY */}
            <Card className="shadow-sm border-0 p-4 bg-white rounded-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#1E3923' }}>Top Món Ăn Bán Chạy</h5>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Lọc danh sách món theo thời gian bán</span>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => handleQuickTopFilter('today')}>Hôm nay</Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => handleQuickTopFilter('week')}>Tuần này</Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => handleQuickTopFilter('month')}>Tháng này</Button>

                        <div className="d-flex align-items-center gap-1 ms-lg-2">
                            <Form.Control
                                type="date"
                                size="sm"
                                value={topDate.from}
                                onChange={(e) => setTopDate({ ...topDate, from: e.target.value })}
                            />
                            <span>-</span>
                            <Form.Control
                                type="date"
                                size="sm"
                                value={topDate.to}
                                onChange={(e) => setTopDate({ ...topDate, to: e.target.value })}
                            />
                            <Button
                                variant="success"
                                size="sm"
                                style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}
                                onClick={() => fetchTopDishes(topDate.from, topDate.to)}
                            >
                                <FaFilter className="me-1" /> Lọc
                            </Button>
                        </div>
                    </div>
                </div>

                {loadingTop ? (
                    <div className="text-center py-4"><Spinner animation="border" variant="success" /></div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead>
                            <tr className="text-muted" style={{ fontSize: '0.8rem', backgroundColor: '#fcfaf5' }}>
                                <th className="py-3 px-3">STT</th>
                                <th className="py-3">MÓN ĂN</th>
                                <th className="py-3 text-center">SỐ LƯỢNG</th>
                                <th className="py-3 text-end">DOANH THU</th>
                                <th className="py-3 text-center">TRẠNG THÁI</th>
                            </tr>
                            </thead>
                            <tbody>
                            {topMonAn.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">Không có dữ liệu món bán trong khoảng thời gian này</td>
                                </tr>
                            ) : (
                                topMonAn.map((mon, index) => (
                                    <tr key={mon.id || index}>
                                        <td className="py-3 px-3 text-muted fw-bold">{mon.id}</td>
                                        <td className="py-3"><div className="fw-bold" style={{ color: '#1E3923' }}>{mon.name}</div></td>
                                        <td className="py-3 text-center fw-semibold">{mon.qty}</td>
                                        <td className="py-3 text-end fw-bold text-success">{mon.revenue}</td>
                                        <td className="py-3 text-center">
                                            <Badge bg={mon.status === 'Còn món' ? 'success' : 'warning'} text={mon.status === 'Còn món' ? 'white' : 'dark'}>
                                                {mon.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
}

function StaffTab() {
    const [nhanVienList, setNhanVienList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    useEffect(() => { loadStaff(); }, []);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const data = await getAllStaff();
            setNhanVienList(data);
        } catch (error) {
            console.error("Lỗi tải nhân viên:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData, id) => {
        if (id) await updateStaff(id, formData);
        else await createStaff(formData);
        await loadStaff();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa nhân viên này?')) return;
        try {
            await deleteStaff(id);
            await loadStaff();
        } catch (error) {
            alert('Không thể xóa nhân viên này');
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1E3923' }}>Quản lý nhân viên</h4>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>Quản lý danh sách, phân quyền và trạng thái nhân sự</span>
                </div>
                <Button variant="success" className="d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3"
                        style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}
                        onClick={() => { setEditingStaff(null); setShowModal(true); }}>
                    <FaPlus /> Thêm nhân viên
                </Button>
            </div>

            <Card className="shadow-sm border-0 p-4 bg-white rounded-4">
                {loading ? <div className="text-center py-4"><Spinner animation="border" variant="success" /></div> : (
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead>
                            <tr className="text-muted" style={{ fontSize: '0.8rem', backgroundColor: '#fcfaf5' }}>
                                <th className="py-3 px-3">ID</th>
                                <th className="py-3">HỌ TÊN</th>
                                <th className="py-3">VAI TRÒ</th>
                                <th className="py-3">SỐ ĐIỆN THOẠI</th>
                                <th className="py-3">TRẠNG THÁI</th>
                                <th className="py-3 text-center">THAO TÁC</th>
                            </tr>
                            </thead>
                            <tbody>
                            {nhanVienList.map((nv) => (
                                <tr key={nv.maNV}>
                                    <td className="py-3 px-3 text-muted fw-bold">{nv.maNV}</td>
                                    <td className="py-3 fw-bold" style={{ color: '#1E3923' }}>{nv.hoTen}</td>
                                    <td className="py-3">{nv.chucVu}</td>
                                    <td className="py-3">{nv.sdt}</td>
                                    <td className="py-3"><Badge bg={nv.trangThai === 'Đang làm' ? 'success' : 'secondary'}>{nv.trangThai}</Badge></td>
                                    <td className="py-3 text-center">
                                        <Button variant="outline-primary" size="sm" className="me-2"
                                                onClick={() => { setEditingStaff(nv); setShowModal(true); }}><FaEdit /></Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(nv.maNV)}><FaTrash /></Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>

            <StaffModal show={showModal} onHide={() => setShowModal(false)} onSave={handleSave} editingStaff={editingStaff} />
        </div>
    );
}

function MenuTab() {
    const [monAnList, setMonAnList] = useState([]);
    const [nhomList, setNhomList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [mon, nhom] = await Promise.all([getMenuItems(), getAllNhomMon()]);
            setMonAnList(mon);
            setNhomList(nhom);
        } catch (error) {
            console.error("Lỗi tải món ăn:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData, id) => {
        if (id) await updateMenuItem(id, formData);
        else await createMenuItem(formData);
        await loadAll();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa món ăn này?')) return;
        try { await deleteMenuItem(id); await loadAll(); }
        catch { alert('Không thể xóa món ăn này'); }
    };

    const handleToggleDangKinhDoanh = async (mon) => {
        const id = mon.maMon ?? mon.MaMon;
        const currentStatus = mon.dangKinhDoanh ?? mon.DangKinhDoanh ?? false;
        const updatedMon = {
            ...mon,
            dangKinhDoanh: !currentStatus,
            DangKinhDoanh: !currentStatus
        };

        setMonAnList(prev => prev.map(item => (item.maMon ?? item.MaMon) === id ? updatedMon : item));

        try {
            await updateMenuItem(id, updatedMon);
        } catch (error) {
            console.error("Lỗi cập nhật kinh doanh:", error);
            alert("Lỗi cập nhật! Vui lòng thử lại.");
            await loadAll();
        }
    };

    const handleToggleTamHet = async (mon) => {
        const id = mon.maMon ?? mon.MaMon;
        const currentTamHet = mon.tamHet ?? mon.TamHet ?? false;

        setMonAnList(prev => prev.map(item =>
            (item.maMon ?? item.MaMon) === id ? { ...item, tamHet: !currentTamHet, TamHet: !currentTamHet } : item
        ));

        try {
            await toggleTamHet(id);
        } catch (error) {
            console.error("Lỗi cập nhật tạm hết:", error);
            alert("Lỗi cập nhật tạm hết!");
            await loadAll();
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1E3923' }}>Quản lý thực đơn món ăn</h4>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>Thêm mới món ăn, phân nhóm và thiết lập trạng thái kinh doanh</span>
                </div>
                <Button variant="success" className="d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3"
                        style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}
                        onClick={() => { setEditingItem(null); setShowModal(true); }}>
                    <FaPlus /> Thêm món mới
                </Button>
            </div>

            <Card className="shadow-sm border-0 p-4 bg-white rounded-4">
                {loading ? <div className="text-center py-4"><Spinner animation="border" variant="success" /></div> : (
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead>
                            <tr className="text-muted" style={{ fontSize: '0.8rem', backgroundColor: '#fcfaf5' }}>
                                <th className="py-3 px-3">MÃ</th>
                                <th className="py-3">TÊN MÓN</th>
                                <th className="py-3">NHÓM MÓN</th>
                                <th className="py-3">ĐƠN GIÁ</th>
                                <th className="py-3 text-center">KINH DOANH (MENU)</th>
                                <th className="py-3 text-center">KHO HÀNG</th>
                                <th className="py-3 text-center">THAO TÁC</th>
                            </tr>
                            </thead>
                            <tbody>
                            {monAnList.map((mon) => {
                                const isDangKinhDoanh = mon.dangKinhDoanh ?? mon.DangKinhDoanh ?? false;
                                const isTamHet = mon.tamHet ?? mon.TamHet ?? false;
                                const id = mon.maMon ?? mon.MaMon;

                                return (
                                    <tr key={id} style={{ opacity: isDangKinhDoanh ? 1 : 0.65 }}>
                                        <td className="py-3 px-3 text-muted fw-bold">{id}</td>
                                        <td className="py-3 fw-bold" style={{ color: '#1E3923' }}>{mon.tenMon ?? mon.TenMon}</td>
                                        <td className="py-3">{mon.tenNhom ?? mon.TenNhom}</td>
                                        <td className="py-3 fw-semibold">{(mon.giaTien ?? mon.GiaTien)?.toLocaleString()} đ</td>
                                        <td className="py-3 text-center">
                                            <Button
                                                size="sm"
                                                variant={isDangKinhDoanh ? "success" : "secondary"}
                                                className="px-3 py-1 rounded-pill"
                                                onClick={() => handleToggleDangKinhDoanh(mon)}
                                                style={{ minWidth: '130px', fontSize: '0.8rem' }}
                                            >
                                                {isDangKinhDoanh ? "Đang mở bán" : "Đã ngừng bán"}
                                            </Button>
                                        </td>
                                        <td className="py-3 text-center">
                                            <Button
                                                size="sm"
                                                variant={isTamHet ? "danger" : "outline-success"}
                                                className="px-3 py-1 rounded-pill"
                                                disabled={!isDangKinhDoanh}
                                                onClick={() => handleToggleTamHet(mon)}
                                                style={{ minWidth: '105px', fontSize: '0.8rem' }}
                                            >
                                                {isTamHet ? "✕ Tạm hết" : "✓ Còn món"}
                                            </Button>
                                        </td>
                                        <td className="py-3 text-center">
                                            <Button variant="outline-primary" size="sm" className="me-2"
                                                    onClick={() => { setEditingItem(mon); setShowModal(true); }}><FaEdit /></Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(id)}><FaTrash /></Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card>

            <MenuModal show={showModal} onHide={() => setShowModal(false)} onSave={handleSave} editingItem={editingItem} nhomList={nhomList} />
        </div>
    );
}