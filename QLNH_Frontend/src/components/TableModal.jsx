import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function TableModal({ show, onHide, onSave, editingTable }) {
    const [form, setForm] = useState({ maBan: '', capacity: '', floor: '1', trangThai: 'Trống' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (editingTable) {
            setForm({
                maBan: editingTable.maBan || editingTable.id || '',
                capacity: editingTable.capacity || '',
                floor: editingTable.floor || '1',
                trangThai: editingTable.trangThai || 'Trống'
            });
        } else {
            setForm({ maBan: '', capacity: '', floor: '1', trangThai: 'Trống' });
        }
        setError('');
    }, [editingTable, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.capacity) {
            setError('Vui lòng nhập số lượng ghế (sức chứa)');
            return;
        }
        if (!editingTable && !form.maBan) {
            setError('Vui lòng nhập mã bàn (Ví dụ: 101, 102...)');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                MaBan: Number(form.maBan),
                SoGhe: Number(form.capacity),
                Tang: Number(form.floor),
                TrangThai: form.trangThai
            };
            await onSave(payload, editingTable ? (editingTable.maBan || editingTable.id) : null);
            onHide();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bàn ăn');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ backgroundColor: '#1E3923', color: 'white' }}>
                <Modal.Title className="fs-5 fw-bold">{editingTable ? 'Chỉnh sửa thông tin bàn' : 'Thêm bàn ăn mới'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    {!editingTable && (
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Mã bàn / Số bàn</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ví dụ: 101, 201..."
                                value={form.maBan}
                                onChange={(e) => setForm({ ...form, maBan: e.target.value })}
                                required
                            />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Sức chứa (số lượng khách)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Nhập số người..."
                            value={form.capacity}
                            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Khu vực / Tầng</Form.Label>
                        <Form.Select
                            value={form.floor}
                            onChange={(e) => setForm({ ...form, floor: e.target.value })}
                        >
                            <option value="1">Tầng 1</option>
                            <option value="2">Tầng 2</option>
                            <option value="3">Tầng 3</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Tình trạng</Form.Label>
                        <Form.Select
                            value={form.trangThai}
                            onChange={(e) => setForm({ ...form, trangThai: e.target.value })}
                        >
                            <option value="Trống">Trống</option>
                            <option value="Đang phục vụ">Đang phục vụ</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="outline-secondary" onClick={onHide}>Hủy</Button>
                    <Button type="submit" disabled={saving} style={{ backgroundColor: '#1E3923', borderColor: '#1E3923' }}>
                        {saving ? 'Đang lưu...' : 'Lưu dữ liệu'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}