# PalSpeak – Bản demo MVP

Nền tảng luyện phỏng vấn xin việc bằng AI cho sinh viên IT (dự án EXE101).
Bản demo viết bằng **React + Vite**, giao diện tông tím – cam (có chế độ sáng/tối, chạy được trên điện thoại).
Đây là bản "giống hoàn chỉnh": có đủ các trang của một sản phẩm thật, nhưng tài khoản và dữ liệu vẫn lưu trên trình duyệt (chưa có máy chủ).

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

**Vào nhanh khi trình bày:** ở trang chủ bấm **Xem bản demo** (tài khoản sinh viên mẫu, đã có sẵn 4 buổi luyện),
hoặc ở trang Đăng nhập chọn **Tài khoản nhà trường demo**. Không cần mật khẩu.

## 3. Hai chế độ chấm

| Chế độ | Khi nào dùng | Cần gì |
|---|---|---|
| **Chế độ demo** | Mặc định khi chưa có API key. Hợp để trình chiếu trên lớp vì không phụ thuộc mạng. | Không cần gì |
| **AI thật** | Người phỏng vấn do AI đóng vai, hỏi đào sâu theo câu trả lời, AI chấm và nhận xét chi tiết. | API key |

Chế độ demo: người phỏng vấn đi theo kịch bản có sẵn, chấm điểm theo quy tắc (từ khóa, độ dài, cấu trúc STAR).

### Ngôn ngữ phỏng vấn

Mặc định hội thoại phỏng vấn bằng **tiếng Anh** (câu hỏi, câu đào sâu, câu trả lời mẫu, giọng đọc en-US). Phần nhận xét vẫn bằng tiếng Việt để dễ hiểu.
Có thể đổi sang tiếng Việt ở bước **Thiết lập** hoặc đặt mặc định trong **Hồ sơ & cài đặt**.

### Giọng nói (Speech-to-Text và Text-to-Speech)

Dùng Web Speech API có sẵn trong trình duyệt, miễn phí, không cần API key hay cài thêm gì.

- **Text-to-Speech:** người phỏng vấn tự đọc câu hỏi thành tiếng (bật/tắt ở bước Thiết lập). Có nút **Nghe lại**. Đồng hồ tạm dừng trong lúc đọc.
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
3. Tắt và chạy lại `npm run dev`. Thanh trên cùng sẽ hiện **AI sẵn sàng**.

API key chỉ nằm ở máy chủ dev của Vite (xem `vite.config.js`), trình duyệt không nhìn thấy.
**Không** đưa file `.env` lên GitHub hay gửi cho người khác.

## 4. Các trang

| Trang | Địa chỉ | Nội dung |
|---|---|---|
| Trang chủ | `#/` | Giới thiệu sản phẩm, tính năng, bảng giá, hỏi đáp |
| Đăng nhập / Đăng ký | `#/login`, `#/register` | Tài khoản sinh viên hoặc nhà trường, có tài khoản demo |
| Tạo hồ sơ | `#/onboarding` | Trường, chuyên ngành, vị trí, ngày phỏng vấn, tùy chọn luyện tập |
| Tổng quan | `#/dashboard` | Điểm, chuỗi ngày luyện, buổi được gợi ý, biểu đồ, lộ trình |
| Luyện phỏng vấn | `#/practice` | Ngành → doanh nghiệp → thiết lập → học trước → phỏng vấn → phản hồi |
| Lịch sử & tiến bộ | `#/history`, `#/history/<id>` | Biểu đồ, so sánh lần đầu / lần gần nhất, xem lại từng buổi, xuất CSV |
| Thư viện | `#/library` | Bài học, ngân hàng câu hỏi (có câu mẫu nghe được), người phỏng vấn, mẹo |
| Huy hiệu | `#/achievements` | Cấp độ và 13 huy hiệu |
| Hồ sơ & cài đặt | `#/profile` | Sửa hồ sơ, tùy chọn mặc định, giao diện, chế độ trình bày, tải / xóa dữ liệu |
| Nhà trường | `#/school` (+ `/students`, `/classes`, `/pilot`) | Bảng điều khiển theo lớp (dữ liệu mẫu), mã mời lớp, chỉ số thử nghiệm H1–H3 (dữ liệu thật) |

