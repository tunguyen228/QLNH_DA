import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastProvider';
import { Row, Col, Card, Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategories, getMenuItems, sendOrderToKitchen } from '../services/menuService';
import { fetchAllTables } from '../services/tableService';
import '../CSS/Menu.css';

const normalizeCategory = (raw) => ({
    id: raw.maNhom ?? raw.MaNhom ?? raw.id ?? raw.Id,
    name: raw.tenNhom ?? raw.TenNhom ?? raw.name ?? raw.Name ?? '',
});

const normalizeMenuItem = (raw) => ({
    id: raw.maMon ?? raw.MaMon ?? raw.id ?? raw.Id,
    name: raw.tenMon ?? raw.TenMon ?? raw.name ?? raw.Name ?? '',
    price: Number(raw.giaTien ?? raw.GiaTien ?? raw.gia ?? raw.Gia ?? raw.price ?? raw.Price ?? 0),
    categoryId: raw.maNhom ?? raw.MaNhom ?? raw.categoryId ?? raw.CategoryId,
    categoryName: raw.tenNhom ?? raw.TenNhom ?? raw.categoryName ?? raw.CategoryName ?? '',
    image: raw.hinhAnh ?? raw.HinhAnh ?? raw.image ?? raw.Image ?? raw.imageUrl ?? null,
});

