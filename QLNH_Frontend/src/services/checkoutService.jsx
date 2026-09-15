import axios from 'axios';

const host = window.location.hostname;
const API_URL = `http://${host}:5000/api`;

const getCashierInfo = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/checkout/thungan/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const checkoutService = {
    getTablesToCheckout: async () => {
        try {
            const response = await axios.get(`${API_URL}/waiter/Table/active`);
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy danh sách bàn:", error);
            throw error;
        }
    },
    getOrderDetailsByTable: async (tableId) => {
        try {
            const response = await axios.get(`${API_URL}/Order/table/${tableId}/checkout`);
            return response.data; 
        } catch (error) {
            console.error("Lỗi lấy chi tiết phiếu gọi:", error);
            throw error;
        }
    },
    getNextInvoiceCode: async () => {
        try {
            const response = await axios.get(`${API_URL}/Invoice/next-invoice-code`);
            return response.data.invoiceCode;
        } catch (error) {
            console.error("Lỗi lấy mã HĐ tiếp theo:", error);
            return "INV-ERROR";
        }
    },
    processCheckout: async (payload) => {
        try {
            const response = await axios.post(`${API_URL}/Checkout`, payload);
            return response.data;
        } catch (error) {
            console.error("Chi tiết phản hồi lỗi từ server:", error.response?.data);
            if (error.response && error.response.data) {
                return error.response.data; 
            }
            return { success: false, message: "Lỗi kết nối máy chủ" };
        }
    },
    getCashierInfo: async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${userId}`);
            if (!response.ok) {
                throw new Error('Lỗi mạng khi tải thông tin thu ngân');
            }
            return await response.json();
        } catch (error) {
            console.error("Lỗi API getCashierInfo:", error);
            throw error;
        }
    }
};

export default checkoutService;