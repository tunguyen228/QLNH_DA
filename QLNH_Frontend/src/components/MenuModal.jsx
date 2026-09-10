// File: components/MenuModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

export default function MenuModal({ show, onHide, onSave, editingItem, nhomList }) {
    const [form, setForm] = useState({ tenMon: '', maNhom: '', giaTien: '', hinhAnh: '', moTa: '', dangKinhDoanh: true });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingItem) {
            setForm({
                tenMon: editingItem.tenMon || '',
                maNhom: editingItem.maNhom || '',
                giaTien: editingItem.giaTien || '',
                hinhAnh: editingItem.hinhAnh || '',
                moTa: editingItem.moTa || '',
                dangKinhDoanh: editingItem.dangKinhDoanh ?? true
            });
        } else {
            setForm({ tenMon: '', maNhom: nhomList[0]?.maNhom || '', giaTien: '', hinhAnh: '', moTa: '', dangKinhDoanh: true });
        }
        setError('');
    }, [editingItem, show, nhomList]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.tenMon.trim() || !form.maNhom || !form.giaTien) {
            setError('Vui lòng nhập đầy đủ tên món, nhóm và giá tiền');
            return;
        }
        setSaving(true);
        try {
            await onSave({ ...form, maNhom: Number(form.maNhom), giaTien: Number(form.giaTien) }, editingItem?.maMon);
            onHide();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton style={{ backgroundColor: '#1E3923', color: 'white' }}>
                <Modal.Title>{editingItem ? 'Sửa món ăn' : 'Thêm món mới'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <Row>
                        <Col md={7}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên món</Form.Label>
                                <Form.Control value={form.tenMon} onChange={(e) => setForm({ ...form, tenMon: e.target.value })} />
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nhóm món</Form.Label>
                                <Form.Select value={form.maNhom} onChange={(e) => setForm({ ...form, maNhom: e.target.value })}>
                                    {nhomList.map((n) => <option key={n.maNhom} value={n.maNhom}>{n.tenNhom}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Giá tiền (đ)</Form.Label>
                                <Form.Control type="number" value={form.giaTien} onChange={(e) => setForm({ ...form, giaTien: e.target.value })} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Link hình ảnh</Form.Label>
                                <Form.Control value={form.hinhAnh} onChange={(e) => setForm({ ...form, hinhAnh: e.target.value })} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control as="textarea" rows={2} value={form.moTa} onChange={(e) => setForm({ ...form, moTa: e.target.value })} />
                    </Form.Group>
                    <Form.Check
                        type="switch"
                        label="Đang kinh doanh"
                        checked={form.dangKinhDoanh}
                        onChange={(e) => setForm({ ...form, dangKinhDoanh: e.target.checked })}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Hủy</Button>
                    <Button type="submit" disabled={saving} style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}>
                        {saving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}