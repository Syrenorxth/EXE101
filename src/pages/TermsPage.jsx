import { PublicHeader, PublicFooter } from '../components/Layout.jsx'

const SECTIONS = [
  ['Mục đích sử dụng', 'PalSpeak là công cụ luyện tập. Điểm số và nhận xét chỉ giúp người học biết cần cải thiện phần nào, không phải đánh giá chính thức về năng lực tuyển dụng. Tên doanh nghiệp trong bài luyện là doanh nghiệp mô phỏng.'],
  ['Dữ liệu tài khoản', 'Ở bản thử nghiệm, tài khoản, hồ sơ và tiến độ luyện tập được lưu ngay trên trình duyệt của bạn (localStorage), không gửi lên máy chủ của PalSpeak. Xóa dữ liệu trình duyệt sẽ xóa luôn tài khoản. Bạn có thể tải hoặc xóa dữ liệu trong Hồ sơ & cài đặt.'],
  ['Giọng nói', 'Đọc câu hỏi và nhận diện giọng nói dùng Web Speech API có sẵn trong trình duyệt. Khi trả lời bằng micro, trình duyệt (Chrome, Edge) có thể gửi âm thanh lên máy chủ nhận diện của nhà cung cấp trình duyệt. PalSpeak không lưu bản ghi âm, chỉ lưu phần chữ đã nhận diện.'],
  ['Chế độ AI', 'Khi bật AI thật, nội dung câu hỏi và câu trả lời dạng chữ được gửi tới nhà cung cấp mô hình ngôn ngữ (OpenAI hoặc Google Gemini) để đóng vai người phỏng vấn và chấm điểm. Không nhập thông tin cá nhân nhạy cảm vào câu trả lời.'],
  ['Nhà trường', 'Khi bạn nhập mã lớp, nhà trường chỉ xem được số liệu tổng hợp: số buổi luyện, điểm theo tiêu chí, chủ đề đã hoàn thành. Nhà trường không xem được nội dung câu trả lời của bạn.']
]

export default function TermsPage() {
  return (
    <div className="landing">
      <PublicHeader />
      <section className="hero slim">
        <div className="hero-bg" aria-hidden="true" />
        <div className="public-inner">
          <h1>Điều khoản & quyền riêng tư</h1>
          <p>Bản thử nghiệm MVP · cập nhật tháng 10/2026</p>
        </div>
      </section>
      <section className="band">
        <div className="public-inner prose">
          {SECTIONS.map(([h, p], i) => (
            <div key={h}>
              <h2>{i + 1}. {h}</h2>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}
