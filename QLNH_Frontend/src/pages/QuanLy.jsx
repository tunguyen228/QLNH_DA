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

// Định dạng ngày sang YYYY-MM-DD theo giờ địa phương
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function DashboardTab() {
    // 1. State & Bộ lọc Doanh thu
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

    // 2. State & Bộ lọc Top Món Ăn
    const [topDate, setTopDate] = useState({
        from: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
        to: formatDate(new Date())
    });
    const [topMonAn, setTopMonAn] = useState([]);
    const [loadingTop, setLoadingTop] = useState(true);

    // Fetch dữ liệu Doanh thu
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

    // Fetch dữ liệu Top Món
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

    // Nút lọc nhanh cho Doanh thu
    const handleQuickRevFilter = (type) => {
        const now = new Date();
        let from = new Date();
        if (type === 'today') {
            from = now;
        } else if (type === 'week') {
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

    // Nút lọc nhanh cho Top Món
    const handleQuickTopFilter = (type) => {
        const now = new Date();
        let from = new Date();
        if (type === 'today') {
            from = now;
        } else if (type === 'week') {
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
            {/* ================= PHẦN 1: THỐNG KÊ DOANH THU ================= */}
            <Card className="shadow-sm border-0 p-3 mb-4 bg-white" style={{ borderRadius: '12px' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#1E3923' }}>Thống Kê Doanh Thu</h5>
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
                            <Card className="shadow-sm border-0 p-3 h-100 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid #1E3923' }}>
                                <Card.Body className="p-2">
                                    <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>TỔNG DOANH THU</span>
                                    <h2 className="fw-bold my-2" style={{ color: '#1E3923' }}>
                                        {Number(revStats.tongDoanhThu).toLocaleString()}đ
                                    </h2>
                                    <p className="mb-0 text-success fw-semibold" style={{ fontSize: '0.85rem' }}>
                                        <FaChartLine /> Tính từ {revDate.from} đến {revDate.to}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm border-0 p-3 h-100 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid #8B4513' }}>
                                <Card.Body className="p-2">
                                    <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>SỐ ĐƠN HÀNG</span>
                                    <h2 className="fw-bold my-2" style={{ color: '#1E3923' }}>
                                        {Number(revStats.soDonHang).toLocaleString()}
                                    </h2>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                                        <FaBoxOpen /> Tổng số đơn trong khoảng thời gian này
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col xs={12}>
                            <Card className="shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '12px' }}>
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
                                <div className="d-flex justify-content-around text-muted pt-2" style={{ fontSize: '0.85rem' }}>
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

            {/* ================= PHẦN 2: TOP MÓN BÁN CHẠY ================= */}
            <Card className="shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '12px' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
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
                        {topMonAn.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">Không có dữ liệu món bán trong khoảng thời gian này</td>
                            </tr>
                        ) : (
                            topMonAn.map((mon, index) => (
                                <tr key={mon.id || index}>
                                    <td className="text-muted fw-bold">{mon.id}</td>
                                    <td><div className="fw-bold" style={{ color: '#1E3923' }}>{mon.name}</div></td>
                                    <td className="text-center fw-semibold">{mon.qty}</td>
                                    <td className="text-end fw-bold text-success">{mon.revenue}</td>
                                    <td className="text-center">
                                        <Badge bg={mon.status === 'Còn món' ? 'success' : 'warning'} text={mon.status === 'Còn món' ? 'white' : 'dark'}>
                                            {mon.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
}

// TAB 2: Quản lý nhân viên
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
                <h2 className="fw-bold" style={{ color: '#1E3923' }}>Quản lý nhân viên</h2>
                <Button variant="success" className="d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}
                        onClick={() => { setEditingStaff(null); setShowModal(true); }}>
                    <FaPlus /> Thêm nhân viên
                </Button>
            </div>

            <Card className="shadow-sm border-0 p-3 bg-white">
                {loading ? <div className="text-center py-4"><Spinner animation="border" /></div> : (
                    <Table hover responsive className="align-middle">
                        <thead>
                        <tr>
                            <th>ID</th><th>Họ tên</th><th>Chức vụ</th><th>Số điện thoại</th><th>Trạng thái</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {nhanVienList.map((nv) => (
                            <tr key={nv.maNV}>
                                <td>{nv.maNV}</td>
                                <td className="fw-bold">{nv.hoTen}</td>
                                <td>{nv.chucVu}</td>
                                <td>{nv.sdt}</td>
                                <td><Badge bg={nv.trangThai === 'Đang làm' ? 'success' : 'secondary'}>{nv.trangThai}</Badge></td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" className="me-2"
                                            onClick={() => { setEditingStaff(nv); setShowModal(true); }}><FaEdit /></Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(nv.maNV)}><FaTrash /></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            <StaffModal show={showModal} onHide={() => setShowModal(false)} onSave={handleSave} editingStaff={editingStaff} />
        </div>
    );
}

// TAB 3: Quản lý món ăn
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
                <h2 className="fw-bold" style={{ color: '#1E3923' }}>Quản lý thực đơn món ăn</h2>
                <Button variant="success" className="d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}
                        onClick={() => { setEditingItem(null); setShowModal(true); }}>
                    <FaPlus /> Thêm món mới
                </Button>
            </div>

            <Card className="shadow-sm border-0 p-3 bg-white">
                {loading ? <div className="text-center py-4"><Spinner animation="border" /></div> : (
                    <Table hover responsive className="align-middle">
                        <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Tên món</th>
                            <th>Nhóm món</th>
                            <th>Đơn giá</th>
                            <th className="text-center">Kinh doanh (Menu)</th>
                            <th className="text-center">Kho hàng</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {monAnList.map((mon) => {
                            const isDangKinhDoanh = mon.dangKinhDoanh ?? mon.DangKinhDoanh ?? false;
                            const isTamHet = mon.tamHet ?? mon.TamHet ?? false;
                            const id = mon.maMon ?? mon.MaMon;

                            return (
                                <tr key={id} style={{ opacity: isDangKinhDoanh ? 1 : 0.65 }}>
                                    <td>{id}</td>
                                    <td className="fw-bold">{mon.tenMon ?? mon.TenMon}</td>
                                    <td>{mon.tenNhom ?? mon.TenNhom}</td>
                                    <td>{(mon.giaTien ?? mon.GiaTien)?.toLocaleString()} đ</td>
                                    <td className="text-center">
                                        <Button
                                            size="sm"
                                            variant={isDangKinhDoanh ? "success" : "secondary"}
                                            className="px-2 py-1"
                                            onClick={() => handleToggleDangKinhDoanh(mon)}
                                            style={{ minWidth: '130px', fontSize: '0.8rem' }}
                                        >
                                            {isDangKinhDoanh ? "Đang mở bán" : "Đã ngừng bán"}
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <Button
                                            size="sm"
                                            variant={isTamHet ? "danger" : "outline-success"}
                                            className="px-2 py-1"
                                            disabled={!isDangKinhDoanh}
                                            onClick={() => handleToggleTamHet(mon)}
                                            style={{ minWidth: '105px', fontSize: '0.8rem' }}
                                        >
                                            {isTamHet ? "✕ Tạm hết" : "✓ Còn món"}
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="outline-primary" size="sm" className="me-2"
                                                onClick={() => { setEditingItem(mon); setShowModal(true); }}><FaEdit /></Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(id)}><FaTrash /></Button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                )}
            </Card>

            <MenuModal show={showModal} onHide={() => setShowModal(false)} onSave={handleSave} editingItem={editingItem} nhomList={nhomList} />
        </div>
    );
}

// TAB 4: Quản lý bàn ăn
function TableTab() {
    const [tableList, setTableList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);

    useEffect(() => { loadTables(); }, []);

    const loadTables = async () => {
        setLoading(true);
        try { setTableList(await fetchAllTables()); }
        catch (error) { console.error("Lỗi tải bàn ăn:", error); }
        finally { setLoading(false); }
    };

    const handleSave = async (formData, id) => {
        if (id) await updateTable(id, formData);
        else await createTable(formData);
        await loadTables();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa bàn này?')) return;
        try { await deleteTable(id); await loadTables(); }
        catch { alert('Không thể xóa bàn này'); }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1E3923' }}>Quản lý bàn ăn</h2>
                <Button variant="success" className="d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}
                        onClick={() => { setEditingTable(null); setShowModal(true); }}>
                    <FaPlus /> Thêm bàn mới
                </Button>
            </div>

            <Card className="shadow-sm border-0 p-3 bg-white">
                {loading ? <div className="text-center py-4"><Spinner animation="border" /></div> : (
                    <Table hover responsive className="align-middle">
                        <thead>
                        <tr>
                            <th>Mã bàn</th><th>Sức chứa</th><th>Khu vực</th><th>Tình trạng</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableList.map((b) => (
                            <tr key={b.maBan}>
                                <td className="fw-bold">{b.maBan}</td>
                                <td>{b.capacity} người</td>
                                <td>{b.floor}</td>
                                <td>
                                    <Badge bg={b.trangThai === 'Trống' ? 'success' : b.trangThai === 'Đang phục vụ' ? 'warning' : 'info'}
                                           text={b.trangThai === 'Trống' ? 'white' : 'dark'}>
                                        {b.trangThai}
                                    </Badge>
                                </td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" className="me-2"
                                            onClick={() => { setEditingTable(b); setShowModal(true); }}><FaEdit /></Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(b.maBan)}><FaTrash /></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            <TableModal show={showModal} onHide={() => setShowModal(false)} onSave={handleSave} editingTable={editingTable} />
        </div>
    );
}