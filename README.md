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

Chọn ngành → Chọn doanh nghiệp mô phỏng → Thiết lập (vị trí, chủ đề, người phỏng vấn, ngôn ngữ, giới hạn thời gian)
→ Học trước → Phỏng vấn → Nhận phản hồi (Relevance, Clarity, Structure) → Tích lũy điểm rèn luyện → Mở rộng lộ trình.

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
    │   ├── mockEngine.js   # Chế độ demo + chấm điểm theo quy tắc
    │   └── progress.js     # Điểm rèn luyện, mở khóa, lịch sử
    ├── components/         # Header, Stepper, ScoreBar
    └── screens/            # Từng màn hình của luồng sử dụng
```

Muốn thêm câu hỏi, doanh nghiệp hay bài học: chỉ cần sửa `src/data/content.js`.

## 6. Phạm vi MVP

Có: ngành IT · Intern, Fresher · 3 doanh nghiệp mô phỏng · 3 chủ đề · 3 vai nhà tuyển dụng ·
phỏng vấn văn bản · câu hỏi đào sâu, giới hạn thời gian, tình huống thay đổi · phản hồi 3 tiêu chí ·
điểm rèn luyện và mở khóa.

Để sau MVP: phỏng vấn giọng nói, đánh giá phát âm, ngành khác, cấp Junior/Senior, tài khoản đăng nhập,
dashboard cho nhà trường.
