# PalSpeak – Bản demo MVP

Nền tảng luyện phỏng vấn xin việc bằng AI cho sinh viên IT (dự án EXE101).
Bản demo viết bằng **React + Vite**.

## 1. Cài đặt (làm một lần)

Cần cài **Node.js 18 trở lên** (tải tại nodejs.org, bản LTS).

Mở thư mục `code` bằng VS Code, mở Terminal (`Ctrl + ~`) rồi chạy:

```bash
npm install
```

## 2. Chạy demo

```bash
npm run dev
```

Trình duyệt sẽ tự mở `http://localhost:5173`. Nếu không tự mở thì copy địa chỉ đó vào trình duyệt.

Muốn tắt: bấm `Ctrl + C` trong Terminal.

## 3. Hai chế độ chấm

| Chế độ | Khi nào dùng | Cần gì |
|---|---|---|
| **Chế độ demo** | Mặc định khi chưa có API key. Hợp để trình chiếu trên lớp vì không phụ thuộc mạng. | Không cần gì |
| **AI thật** | Người phỏng vấn do AI đóng vai, hỏi đào sâu theo câu trả lời, AI chấm và nhận xét chi tiết. | API key |

Chế độ demo: người phỏng vấn đi theo kịch bản có sẵn, chấm điểm theo quy tắc (từ khóa, độ dài, cấu trúc STAR).

### Ngôn ngữ phỏng vấn

Mặc định hội thoại phỏng vấn bằng **tiếng Anh** (câu hỏi, câu đào sâu, câu trả lời mẫu, giọng đọc en-US). Phần nhận xét vẫn bằng tiếng Việt để dễ hiểu.
Có thể đổi sang tiếng Việt ở bước **Thiết lập**.

### Giọng nói (Speech-to-Text và Text-to-Speech)

Dùng Web Speech API có sẵn trong trình duyệt, miễn phí, không cần API key hay cài thêm gì.

- **Text-to-Speech:** người phỏng vấn tự đọc câu hỏi thành tiếng (bật/tắt ở bước Thiết lập). Mỗi câu hỏi có nút **Nghe** để nghe lại. Đồng hồ tạm dừng trong lúc đọc.
- **Speech-to-Text:** bấm **Nói câu trả lời** để trả lời bằng micro, chữ hiện dần vào ô nhập, có thể sửa lại trước khi gửi.
- Micro cần mở bằng **Chrome hoặc Edge** và cho phép trình duyệt dùng micro ở lần đầu. Trình duyệt khác vẫn gõ phím bình thường.

### Khung đánh giá

Sau buổi phỏng vấn, mỗi câu hỏi có:

- Điểm 3 tiêu chí: Relevance, Clarity, Structure.
- **Lỗi cụ thể theo từng câu:** câu có lỗi được tô đỏ và đánh số ngay trong câu trả lời, kèm "Vấn đề" và "Nên sửa"
  (từ đệm, nói chung chung không có số liệu, chỉ nói về nhóm mà không nói vai trò bản thân, câu quá dài, thiếu tự tin, từ ngữ suồng sã...).
- **Câu trả lời mẫu tối ưu** (có nút **Nghe mẫu**) và dàn ý gợi ý.
  Chế độ demo dùng câu mẫu soạn sẵn; chế độ AI viết câu mẫu riêng dựa trên chính nội dung bạn đã trả lời.

### Bật AI thật

1. Sao chép file `.env.example` thành `.env` (cùng thư mục).
2. Điền API key vào dòng `AI_API_KEY=`.
   - OpenAI: lấy key tại platform.openai.com, giữ nguyên `AI_BASE_URL` và `AI_MODEL=gpt-4o-mini`.
   - Google Gemini (có gói miễn phí): lấy key tại aistudio.google.com, dùng 3 dòng ở "Cách 2" trong file.
     Kiểm tra lại tên model đang được hỗ trợ trên trang của Google nếu báo lỗi model.
3. Tắt và chạy lại `npm run dev`. Góc trên bên phải sẽ hiện **AI thật**.

API key chỉ nằm ở máy chủ dev của Vite (xem `vite.config.js`), trình duyệt không nhìn thấy.
**Không** đưa file `.env` lên GitHub hay gửi cho người khác.