const Menu = () => {
    const navigate = useNavigate();
    const { tableId } = useParams();
    const { addToast } = useToast();
    const [categories, setCategories] = useState([]);
    const [allMenuItems, setAllMenuItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState(0);
    const [cart, setCart] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(tableId ? String(tableId) : '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSendOrder = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng đang trống!");
            return;
        }
        if (!selectedTable) {
            alert("Vui lòng chọn bàn trước khi gửi order!");
            return;
        }
        const storedMaNv = localStorage.getItem('maNv');
        if (!storedMaNv) {
            alert("Lỗi phiên đăng nhập! Vui lòng đăng nhập lại để tiếp tục.");
            return; 
        }
        const currentMaNv = parseInt(storedMaNv);
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await sendOrderToKitchen(selectedTable, currentMaNv, cart);
            addToast('Đã gửi order cho bếp thành công!', 'success');
            setCart([]);
        } catch (error) {
            console.error("Lỗi khi gửi order:", error);
            addToast('Lỗi: Không thể gửi xuống bếp!', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    useEffect(() => {
        const loadInitialData = async () => {
            const cats = await fetchCategories();
            setCategories(cats.map(normalizeCategory));
            const rawItems = await getMenuItems();
            const normalizedItems = rawItems.map(normalizeMenuItem);
            setAllMenuItems(normalizedItems);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (activeCategory === 0) {
            setMenuItems(allMenuItems);
        } else {
            setMenuItems(allMenuItems.filter(item => item.categoryId === activeCategory));
        }
    }, [activeCategory, allMenuItems]);

    useEffect(() => {
        const loadTables = async () => {
            const list = await fetchAllTables();
            setTables(list);
        };
        loadTables();
    }, []);

    useEffect(() => {
        setSelectedTable(tableId ? String(tableId) : '');
    }, [tableId]);

    const handleTableChange = (e) => {
        const value = e.target.value;
        setSelectedTable(value);
        navigate(value ? `/phuc-vu/menu/${value}` : `/phuc-vu/menu`, { replace: true });
    };

    const formatVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };
    
    const getQtyInCart = (id) => cart.find(c => c.id === id)?.qty ?? 0;

    const addToCart = (item) => {
        setCart(prev => {
            const exists = prev.find(c => c.id === item.id);
            if (exists) {
                return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
            }
            return [...prev, { ...item, qty: 1, note: '' }];
        });
    };

    const increaseQty = (id) => {
        setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c));
    };

    const decreaseQty = (id) => {
        setCart(prev => prev
            .map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c)
            .filter(c => c.qty > 0)
        );
    };

    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className="menu-wrapper px-1 pt-2 pb-3 w-100 vh-100 overflow-hidden">
            <Row className="h-100 m-0">
                <Col lg={8} xl={8} className="d-flex flex-column h-100">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
                        <InputGroup className="w-50 bg-white rounded-pill overflow-hidden shadow-sm border-0">
                            <InputGroup.Text className="bg-white border-0 ps-3">
                                <i className="bi bi-search text-muted"></i>
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Tìm kiếm món ăn..."
                                className="border-0 shadow-none py-2 bg-white"
                            />
                        </InputGroup>
                        <div className="d-flex align-items-center gap-4">
                            <i className="bi bi-bell-fill fs-5 text-success"></i>
                            <i className="bi bi-gear-fill fs-5 text-success"></i>
                            <i className="bi bi-question-circle-fill fs-5 text-success"></i>
                        </div>
                    </div>

                    <div className="d-flex gap-2 mb-4 overflow-auto hide-scrollbar pb-2 flex-shrink-0">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? "" : "light"}
                                className={`px-4 py-2 fw-medium shadow-sm btn-category ${activeCategory === cat.id ? 'active-cat' : 'bg-white text-dark border-0'}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>

                    <Row className="g-4 overflow-auto hide-scrollbar flex-grow-1 pb-4" style={{ minHeight: 0 }}>
                        {menuItems.map((item) => {
                            const qtyInCart = getQtyInCart(item.id);
                            return (
                                <Col sm={6} md={6} lg={4} xl={3} key={item.id}>
                                    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                                        <div className="position-relative food-img-placeholder">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <i className="bi bi-image fs-1"></i>
                                            )}
                                        </div>
                                        <Card.Body className="d-flex flex-column p-3">
                                            <Card.Title className="fw-bold mb-1" style={{ fontSize: '14px' }}>
                                                {item.name}
                                            </Card.Title>
                                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                                <span className="fw-bold" style={{ fontSize: '14px' }}>
                                                    {formatVND(item.price)}
                                                </span>

                                                {qtyInCart === 0 ? (
                                                    <button
                                                        type="button"
                                                        className="btn bg-white d-flex align-items-center justify-content-center p-0"
                                                        style={{
                                                            width: '20px',
                                                            height: '28px',
                                                            border: '1px solid #777',
                                                            borderRadius: '4px',
                                                            color: '#000',
                                                            fontWeight: '500'
                                                        }}
                                                        onClick={() => addToCart(item)}
                                                        aria-label="Thêm vào giỏ"
                                                    >
                                                        +
                                                    </button>
                                                ) : (
                                                    <div className="qty-control d-flex align-items-center">
                                                        <button
                                                            type="button"
                                                            className="btn bg-white d-flex align-items-center justify-content-center p-0"
                                                            style={{
                                                                width: '20px',
                                                                height: '28px',
                                                                border: '1px solid #777',
                                                                borderRadius: '4px',
                                                                color: '#000',
                                                                fontWeight: '500'
                                                            }}
                                                            onClick={() => decreaseQty(item.id)}
                                                            aria-label="Giảm số lượng"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="qty-value fw-medium" style={{ minWidth: '20px', textAlign: 'center' }}>
                                                            {qtyInCart}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn bg-white d-flex align-items-center justify-content-center p-0"
                                                            style={{
                                                                width: '20px',
                                                                height: '28px',
                                                                border: '1px solid #777',
                                                                borderRadius: '4px',
                                                                color: '#000',
                                                                fontWeight: '500'
                                                            }}
                                                            onClick={() => increaseQty(item.id)}
                                                            aria-label="Tăng số lượng"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Col>

                <Col lg={4} xl={4} className="h-100 pb-4">
                    <Card className="shadow-sm border-0 rounded-4 h-100 bg-white d-flex flex-column">
                        <Card.Body className="d-flex flex-column p-3 overflow-hidden">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <Form.Select
                                    size="sm"
                                    value={selectedTable}
                                    onChange={handleTableChange}
                                    style={{ width: '120px', flexShrink: 0 }}
                                    className="fw-bold"
                                >
                                    <option value="">Chọn bàn</option>
                                    {tables.map(t => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </Form.Select>
                            </div>

                            <ListGroup
                                variant="flush"
                                className="flex-grow-1 overflow-auto hide-scrollbar mb-3"
                                style={{ minHeight: 0 }}
                            >
                                {cart.map((cartItem) => (
                                    <ListGroup.Item key={cartItem.id} className="px-2 py-4 border-bottom border-light">
                                        <div className="d-flex gap-3">
                                            <div className="bg-light rounded d-flex justify-content-center align-items-center" style={{ width: '45px', height: '45px', flexShrink: 0 }}>
                                                <i className="bi bi-cup-hot text-muted"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                    <span className="fw-bold text-dark cart-item-name" style={{ fontSize: '0.9rem' }}>{cartItem.name}</span>
                                                    <span className="fw-bold" style={{ fontSize: '0.9rem' }}>{formatVND(cartItem.price * cartItem.qty)}</span>
                                                </div>
                                                <div className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>
                                                    {formatVND(cartItem.price)} / phần
                                                </div>

                                                <div className="d-flex justify-content-between align-items-end">
                                                    <div className="w-50">
                                                        {cartItem.note && (
                                                            <div className="text-danger fst-italic" style={{ fontSize: '0.75rem' }}>
                                                                Ghi chú: {cartItem.note}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="qty-control d-flex align-items-center">
                                                        <button
                                                            type="button"
                                                            className="btn bg-white d-flex align-items-center justify-content-center p-0"
                                                            style={{
                                                                width: '20px',
                                                                height: '28px',
                                                                border: '1px solid #777',
                                                                borderRadius: '4px',
                                                                color: '#000',
                                                                fontWeight: '500'
                                                            }}
                                                            onClick={() => decreaseQty(cartItem.id)}
                                                            aria-label="Giảm số lượng"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="qty-value fw-medium" style={{ minWidth: '20px', textAlign: 'center' }}>
                                                            {cartItem.qty}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn bg-white d-flex align-items-center justify-content-center p-0"
                                                            style={{
                                                                width: '20px',
                                                                height: '28px',
                                                                border: '1px solid #777',
                                                                borderRadius: '4px',
                                                                color: '#000',
                                                                fontWeight: '500'
                                                            }}
                                                            onClick={() => increaseQty(cartItem.id)}
                                                            aria-label="Tăng số lượng"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                            <div className="mt-auto pt-3 border-top">
                                <div className="d-flex justify-content-between mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                                    <span>Tạm tính</span>
                                    <span>{formatVND(subTotal)}</span>
                                </div>
                                <Button
                                    className="btn-submit-order w-100 fw-bold py-3 mt-2 d-flex justify-content-center align-items-center border-0"
                                    onClick={handleSendOrder}
                                    disabled={isSubmitting || cart.length === 0}
                                    style={{
                                        backgroundColor: '#2b5c38', /* Xanh lá rêu */
                                        color: '#ffffff',
                                        borderRadius: '12px'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            ĐANG GỬI...
                                        </>
                                    ) : (
                                        'GỬI ORDER'
                                    )}
                                </Button>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Menu;