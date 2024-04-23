const app = Vue.createApp({
  data() {
    return {
      query: '', // Giá trị tìm kiếm
      results: [], // Kết quả tìm kiếm
      error: null, // Thông báo lỗi
    };
  },
  methods: {
    getData() {
      this.error = null; // Xóa lỗi
      this.results = []; // Xóa kết quả cũ

      if (this.query.trim() === '') { // Kiểm tra đầu vào
        this.error = 'Hãy nhập từ khóa tìm kiếm';
        return;
      }

      const endpoint = `https://5a5a2ee556f54fd0a6fe178da929bd5a.api.mockbin.io/addresses`;

      axios.get(endpoint)
        .then((response) => {
          console.log('Dữ liệu từ API:', JSON.stringify(response.data, null, 2)); // In dữ liệu rõ ràng hơn

          if (Array.isArray(response.data)) { // Đảm bảo dữ liệu là mảng
            // Chuẩn hóa dữ liệu trước khi lọc
            const cleanData = response.data.map((item) => ({
              "Địa chỉ": item["Địa chỉ"] || '', // Sử dụng giá trị mặc định nếu không có
              "Đường": item["Đường"] || '',
              "Khu phố": item["Khu phố"] || '',
            }));

            // Lọc kết quả dựa trên từ khóa tìm kiếm (không phân biệt chữ hoa/chữ thường)
            this.results = cleanData.filter((item) =>
              item["Địa chỉ"].toLowerCase().includes(this.query.toLowerCase())
            );

            if (this.results.length === 0) {
              this.error = 'Không tìm thấy kết quả phù hợp';
            }
          } else {
            this.error = 'Dữ liệu trả về không phải là mảng';
          }
        })
        .catch((error) => { // Xử lý lỗi khi gọi API
          this.error = 'Lỗi khi truy xuất dữ liệu từ API';
          console.error('Lỗi API:', error);
        });
    },
  },
});

app.mount('#app'); // Gắn ứng dụng Vue vào phần tử HTML có ID "app"
