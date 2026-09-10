// File: components/StaffModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const CHUC_VU_OPTIONS = ['Phục vụ', 'Bếp', 'Thu ngân', 'Quản lý'];

export default function StaffModal({ show, onHide, onSave, editingStaff }) {
    const [form, setForm] = useState({ hoTen: '', chucVu: 'Phục vụ', sdt: '', email: '', trangThai: 'Đang làm' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingStaff) {
            setForm({
                hoTen: editingStaff.hoTen || '',
                chucVu: editingStaff.chucVu || 'Phục vụ',
                sdt: editingStaff.sdt || '',
                email: editingStaff.email || '',
                trangThai: editingStaff.trangThai || 'Đang làm'
            });
        } else {
            setForm({ hoTen: '', chucVu: 'Phục vụ', sdt: '', email: '', trangThai: 'Đang làm' });
        }
        setError('');
    }, [editingStaff, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.hoTen.trim() || !form.sdt.trim()) {
            setError('Vui lòng nhập đầy đủ họ tên và số điện thoại');
            return;
        }
        setSaving(true);
        try {
            await onSave(form, editingStaff?.maNV);
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
                <Modal.Title>{editingStaff ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <Form.Group className="mb-3">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Vai trò</Form.Label>
                        <Form.Select value={form.chucVu} onChange={(e) => setForm({ ...form, chucVu: e.target.value })}>
                            {CHUC_VU_OPTIONS.map((cv) => <option key={cv} value={cv}>{cv}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Trạng thái làm việc</Form.Label>
                        <Form.Select value={form.trangThai} onChange={(e) => setForm({ ...form, trangThai: e.target.value })}>
                            <option value="Đang làm">Đang làm</option>
                            <option value="Nghỉ việc">Nghỉ việc</option>
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