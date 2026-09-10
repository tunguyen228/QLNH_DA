// File: components/TableModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function TableModal({ show, onHide, onSave, editingTable }) {
    const [form, setForm] = useState({ capacity: '', floor: '', trangThai: 'Trống' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingTable) {
            setForm({ capacity: editingTable.capacity || '', floor: editingTable.floor || '', trangThai: editingTable.trangThai || 'Trống' });
        } else {
            setForm({ capacity: '', floor: '', trangThai: 'Trống' });
        }
        setError('');
    }, [editingTable, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.capacity) { setError('Vui lòng nhập sức chứa'); return; }
        setSaving(true);
        try {
            await onSave({ ...form, capacity: Number(form.capacity) }, editingTable?.maBan);
            onHide();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ backgroundColor: '#1E3923', color: 'white' }}>
                <Modal.Title>{editingTable ? 'Sửa thông tin bàn' : 'Thêm bàn mới'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <Form.Group className="mb-3">
                        <Form.Label>Sức chứa (số người)</Form.Label>
                        <Form.Control type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Khu vực / Tầng</Form.Label>
                        <Form.Control value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tình trạng</Form.Label>
                        <Form.Select value={form.trangThai} onChange={(e) => setForm({ ...form, trangThai: e.target.value })}>
                            <option value="Trống">Trống</option>
                            <option value="Đang phục vụ">Đang phục vụ</option>
                            <option value="Đã đặt trước">Đã đặt trước</option>
                        </Form.Select>
                    </Form.Group>
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