## 4. Luồng sử dụng

Chọn ngành → Chọn doanh nghiệp mô phỏng → Thiết lập (vị trí, chủ đề, người phỏng vấn, ngôn ngữ, giới hạn thời gian, giọng nói)
→ Học trước → Phỏng vấn (gõ phím hoặc nói) → Nhận phản hồi (3 tiêu chí, lỗi từng câu, câu trả lời mẫu) → Tích lũy điểm rèn luyện → Mở rộng lộ trình.

### Trình tự câu hỏi (giống một buổi phỏng vấn thật)

| Chủ đề | Thứ tự câu hỏi |
|---|---|
| 1. Khởi động & hành vi (HR) | Giới thiệu bản thân → 1 câu kinh nghiệm (dự án / mâu thuẫn nhóm / điểm mạnh-yếu) → Vì sao chọn công ty |
| 2. Chuyên môn (luôn do Tech Lead phỏng vấn) | Công nghệ trong dự án gần nhất → 1 câu kiến thức (REST/GraphQL hoặc OOP) → 1 tình huống (lỗi 500 hoặc bất đồng thiết kế database) |
| 3. Tổng hợp (Manager) | Giới thiệu ngắn → Dự án hoặc công nghệ đã dùng → Tình huống thay đổi |

- Mỗi bước chọn ngẫu nhiên một câu cùng loại, nên luyện lại không bị trùng y hệt nhưng thứ tự luôn hợp lý.
- Người phỏng vấn có câu chuyển ý giữa các phần, và cuối buổi hỏi "Do you have any questions for me?" (không tính điểm, có góp ý riêng).
- Muốn đổi trình tự hoặc thêm câu hỏi: sửa `stages` trong `src/data/content.js`.

- PixelStart mở sẵn; NovaTech cần 60 điểm rèn luyện; GlobalCore cần 150 điểm.
- Chủ đề 2 mở khi xong chủ đề 1, chủ đề 3 mở khi xong chủ đề 2.
- Khi thuyết trình: vào **Tiến độ** → bật **Chế độ trình bày** để mở khóa toàn bộ.

Tiến độ được lưu trong trình duyệt (localStorage). Xóa ở trang **Tiến độ**.

## 5. Cấu trúc thư mục

```
code/
├── index.html
├── vite.config.js          # Cấu hình Vite + proxy gọi AI (giấu API key)
├── .env.example            # Mẫu cấu hình AI
└── src/
    ├── main.jsx
    ├── App.jsx             # Điều hướng giữa các màn hình, lưu tiến độ
    ├── styles.css
    ├── data/content.js     # Ngành, doanh nghiệp, vai phỏng vấn, bài học, ngân hàng câu hỏi
    ├── lib/
    │   ├── aiEngine.js     # Người phỏng vấn AI + chấm điểm bằng AI
    │   ├── mockEngine.js   # Chế độ demo + chấm điểm theo quy tắc + bắt lỗi từng câu
    │   ├── speech.js       # Nói thành chữ và đọc thành tiếng (Web Speech API)
    │   └── progress.js     # Điểm rèn luyện, mở khóa, lịch sử
    ├── components/         # Header, Stepper, ScoreBar, Icons
    └── screens/            # Từng màn hình của luồng sử dụng
```

Muốn thêm câu hỏi, câu trả lời mẫu, doanh nghiệp hay bài học: chỉ cần sửa `src/data/content.js`.

## 6. Phạm vi MVP

Có: ngành IT · Intern, Fresher · 3 doanh nghiệp mô phỏng · 3 chủ đề · 3 vai nhà tuyển dụng ·
phỏng vấn bằng văn bản hoặc giọng nói (Speech-to-Text, Text-to-Speech) · câu hỏi đào sâu, giới hạn thời gian, tình huống thay đổi ·
phản hồi 3 tiêu chí, chỉ rõ lỗi từng câu, câu trả lời mẫu tối ưu · điểm rèn luyện và mở khóa.

Để sau MVP: đánh giá phát âm và ngữ điệu, ngành khác, cấp Junior/Senior, tài khoản đăng nhập,
dashboard cho nhà trường.