Sau mỗi buổi phỏng vấn có khảo sát nhanh 2 câu; kết quả được dùng cho trang **Chỉ số thử nghiệm** của nhà trường.

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
- Khi thuyết trình: vào **Hồ sơ & cài đặt** → bật **Chế độ trình bày** để mở khóa toàn bộ.

Tiến độ được lưu trong trình duyệt (localStorage), riêng cho từng tài khoản. Xóa ở **Hồ sơ & cài đặt**.

## 5. Cấu trúc thư mục

```
code/
├── index.html
├── vite.config.js             # Cấu hình Vite + proxy gọi AI (giấu API key)
├── .env.example               # Mẫu cấu hình AI
└── src/
    ├── main.jsx
    ├── App.jsx                # Định tuyến các trang, chặn trang cần đăng nhập
    ├── router.jsx             # Điều hướng bằng dấu # (không cần thư viện)
    ├── styles.css             # Toàn bộ giao diện, biến màu ở đầu file
    ├── context/AppContext.jsx # Tài khoản, tiến độ, giao diện sáng/tối, thông báo
    ├── services/              # TẦNG GIẢ LẬP MÁY CHỦ – sau này thay bằng gọi API
    │   ├── auth.js            # Đăng ký, đăng nhập, tài khoản demo
    │   ├── demoSeed.js        # Dữ liệu mẫu cho tài khoản sinh viên demo
    │   ├── schoolData.js      # Dữ liệu mẫu nhà trường + chỉ số thử nghiệm
    │   └── storage.js         # Đọc/ghi localStorage
    ├── data/content.js        # Ngành, doanh nghiệp, vai phỏng vấn, bài học, ngân hàng câu hỏi
    ├── lib/
    │   ├── aiEngine.js        # Người phỏng vấn AI + chấm điểm bằng AI
    │   ├── mockEngine.js      # Chế độ demo + chấm điểm theo quy tắc + bắt lỗi từng câu
    │   ├── speech.js          # Nói thành chữ và đọc thành tiếng (Web Speech API)
    │   ├── progress.js        # Điểm rèn luyện, mở khóa, lịch sử, cấp độ, thống kê
    │   ├── achievements.js    # Huy hiệu
    │   └── format.js          # Định dạng ngày, số, xuất CSV
    ├── components/            # Khung trang, biểu đồ SVG, biểu tượng, hộp thoại, thông báo
    ├── pages/                 # Từng trang (trang chủ, tổng quan, lịch sử, nhà trường...)
    └── screens/               # Các bước của luồng luyện phỏng vấn
```

Muốn thêm câu hỏi, câu trả lời mẫu, doanh nghiệp hay bài học: chỉ cần sửa `src/data/content.js`.

### Khi làm bản hoàn chỉnh

- **Máy chủ:** thay các hàm trong `src/services/` (đang đọc/ghi localStorage) bằng lời gọi API. Các hàm đã trả về Promise nên giao diện không phải sửa.
  `loadProgress` / `saveProgress` trong `src/lib/progress.js` cũng chuyển sang API.
- **Mật khẩu:** `services/auth.js` chỉ băm đơn giản để mô phỏng; bản thật phải xác thực và băm mật khẩu ở máy chủ.
- **Nhà trường:** `services/schoolData.js` đang sinh dữ liệu mẫu; bản thật lấy sinh viên theo mã lớp từ máy chủ.
- **Màu sắc:** đổi các biến `--brand` (tím) và `--accent` (cam) ở đầu `src/styles.css`.

## 6. Phạm vi MVP

Có: ngành IT · Intern, Fresher · 3 doanh nghiệp mô phỏng · 3 chủ đề · 3 vai nhà tuyển dụng ·
phỏng vấn bằng văn bản hoặc giọng nói (Speech-to-Text, Text-to-Speech) · câu hỏi đào sâu, giới hạn thời gian, tình huống thay đổi ·
phản hồi 3 tiêu chí, chỉ rõ lỗi từng câu, câu trả lời mẫu tối ưu · điểm rèn luyện, cấp độ, huy hiệu và mở khóa ·
lịch sử và biểu đồ tiến bộ · tài khoản mô phỏng · bảng điều khiển nhà trường bản xem trước (dữ liệu mẫu) · khảo sát sau buổi.

Để sau MVP: đánh giá phát âm và ngữ điệu, ngành khác, cấp Junior/Senior, máy chủ và đăng nhập thật,
dữ liệu nhà trường thật, bảng xếp hạng.
