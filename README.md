# PalSpeak – Bản demo MVP

**PalSpeak** là web luyện phỏng vấn xin việc cùng AI cho sinh viên Việt Nam ở nhiều ngành nghề, cấp độ **Intern** và **Fresher**
(dự án môn EXE101, mô hình B2B2C: sinh viên dùng, nhà trường chi trả).

Sinh viên chọn ngành (**IT, Marketing, Tài chính – Kế toán, Kinh doanh**) và một doanh nghiệp mô phỏng, học nhanh cách trả lời, rồi vào phỏng vấn với "người phỏng vấn ảo"
(gõ phím hoặc nói qua micro). Cuối buổi, PalSpeak chấm theo 3 tiêu chí, chỉ rõ câu nào nói chưa tốt và đưa câu trả lời mẫu.

> Đây là bản **"giống hoàn chỉnh"**: có đủ các trang của một sản phẩm thật (trang chủ, đăng nhập, tổng quan, lịch sử,
> trang nhà trường...), nhưng **chưa có máy chủ**. Tài khoản và tiến độ được lưu ngay trên trình duyệt của từng máy.

---

## Mục lục

1. [Chuẩn bị](#1-chuẩn-bị)
2. [Chạy trên máy tính](#2-chạy-trên-máy-tính)
3. [Dùng thử nhanh khi trình bày](#3-dùng-thử-nhanh-khi-trình-bày)
4. [Chạy trên điện thoại](#4-chạy-trên-điện-thoại)
5. [Hai chế độ chấm: Demo và AI thật](#5-hai-chế-độ-chấm-demo-và-ai-thật)
6. [Giọng nói và ngôn ngữ phỏng vấn](#6-giọng-nói-và-ngôn-ngữ-phỏng-vấn)
7. [Các trang trong app](#7-các-trang-trong-app)
8. [Một buổi luyện diễn ra thế nào](#8-một-buổi-luyện-diễn-ra-thế-nào)
9. [Điểm rèn luyện, mở khóa, cấp độ, huy hiệu](#9-điểm-rèn-luyện-mở-khóa-cấp-độ-huy-hiệu)
10. [Dữ liệu được lưu ở đâu](#10-dữ-liệu-được-lưu-ở-đâu)
11. [Xử lý lỗi thường gặp](#11-xử-lý-lỗi-thường-gặp)
12. [Cấu trúc thư mục](#12-cấu-trúc-thư-mục)
13. [Sửa nội dung và phát triển tiếp](#13-sửa-nội-dung-và-phát-triển-tiếp)
14. [Phạm vi MVP](#14-phạm-vi-mvp)

---

## 1. Chuẩn bị

Chỉ cần cài một thứ là **Node.js bản 18 trở lên** (khuyên dùng bản LTS tại [nodejs.org](https://nodejs.org)).
Đã thử chạy tốt trên Node 22.

Kiểm tra đã cài chưa: mở Terminal và gõ

```bash
node -v
```

Nếu hiện `v18...`, `v20...`, `v22...` là được.

Nên dùng **Chrome** hoặc **Edge** để mở app (trả lời bằng micro chỉ chạy trên hai trình duyệt này).

## 2. Chạy trên máy tính

**Lần đầu tiên** (tải thư viện, mất khoảng 1 phút):

1. Mở thư mục `code` bằng VS Code.
2. Mở Terminal trong VS Code bằng phím `Ctrl + ~`.
3. Chạy:

```bash
npm install
```

**Mỗi lần muốn chạy app:**

```bash
npm run dev
```

Trình duyệt sẽ tự mở `http://localhost:5173`. Nếu không tự mở thì copy địa chỉ đó dán vào Chrome.
Nếu cổng 5173 đang bận, Vite tự chuyển sang `5174`, `5175`... Hãy xem địa chỉ hiện trong Terminal.

**Tắt app:** bấm `Ctrl + C` trong Terminal.

**Tải code mới nhất từ GitHub** (khi nhóm vừa cập nhật):

```bash
git pull
```

Sau đó chạy lại `npm install` (nếu có thư viện mới) rồi `npm run dev`.

## 3. Dùng thử nhanh khi trình bày

Không cần tạo tài khoản, không cần mật khẩu:

| Muốn xem | Bấm vào |
|---|---|
| Góc nhìn **sinh viên** | Trang chủ → **Xem bản demo**, hoặc trang Đăng nhập → **Tài khoản sinh viên demo** |
| Góc nhìn **nhà trường** | Trang Đăng nhập → **Tài khoản nhà trường demo** |

- Tài khoản sinh viên demo là **Trần Hà Minh**, sinh viên năm 4 Đại học FPT, ứng tuyển Fresher (mục tiêu: thực tập fullstack).
  Tài khoản đã có sẵn **4 buổi luyện mẫu** trong tuần qua (3 buổi ở PixelStart, 1 buổi Fresher ở NovaTech), nên trang Tổng quan, Lịch sử có biểu đồ ngay.
  NovaTech đã mở, GlobalCore còn khóa, để thấy được cơ chế mở khóa.
- Muốn mở khóa toàn bộ doanh nghiệp và chủ đề khi thuyết trình: **Hồ sơ & cài đặt** → bật **Chế độ trình bày**.
- Nút mặt trời / mặt trăng ở góc trên bên phải dùng để đổi **giao diện sáng / tối**.

## 4. Chạy trên điện thoại

Giao diện tự co lại cho màn hình điện thoại. Cách mở:

1. Máy tính và điện thoại **cùng một mạng Wi-Fi**.
2. Trên máy tính, chạy app bằng lệnh này (thay cho `npm run dev`):

   ```bash
   npm run dev -- --host
   ```

3. Terminal sẽ hiện thêm một dòng dạng `Network: http://192.168.1.15:5173`.
   Trên điện thoại, mở **đúng địa chỉ đó** bằng Chrome.
4. Nếu điện thoại không vào được: cho phép Node.js qua tường lửa Windows (Windows thường hỏi ở lần chạy đầu, chọn **Allow**).

**Lưu ý về micro trên điện thoại:** trình duyệt chỉ cho dùng micro trên trang `https://` hoặc `localhost`.
Khi mở bằng địa chỉ `http://192.168...`, mọi thứ đều chạy (gõ phím, đọc câu hỏi, chấm điểm, AI thật) **trừ micro**.
Muốn dùng micro trên điện thoại Android:

- Mở Chrome trên điện thoại, vào `chrome://flags`.
- Tìm **Insecure origins treated as secure**, điền địa chỉ `http://192.168.x.x:5173` của máy tính, chọn **Enabled**, bấm **Relaunch**.

Trên iPhone, nhận diện giọng nói của Safari chạy không ổn định bằng Chrome trên Android; nên trả lời bằng cách gõ.

Tài khoản và tiến độ lưu riêng trên từng máy, nên trên điện thoại cứ bấm **Xem bản demo** là có tài khoản mẫu.

## 5. Hai chế độ chấm: Demo và AI thật

| | Chế độ demo | AI thật |
|---|---|---|
| Khi nào dùng | Mặc định khi chưa có API key. Hợp để trình chiếu vì không phụ thuộc mạng. | Khi muốn trải nghiệm đầy đủ. |
| Người phỏng vấn | Đi theo kịch bản soạn sẵn, hỏi đào sâu theo quy tắc. | AI đóng vai, hỏi đào sâu dựa trên chính câu bạn vừa trả lời. |
| Chấm điểm | Theo quy tắc: từ khóa, độ dài, cấu trúc câu. | AI chấm và nhận xét chi tiết. |
| Câu trả lời mẫu | Câu mẫu soạn sẵn. | AI viết lại dựa trên kinh nghiệm bạn đã kể. |
| Cần gì | Không cần gì. | API key (OpenAI hoặc Google Gemini) và mạng Internet. |

Thanh trên cùng của app cho biết đang ở chế độ nào: **Chế độ demo** hoặc **AI sẵn sàng**.
Nếu AI lỗi giữa buổi, app cho nút **Chuyển sang chế độ demo** để làm tiếp.

### Bật AI thật

1. Trong thư mục `code`, sao chép file `.env.example` thành file mới tên `.env`.
2. Mở `.env`, điền API key vào dòng `AI_API_KEY=`:
   - **OpenAI:** lấy key tại platform.openai.com. Giữ nguyên `AI_BASE_URL` và `AI_MODEL=gpt-4o-mini`.
   - **Google Gemini** (có gói miễn phí): lấy key tại aistudio.google.com, bỏ dấu `#` ở 3 dòng "Cách 2"
     và thêm dấu `#` vào 3 dòng "Cách 1". Nếu báo lỗi tên model, kiểm tra tên model đang được hỗ trợ trên trang của Google.
3. Tắt app (`Ctrl + C`) rồi chạy lại `npm run dev`. App chỉ đọc file `.env` lúc khởi động.

API key chỉ nằm ở máy chủ của Vite (xem `vite.config.js`), trình duyệt chỉ gọi `/api/chat` nên **không nhìn thấy key**.
Khi đưa lên mạng, việc này do `functions/api/chat.js` chạy trên Cloudflare đảm nhận (xem mục 13).
**Tuyệt đối không** đưa file `.env` lên GitHub hay gửi cho người khác (file này đã nằm trong `.gitignore`).

## 6. Giọng nói và ngôn ngữ phỏng vấn

Giọng nói dùng **Web Speech API** có sẵn trong trình duyệt: miễn phí, không cần API key, không cài thêm gì.

- **Đọc câu hỏi (Text-to-Speech):** người phỏng vấn tự đọc câu hỏi thành tiếng (bật/tắt ở bước Thiết lập).
  Có nút **Nghe lại** để nghe câu hỏi lần nữa, và nút **Nghe mẫu** ở câu trả lời mẫu. Đồng hồ tạm dừng trong lúc đang đọc.
- **Trả lời bằng micro (Speech-to-Text):** bấm **Nói câu trả lời**, chữ hiện dần vào ô nhập; có thể sửa trước khi gửi.
  Cần Chrome hoặc Edge, cần mạng Internet, và cho phép trình duyệt dùng micro ở lần đầu.
- **Ngôn ngữ:** mặc định phỏng vấn bằng **tiếng Anh** (câu hỏi, câu đào sâu, câu mẫu, giọng đọc en-US) vì nhiều doanh nghiệp, nhất là công ty nước ngoài,
  phỏng vấn một phần bằng tiếng Anh. Phần **nhận xét luôn bằng tiếng Việt**. Có thể đổi sang tiếng Việt ở bước Thiết lập
  hoặc đặt mặc định trong **Hồ sơ & cài đặt**.

## 7. Các trang trong app

| Trang | Địa chỉ | Có gì |
|---|---|---|
| Trang chủ | `#/` | Giới thiệu, tính năng, cách hoạt động, dành cho nhà trường, bảng giá, hỏi đáp |
| Đăng nhập / Đăng ký | `#/login`, `#/register` | Tài khoản sinh viên hoặc nhà trường, nút vào nhanh tài khoản demo |
| Tạo hồ sơ | `#/onboarding` | 3 bước: trường & chuyên ngành → mục tiêu & ngày phỏng vấn → tùy chọn luyện tập |
| Tổng quan | `#/dashboard` | Điểm, chuỗi ngày luyện, buổi luyện được gợi ý, biểu đồ điểm, biểu đồ 3 tiêu chí, lộ trình doanh nghiệp, đếm ngược ngày phỏng vấn |
| Luyện phỏng vấn | `#/practice` | Ngành → doanh nghiệp → thiết lập → học trước → phỏng vấn → kết quả |
| Lịch sử & tiến bộ | `#/history` | Biểu đồ điểm, so sánh lần đầu với lần gần nhất, lọc theo doanh nghiệp/chủ đề, xuất CSV |
| Xem lại một buổi | `#/history/<mã buổi>` | Toàn bộ kết quả chi tiết của buổi đó |
| Thư viện | `#/library` | Bài học, ngân hàng câu hỏi (có dàn ý và câu mẫu nghe được), 3 người phỏng vấn, mẹo hỏi lại nhà tuyển dụng |
| Huy hiệu | `#/achievements` | Cấp độ hiện tại và 13 huy hiệu |
| Hồ sơ & cài đặt | `#/profile` | Sửa hồ sơ, tùy chọn mặc định, giao diện sáng/tối, chế độ trình bày, tải dữ liệu, xóa tiến độ, xóa tài khoản |
| Nhà trường | `#/school` | Tổng quan: sinh viên đã kích hoạt, số buổi theo tuần, điểm theo tiêu chí, sinh viên cần hỗ trợ |
| | `#/school/students` | Danh sách sinh viên, tìm kiếm, lọc theo lớp, xuất CSV |
| | `#/school/classes` | Các lớp và mã mời lớp, tạo lớp mới |
| | `#/school/pilot` | Chỉ số thử nghiệm MVP (H1–H3) so với mục tiêu |

**Lưu ý trang Nhà trường:** các tab Tổng quan, Sinh viên, Lớp dùng **dữ liệu mẫu** (có ghi nhãn "Dữ liệu mẫu").
Riêng tab **Chỉ số thử nghiệm** tính từ **dữ liệu thật** của các tài khoản sinh viên trên trình duyệt đó
(tỷ lệ hoàn thành, tỷ lệ quay lại, mức tăng điểm, kết quả khảo sát sau buổi), không tính các buổi mẫu.

## 8. Một buổi luyện diễn ra thế nào

1. **Chọn ngành và doanh nghiệp:** mỗi ngành có 3 doanh nghiệp mô phỏng, từ dễ đến khó:

   | Ngành | Cơ bản (mở sẵn) | Trung bình (60 điểm) | Nâng cao (150 điểm) |
   |---|---|---|---|
   | Công nghệ thông tin | PixelStart – startup | NovaTech – gia công phần mềm | GlobalCore – công ty sản phẩm |
   | Marketing | Bloom Agency – agency truyền thông | Lumina Brands – thương hiệu hàng tiêu dùng | Orbit Commerce – sàn thương mại điện tử |
   | Tài chính – Kế toán | PayNest – startup fintech | Vertex Bank – ngân hàng thương mại | Crest Advisory – kiểm toán, tư vấn |
   | Kinh doanh | FreshWay Mart – chuỗi bán lẻ | Sunrise Distribution – phân phối hàng tiêu dùng | CloudPeak Software – phần mềm B2B |

2. **Thiết lập:** vị trí (Intern/Fresher), chủ đề, người phỏng vấn, ngôn ngữ, giới hạn thời gian, đọc câu hỏi, chế độ chấm.
3. **Học trước (khoảng 3 phút, không bắt buộc):** phương pháp STAR, khung trả lời câu hỏi chuyên môn và khung xử lý tình huống khó của từng ngành. Lần đầu được +5 điểm.
4. **Phỏng vấn:** màn hình giống cuộc gọi video. Bên phải có trình tự buổi phỏng vấn, gợi ý khung trả lời và bản ghi hội thoại.
   Gửi câu trả lời bằng nút **Gửi câu trả lời** hoặc `Ctrl + Enter`.
5. **Kết quả:** điểm trung bình, biểu đồ 3 tiêu chí, so sánh với lần trước, từng câu hỏi được chấm riêng, khảo sát nhanh 2 câu.

### Người phỏng vấn

| Người phỏng vấn | Phong cách | Thời gian mỗi câu |
|---|---|---|
| Chị Lan – HR thân thiện | Nói chậm, gợi ý, hỗ trợ | 90 giây |
| Chuyên gia của ngành: Anh Tuấn (Tech Lead, IT), Chị Mai (Trưởng phòng Marketing), Anh Quân (Trưởng nhóm phân tích tài chính), Anh Hùng (Giám đốc kinh doanh khu vực) | Hỏi sâu về chuyên môn, đòi ví dụ cụ thể | 75 giây |
| Chị Hương – Quản lý bận rộn | Muốn trả lời ngắn gọn, đúng trọng tâm | 45 giây |

### Trình tự câu hỏi (giống một buổi phỏng vấn thật)

| Chủ đề | Thứ tự câu hỏi |
|---|---|
| 1. Khởi động & hành vi (HR) | Giới thiệu bản thân → 1 câu kinh nghiệm (dự án / mâu thuẫn nhóm / điểm mạnh-yếu) → Vì sao chọn công ty |
| 2. Chuyên môn (luôn do chuyên gia của ngành) | Kinh nghiệm gần nhất → 1 câu kiến thức chuyên môn → 1 tình huống thực tế (xem bảng dưới) |
| 3. Tổng hợp (Quản lý) | Giới thiệu ngắn → Một câu kinh nghiệm thực tế → Tình huống thay đổi đột ngột |

Câu hỏi chủ đề 2 theo từng ngành:

| Ngành | Kinh nghiệm | Kiến thức (chọn 1) | Tình huống (chọn 1) |
|---|---|---|---|
| IT | Công nghệ trong dự án gần nhất | REST và GraphQL / OOP | Lỗi 500 trước buổi demo / Bất đồng thiết kế database |
| Marketing | Chiến dịch đã tham gia | Brand awareness và performance / Chỉ số đo quảng cáo Facebook | Khủng hoảng truyền thông / Ngân sách bị cắt 30% |
| Tài chính – Kế toán | Bài phân tích đã làm | Lợi nhuận và dòng tiền / Ba báo cáo tài chính | Số liệu lệch 50 triệu / Báo cáo gấp thiếu số liệu |
| Kinh doanh | Một lần thuyết phục thành công | Quy trình bán hàng / Tỷ lệ chuyển đổi và CLV | Khách lớn dọa hủy hợp đồng / Mới đạt 60% chỉ tiêu |

- Mỗi bước chọn ngẫu nhiên một câu cùng loại, nên luyện lại không bị trùng y hệt nhưng thứ tự luôn hợp lý.
- Nếu câu trả lời quá ngắn, mơ hồ hoặc thiếu kết quả, người phỏng vấn hỏi thêm **một câu đào sâu**.
- Hết giờ thì phần đang viết (hoặc đang nói) được tự gửi.
- Cuối buổi người phỏng vấn hỏi **"Do you have any questions for me?"**: không tính điểm, nhưng có góp ý riêng.

### Cách chấm

Mỗi câu hỏi được chấm theo thang 10 với 3 tiêu chí:

| Tiêu chí | Ý nghĩa |
|---|---|
| **Relevance** | Trả lời đúng trọng tâm câu hỏi |
| **Clarity** | Diễn đạt rõ ràng, độ dài hợp lý, ít từ đệm |
| **Structure** | Có cấu trúc: STAR với câu hành vi; định nghĩa → ví dụ → so sánh với câu kiến thức; xác nhận, khoanh vùng → nguyên nhân → giải pháp → báo cáo với câu xử lý sự cố hoặc tình huống khó |

Ngoài điểm, mỗi câu còn có:

- **Lỗi theo từng câu:** câu có vấn đề được **tô đỏ và đánh số** ngay trong câu trả lời, kèm "Vấn đề" và "Nên sửa"
  (từ đệm, nói chung chung không có số liệu, chỉ nói "nhóm em" mà không nói vai trò bản thân, câu quá dài, thiếu tự tin, từ ngữ suồng sã...).
- **Điểm mạnh** và **cần cải thiện**.
- **Câu trả lời mẫu tối ưu** (có nút Nghe mẫu) và **dàn ý gợi ý**.

## 9. Điểm rèn luyện, mở khóa, cấp độ, huy hiệu

**Cách nhận điểm rèn luyện:**

| Việc | Điểm |
|---|---|
| Hoàn thành bài học trước phỏng vấn | +5 (mỗi chủ đề một lần) |
| Hoàn thành một buổi phỏng vấn | Điểm trung bình × 3, làm tròn (tối đa 30) |
| Bật giới hạn thời gian trong buổi đó | +5 thưởng |

**Mở khóa:**

- Ở mỗi ngành: doanh nghiệp cấp Cơ bản mở sẵn · cấp Trung bình cần **60** điểm · cấp Nâng cao cần **150** điểm (điểm rèn luyện dùng chung cho mọi ngành).
- Trong mỗi doanh nghiệp: chủ đề 2 mở khi xong chủ đề 1, chủ đề 3 mở khi xong chủ đề 2.

**Cấp độ:** Tân binh (0) → Ứng viên tiềm năng (60) → Ứng viên vững vàng (150) → Sẵn sàng đi làm (300).

**Huy hiệu (13 cái):** buổi đầu tiên, học trước, học đủ 3 bài, phỏng vấn bằng tiếng Anh, trả lời bằng micro,
bật giới hạn thời gian, đạt 8.0 trở lên, tăng 1 điểm so với lần đầu, 5 buổi, chuỗi 3 ngày liên tiếp,
mở doanh nghiệp cấp Trung bình, mở doanh nghiệp cấp Nâng cao, hoàn thành cả 3 chủ đề ở một doanh nghiệp.

## 10. Dữ liệu được lưu ở đâu

- Tài khoản, hồ sơ, tiến độ, lịch sử được lưu trong **localStorage của trình duyệt**, riêng cho từng tài khoản.
  Không gửi lên máy chủ nào của PalSpeak.
- Mỗi máy, mỗi trình duyệt là một kho riêng: tiến độ trên máy A không có trên máy B.
- Xóa dữ liệu duyệt web (cookie, dữ liệu trang) sẽ **mất luôn tài khoản**. Có thể tải bản sao về ở **Hồ sơ & cài đặt → Tải dữ liệu của tôi**.
- Lịch sử giữ **50 buổi** gần nhất.
- Mật khẩu chỉ được băm đơn giản để mô phỏng; đây **không phải** cơ chế bảo mật của bản thật.
- Khi trả lời bằng micro, Chrome/Edge gửi âm thanh lên máy chủ nhận diện giọng nói của Google/Microsoft; PalSpeak chỉ lưu phần chữ.
- Ở chế độ AI thật, nội dung câu hỏi và câu trả lời (dạng chữ) được gửi tới OpenAI hoặc Google Gemini để chấm.

## 11. Xử lý lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `npm` hoặc `node` không phải là lệnh | Chưa cài Node.js, hoặc cài xong chưa mở lại VS Code. Cài Node.js rồi tắt hẳn VS Code, mở lại. |
| `npm install` báo lỗi | Kiểm tra mạng; xóa thư mục `node_modules` rồi chạy lại `npm install`. |
| Trang trắng, không hiện gì | Chạy `git pull` để lấy code mới nhất (lỗi trang trắng trên Chrome bản mới đã được sửa). Nếu vẫn trắng, bấm `F12` → tab **Console**, chụp màn hình lỗi màu đỏ gửi nhóm. |
| Địa chỉ không phải `5173` | Cổng 5173 đang bị chiếm (thường do đang chạy app ở một Terminal khác). Dùng địa chỉ Terminal hiện ra, hoặc tắt Terminal cũ. |
| Nút micro bị mờ | Đang dùng trình duyệt không hỗ trợ (Firefox, Safari...). Mở bằng Chrome hoặc Edge. |
| Bấm micro báo chưa được cấp quyền | Bấm biểu tượng ổ khóa cạnh thanh địa chỉ → cho phép **Micro** → tải lại trang. |
| Micro báo "không nghe thấy giọng nói" | Kiểm tra micro/tai nghe, nói to và gần hơn; nhận diện giọng nói cần mạng Internet. |
| Không nghe thấy câu hỏi được đọc | Kiểm tra loa, bật lại **Đọc câu hỏi thành tiếng** ở bước Thiết lập; máy cần có giọng đọc tiếng Anh/tiếng Việt. |
| Điện thoại không mở được app | Phải chạy `npm run dev -- --host`, hai máy cùng Wi-Fi, cho phép Node.js qua tường lửa (mục 4). |
| Chế độ AI báo lỗi | Kiểm tra API key trong `.env`, đã chạy lại `npm run dev` chưa, mạng có ổn không. Bấm **Chuyển sang chế độ demo** để làm tiếp. |
| Không thấy chữ **AI sẵn sàng** dù đã có `.env` | File phải tên đúng `.env` (không phải `.env.txt`), nằm trong thư mục `code`, và đã khởi động lại app. |
| Muốn làm lại từ đầu | **Hồ sơ & cài đặt → Xóa toàn bộ tiến độ**, hoặc **Xóa tài khoản**. |

## 12. Cấu trúc thư mục

```
code/
├── index.html
├── package.json
├── vite.config.js             # Cấu hình Vite + proxy gọi AI (giấu API key)
├── .env.example               # Mẫu cấu hình AI (sao chép thành .env)
├── functions/
│   └── api/chat.js            # Hàm chạy trên Cloudflare: nhận /api/chat, gọi AI bằng key giữ ở máy chủ
└── src/
    ├── main.jsx               # Điểm khởi động React
    ├── App.jsx                # Định tuyến các trang, chặn trang cần đăng nhập
    ├── router.jsx             # Điều hướng bằng dấu # (không cần thư viện)
    ├── styles.css             # Toàn bộ giao diện; biến màu ở đầu file
    ├── context/
    │   └── AppContext.jsx     # Tài khoản, tiến độ, giao diện sáng/tối, thông báo
    ├── services/              # TẦNG GIẢ LẬP MÁY CHỦ – sau này thay bằng gọi API
    │   ├── auth.js            # Đăng ký, đăng nhập, tài khoản demo
    │   ├── demoSeed.js        # 4 buổi luyện mẫu cho tài khoản sinh viên demo
    │   ├── schoolData.js      # Dữ liệu mẫu nhà trường + chỉ số thử nghiệm
    │   └── storage.js         # Đọc/ghi localStorage
    ├── data/
    │   └── content.js         # Ngành, doanh nghiệp, người phỏng vấn, bài học, câu hỏi, câu mẫu
    ├── lib/
    │   ├── mockEngine.js      # Chế độ demo: kịch bản phỏng vấn, chấm theo quy tắc, bắt lỗi từng câu
    │   ├── aiEngine.js        # Chế độ AI: người phỏng vấn AI + chấm điểm bằng AI
    │   ├── speech.js          # Đọc thành tiếng và nói thành chữ (Web Speech API)
    │   ├── progress.js        # Điểm rèn luyện, mở khóa, lịch sử, cấp độ, thống kê
    │   ├── achievements.js    # 13 huy hiệu
    │   └── format.js          # Định dạng ngày giờ, xuất CSV
    ├── components/            # Thành phần dùng chung
    │   ├── Layout.jsx         # Khung trang: thanh bên, thanh trên, đầu/cuối trang chủ
    │   ├── Charts.jsx         # Biểu đồ SVG: vòng điểm, radar, đường, cột
    │   ├── Mascot.jsx         # Linh vật Pal chuyển động, thẻ bay, hạt lấp lánh
    │   ├── Feedback.jsx       # Thông báo nổi, hộp xác nhận, trạng thái trống
    │   ├── Brand.jsx          # Logo, ảnh đại diện chữ cái
    │   ├── Icons.jsx          # Bộ biểu tượng
    │   ├── ScoreBar.jsx       # Thanh điểm từng tiêu chí
    │   └── Stepper.jsx        # Thanh các bước luyện tập
    ├── pages/                 # Mỗi file là một trang (xem mục 7)
    └── screens/               # Các bước trong luồng luyện phỏng vấn (xem mục 8)
```

## 13. Sửa nội dung và phát triển tiếp

**Sửa nội dung (không cần biết nhiều code):** mọi nội dung nằm trong `src/data/content.js`.

| Muốn | Sửa ở đâu trong `content.js` |
|---|---|
| Thêm ngành mới | `CAREERS` (kèm người phỏng vấn chuyên môn `specialist`), thêm 3 doanh nghiệp vào `COMPANIES` với `career`, câu hỏi và bài học chủ đề 2 cho ngành đó |
| Thêm / sửa câu hỏi | `QUESTIONS` (mỗi câu có bản `vi`, `en`, từ khóa `kw` để chấm, dàn ý `outline`, `career` nếu là câu riêng của một ngành) |
| Thêm / sửa câu trả lời mẫu | `MODEL_ANSWERS` (cùng mã với câu hỏi); câu hành vi theo từng ngành nằm ở `BEHAVIOR_BY_CAREER` |
| Đổi trình tự câu hỏi trong một chủ đề | `stages` trong `TOPICS` (`ids` có thể chia theo ngành: `{ it: [...], marketing: [...] }`) |
| Thêm tình huống thay đổi | `SITUATION_CHANGES` |
| Sửa bài học | `LESSONS` (chủ đề 2 có bài riêng cho từng ngành) |
| Sửa doanh nghiệp, điểm mở khóa | `COMPANIES` |
| Sửa người phỏng vấn, thời gian mỗi câu | `PERSONAS` |

**Đổi màu giao diện:** sửa biến `--brand` (tím), `--accent` (cam) và các biến khác ở đầu `src/styles.css`.

**Khi làm bản hoàn chỉnh có máy chủ:**

- Thay các hàm trong `src/services/` (đang đọc/ghi localStorage) bằng lời gọi API. Các hàm đã trả về Promise nên giao diện gần như không phải sửa.
- `loadProgress` / `saveProgress` trong `src/lib/progress.js` cũng chuyển sang API.
- Xác thực và băm mật khẩu phải làm ở máy chủ (bản này chỉ mô phỏng).
- `services/schoolData.js` đang sinh dữ liệu mẫu; bản thật lấy sinh viên theo mã lớp từ máy chủ.
- Khi cần database thật, dùng **Cloudflare D1** (cùng nền tảng với hosting) để toàn bộ web vẫn nằm một chỗ.

**Đưa lên mạng bằng Cloudflare Pages (một nơi cho cả web, gói miễn phí):**

Giao diện chạy trên Cloudflare Pages, còn `/api/chat` do `functions/api/chat.js` xử lý ngay trên Cloudflare, nên không cần thuê máy chủ riêng.
Chi phí hosting 0 VND theo gói miễn phí, chỉ tốn tiền tên miền nếu muốn dùng tên riêng (không bắt buộc, Cloudflare cấp sẵn địa chỉ `ten-du-an.pages.dev`).
Hàm `/api/chat` tính vào hạn mức miễn phí của Cloudflare Workers (khoảng 100.000 lượt mỗi ngày lúc viết; nên kiểm tra lại trên trang của Cloudflare).

1. Đưa code lên GitHub (đã có repo của nhóm).
2. Vào dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, chọn repo PalSpeak.
3. Cài đặt build: Framework preset **Vite** (hoặc None), Build command `npm run build`, Build output directory `dist`.
4. Mục **Settings → Variables and Secrets**, thêm:
   - `AI_API_KEY`: API key (chọn loại **Secret**);
   - `AI_BASE_URL`, `AI_MODEL`: giống trong `.env.example`;
   - `AI_ENABLED` = `true` (để giao diện bật chế độ AI ngay cả khi lúc build không đọc được Secret).
5. Bấm **Save and Deploy**. Mỗi lần push lên GitHub, Cloudflare tự build và cập nhật web.

Không đặt các biến AI thì web vẫn chạy bình thường ở **chế độ demo**.

**Chạy thử bản build trên máy (tùy chọn):**

```bash
npm run build
npm run preview
```

`npm run preview` chỉ có giao diện tĩnh, không có `/api/chat`, nên chỉ chạy **chế độ demo**.

## 14. Phạm vi MVP

**Có trong bản này:** 4 ngành (IT, Marketing, Tài chính – Kế toán, Kinh doanh) · Intern, Fresher · 12 doanh nghiệp mô phỏng · 3 chủ đề · 3 vai nhà tuyển dụng mỗi ngành ·
phỏng vấn bằng văn bản hoặc giọng nói · câu hỏi đào sâu, giới hạn thời gian, tình huống thay đổi ·
phản hồi 3 tiêu chí, chỉ rõ lỗi từng câu, câu trả lời mẫu tối ưu · điểm rèn luyện, cấp độ, huy hiệu, mở khóa ·
lịch sử và biểu đồ tiến bộ · tài khoản mô phỏng · bảng điều khiển nhà trường bản xem trước · khảo sát sau buổi.

**Để sau MVP:** đánh giá phát âm và ngữ điệu · thêm ngành (Nhân sự, Logistics, Du lịch – Khách sạn...) · cấp Junior/Senior ·
máy chủ và đăng nhập thật (Cloudflare D1) · dữ liệu nhà trường thật · bảng xếp hạng.

---

*Điểm số do PalSpeak đưa ra chỉ phục vụ mục đích học tập, không phải đánh giá chính thức về năng lực tuyển dụng.
Tên doanh nghiệp trong bài luyện là doanh nghiệp mô phỏng.*
