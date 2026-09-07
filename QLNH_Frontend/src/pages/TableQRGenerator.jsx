import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function TableQRGenerator() {
    const danhSachBan = [101, 102, 103, 104, 204, 205, 206, 207];
    const hostIP = "192.168.1.126:5173";
    const canvasRefs = useRef({});

    const handleDownload = (maBan) => {
        const canvas = canvasRefs.current[maBan];
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `QR_Ban_${maBan}.png`;
        link.click();
    };

    return (
        <div style={{ padding: '30px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <div className="no-print" style={{ marginBottom: 20 }}>
                <h2>Hệ Thống Mã QR Gọi Món Tự Động</h2>
                <p style={{ color: '#666' }}>Dùng điện thoại quét mã dưới đây để test gọi món cho từng bàn</p>
                <button onClick={() => window.print()} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    In tất cả mã QR
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                {danhSachBan.map((maBan) => {
                    const qrUrl = `http://${hostIP}/menu/${maBan}`;
                    return (
                        <div key={maBan} className="qr-card" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', background: '#fff' }}>
                            <h3 style={{ color: '#2b5c38' }}>Bàn: {maBan}</h3>
                            <div style={{ background: '#f9f9f9', padding: '10px', display: 'inline-block', borderRadius: '8px' }}>
                                <QRCodeCanvas
                                    value={qrUrl}
                                    size={150}
                                    ref={(el) => { if (el) canvasRefs.current[maBan] = el; }}
                                />
                            </div>
                            <p style={{ fontSize: '11px', color: '#888', marginTop: '12px', wordBreak: 'break-all' }}>
                                {qrUrl}
                            </p>
                            <button className="no-print" onClick={() => handleDownload(maBan)} style={{ marginTop: 8, cursor: 'pointer' }}>
                                Tải ảnh QR
                            </button>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .qr-card { break-inside: avoid; page-break-inside: avoid; }
                }
            `}</style>
        </div>
    );
}