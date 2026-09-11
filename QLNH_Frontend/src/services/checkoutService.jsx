import axios from 'axios';

const host = window.location.hostname;
// Thay đổi baseURL phù hợp với port chạy Backend C# của bạn
const API_URL = `http://${host}:5000/api`;

const getCashierInfo = async (id) => {
    try {
        // Thay API_BASE_URL cho khớp với route Controller của bạn
        const response = await axios.get(`http://localhost:5000/api/checkout/thungan/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const checkoutService = {
    // Lấy danh sách các bàn ĐANG PHỤC VỤ (có phiếu gọi chưa thanh toán)
    getTablesToCheckout: async () => {
        try {
            // SỬA Ở ĐÂY: Thêm /waiter/ vào trước Table/active
            const response = await axios.get(`${API_URL}/waiter/Table/active`);
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy danh sách bàn:", error);
            throw error;
        }
    },

    // Lấy chi tiết phiếu gọi của một bàn cụ thể
    getOrderDetailsByTable: async (tableId) => {
        try {
            // SỬ DỤNG ENDPOINT MỚI VỪA TẠO
            const response = await axios.get(`${API_URL}/Order/table/${tableId}/checkout`);
            return response.data; // Dữ liệu trả về đã được gộp số lượng sẵn
        } catch (error) {
            console.error("Lỗi lấy chi tiết phiếu gọi:", error);
            throw error;
        }
    },
    
    getNextInvoiceCode: async () => {
        try {
            // Nhớ thay đổi đường dẫn cho đúng với route của OrderController
            const response = await axios.get(`${API_URL}/Invoice/next-invoice-code`);
            return response.data.invoiceCode;
        } catch (error) {
            console.error("Lỗi lấy mã HĐ tiếp theo:", error);
            // Nếu lỗi, trả về một chuỗi mặc định tạm
            return "INV-ERROR";
        }
    },
    
    processCheckout: async (payload) => {
        try {
            // Gọi POST đến CheckoutController vừa tạo
            const response = await axios.post(`${API_URL}/Checkout`, payload);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            // Bắt lỗi từ BadRequest của Backend
            if (error.response && error.response.data) {
                return error.response.data;
            }
            throw new Error("Lỗi kết nối máy chủ");
        }
    },
    
    getCashierInfo: async (userId) => {
        try {
            // Thay đổi URL endpoint này cho khớp với cấu hình API Backend C# của bạn
            const response = await fetch(`http://localhost:5000/api/user/${userId}`);

            if (!response.ok) {
                throw new Error('Lỗi mạng khi tải thông tin thu ngân');
            }

            // Giả sử API trả về dạng { id: 1, hoTen: "Nguyễn Thị Cẩm Tú", ... }
            return await response.json();
        } catch (error) {
            console.error("Lỗi API getCashierInfo:", error);
            throw error;
        }
    }
};

export default checkoutService;