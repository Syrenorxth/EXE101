import { useState } from 'react'
import { PublicHeader, PublicFooter } from '../components/Layout.jsx'
import { Avatar } from '../components/Brand.jsx'
import { ScoreRing, RadarChart } from '../components/Charts.jsx'
import Icon from '../components/Icons.jsx'
import { Link, navigate } from '../router.jsx'
import { useApp } from '../context/AppContext.jsx'
import { COMPANIES, PERSONAS } from '../data/content.js'

const PAINS = [
  ['Đứng hình khi bị hỏi dồn', 'Người phỏng vấn hỏi đào sâu ngay khi câu trả lời còn mơ hồ, giống hệt vòng phỏng vấn thật.'],
  ['Không biết kể về dự án ở trường', 'Bài học STAR và khung trả lời kỹ thuật ngắn gọn trước mỗi chủ đề.'],
  ['Nhận xét chung chung, không biết sửa gì', 'Chỉ đúng câu nào bị lỗi, vì sao, và nên nói lại thế nào, kèm câu trả lời mẫu.']
]

const FEATURES = [
  ['building', 'Doanh nghiệp mô phỏng', 'Startup, công ty gia công phần mềm, công ty sản phẩm: mỗi nơi một quy trình và một mức độ khó.'],
  ['users', '3 vai người phỏng vấn', 'HR thân thiện, Tech Lead yêu cầu cao, Quản lý bận rộn. Cùng câu hỏi, ba phong cách hỏi khác nhau.'],
  ['mic', 'Nói như phỏng vấn thật', 'Câu hỏi được đọc thành tiếng, bạn trả lời bằng micro. Chạy ngay trên trình duyệt, không cần cài thêm.'],
  ['clock', 'Thử thách sát thực tế', 'Câu hỏi đào sâu, đồng hồ 45–90 giây mỗi câu, tình huống thay đổi đột ngột ở chủ đề tổng hợp.'],
  ['target', 'Chấm 3 tiêu chí', 'Relevance, Clarity, Structure cho từng câu, theo khung STAR hoặc định nghĩa → ví dụ → so sánh.'],
  ['sparkles', 'Câu trả lời mẫu tối ưu', 'Viết lại dựa trên chính kinh nghiệm bạn kể, có nút nghe mẫu để luyện theo.']
]

const STEPS = [
  ['Chọn doanh nghiệp', 'Bắt đầu từ PixelStart, tích điểm để mở NovaTech và GlobalCore.'],
  ['Học nhanh 3 phút', 'Phương pháp STAR, khung xử lý sự cố, từ vựng cần dùng.'],
  ['Phỏng vấn mô phỏng', 'Bằng tiếng Anh hoặc tiếng Việt, gõ phím hoặc nói qua micro.'],
  ['Nhận phản hồi chi tiết', 'Điểm, lỗi từng câu, câu mẫu. Luyện lại và theo dõi tiến bộ.']
]

const FAQ = [
  ['PalSpeak có mất phí không?', 'Sinh viên dùng miễn phí ở bản thử nghiệm. Khi nhà trường đăng ký, toàn bộ sinh viên của trường được dùng đầy đủ tính năng.'],
  ['Tôi cần cài thêm phần mềm gì?', 'Không. PalSpeak chạy trên trình duyệt. Để trả lời bằng micro, hãy dùng Chrome hoặc Edge.'],
  ['Phỏng vấn bằng tiếng Anh hay tiếng Việt?', 'Mặc định là tiếng Anh vì nhiều công ty IT phỏng vấn một phần bằng tiếng Anh. Bạn có thể đổi sang tiếng Việt; phần nhận xét luôn bằng tiếng Việt.'],
  ['Điểm số có phải đánh giá chính thức không?', 'Không. Điểm chỉ giúp bạn biết cần luyện thêm phần nào, không thay thế đánh giá của nhà tuyển dụng.'],
  ['Dữ liệu của tôi được lưu ở đâu?', 'Ở bản thử nghiệm, tài khoản và tiến độ được lưu ngay trên trình duyệt của bạn. Giọng nói do trình duyệt xử lý, PalSpeak không lưu bản ghi âm.'],
  ['Nhà trường xem được những gì?', 'Số liệu tổng hợp theo lớp: số buổi luyện, điểm trung bình theo tiêu chí, sinh viên cần hỗ trợ. Nhà trường không xem được nội dung câu trả lời.']
]

function HeroMockup() {
  const p = PERSONAS.techlead
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-call">
        <div className="mock-top">
          <span className="live-dot" /> NovaTech · Phỏng vấn kỹ thuật
          <span className="mock-timer">0:52</span>
        </div>
        <div className="mock-stage">
          <div className="stage-avatar speaking">
            <span className="pulse p1" />
            <span className="pulse p2" />
            <Avatar name={p.name} size={76} />
          </div>
          <strong>{p.name}</strong>
          <small>{p.role}</small>
          <div className="wave on"><span /><span /><span /><span /><span /></div>
        </div>
        <div className="mock-question">
          “Explain the difference between REST API and GraphQL.”
        </div>
        <div className="mock-answer">
          <Icon name="mic" size={16} />
          <span>REST organizes the API around resources, while GraphQL…</span>
        </div>
      </div>
      <div className="mock-float f1">
        <span className="float-label">Structure</span>
        <strong>8.0</strong>
      </div>
      <div className="mock-float f2">
        <Icon name="award" size={16} /> Huy hiệu mới: Dám nói
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { user, loginDemo, toast } = useApp()
  const [busy, setBusy] = useState(false)

  const tryDemo = async (role) => {
    if (user) {
      navigate(user.role === 'school' ? '/school' : '/dashboard')
      return
    }
    setBusy(true)
    const u = await loginDemo(role)
    toast(`Đã vào tài khoản demo: ${u.name}`, 'success')
    navigate(role === 'school' ? '/school' : '/dashboard')
  }

  return (
    <div className="landing">
      <PublicHeader />

      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="public-inner hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow"><Icon name="sparkles" size={14} /> Luyện phỏng vấn Intern & Fresher ngành IT</span>
            <h1>Tập phỏng vấn với AI <em>trước khi</em> gặp nhà tuyển dụng thật</h1>
            <p>
              Phỏng vấn mô phỏng theo đúng trình tự tại doanh nghiệp IT Việt Nam, nói bằng giọng thật,
              nhận phản hồi chỉ rõ từng câu cần sửa. Mỗi buổi chỉ 10–15 phút.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-accent big">Bắt đầu miễn phí <Icon name="arrowRight" /></Link>
              <button className="btn btn-on-dark big" onClick={() => tryDemo('student')} disabled={busy}>
                <Icon name="play" size={16} /> Xem bản demo
              </button>
            </div>
            <ul className="hero-points">
              <li><Icon name="check" size={16} /> Không cần cài đặt</li>
              <li><Icon name="check" size={16} /> Phỏng vấn bằng tiếng Anh</li>
              <li><Icon name="check" size={16} /> Nhận xét bằng tiếng Việt</li>
            </ul>
          </div>
          <HeroMockup />
        </div>
        <div className="public-inner logos">
          <span>Mô phỏng quy trình tuyển dụng của</span>
          {COMPANIES.map((c) => (
            <span key={c.id} className="logo-word">
              <Icon name="building" size={16} /> {c.name}
              <small>{c.kind}</small>
            </span>
          ))}
        </div>
      </section>

      <section className="band" id="problems">
        <div className="public-inner">
          <div className="section-head">
            <span className="kicker">Vì sao sinh viên trượt phỏng vấn đầu tiên</span>
            <h2>Biết kiến thức chưa đủ, phải nói ra được</h2>
          </div>
          <div className="grid grid-3">
            {PAINS.map(([pain, fix], i) => (
              <article key={pain} className="pain card">
                <span className="pain-num">0{i + 1}</span>
                <h3>{pain}</h3>
                <p><Icon name="arrowRight" size={16} /> {fix}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band alt" id="features">
        <div className="public-inner">
          <div className="section-head">
            <span className="kicker">Tính năng</span>
            <h2>Một buổi phỏng vấn thật, thu nhỏ lại để luyện mỗi ngày</h2>
          </div>
          <div className="grid grid-3">
            {FEATURES.map(([icon, title, desc]) => (
              <article key={title} className="feature card">
                <span className="feature-icon"><Icon name={icon} size={22} /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band" id="how">
        <div className="public-inner">
          <div className="section-head">
            <span className="kicker">Cách hoạt động</span>
            <h2>Bốn bước, lặp lại đến khi tự tin</h2>
          </div>
          <ol className="how">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <span className="how-num">{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band alt">
        <div className="public-inner preview">
          <div className="preview-copy">
            <span className="kicker">Phản hồi sau mỗi buổi</span>
            <h2>Biết chính xác câu nào cần sửa, sửa thế nào</h2>
            <p>Mỗi câu trả lời được chấm theo ba tiêu chí. Câu có lỗi được tô màu và đánh số ngay trong câu trả lời của bạn, kèm gợi ý viết lại.</p>
            <ul className="ticks">
              <li><Icon name="check" size={16} /> Relevance: trả lời đúng trọng tâm câu hỏi</li>
              <li><Icon name="check" size={16} /> Clarity: rõ ràng, độ dài hợp lý</li>
              <li><Icon name="check" size={16} /> Structure: có khung STAR hoặc khung kỹ thuật</li>
            </ul>
          </div>
          <div className="preview-card card">
            <div className="preview-top">
              <ScoreRing value={6.8} size={112} />
              <RadarChart size={200} data={[{ label: 'Relevance', value: 7.5 }, { label: 'Clarity', value: 7 }, { label: 'Structure', value: 6 }]} />
            </div>
            <p className="quote annotated">
              <span>In my project, I designed the database.</span>{' '}
              <mark className="err-sentence"><sup className="err-num">1</sup>We did a lot of things and it was pretty good.</mark>
            </p>
            <div className="preview-fix">
              <strong>Vấn đề:</strong> Diễn đạt chung chung, thiếu số liệu.<br />
              <strong>Nên sửa:</strong> “I built 12 REST APIs, which helped the team finish a week early.”
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="schools">
        <div className="public-inner">
          <div className="section-head">
            <span className="kicker">Dành cho ai</span>
            <h2>Sinh viên luyện tập, nhà trường theo dõi</h2>
          </div>
          <div className="grid grid-2">
            <article className="audience card">
              <span className="feature-icon"><Icon name="user" size={22} /></span>
              <h3>Sinh viên IT năm 3–4</h3>
              <p>Chuẩn bị phỏng vấn thực tập (OJT) và vị trí Fresher.</p>
              <ul className="ticks">
                <li><Icon name="check" size={16} /> Lộ trình từ câu hỏi hành vi đến vòng kỹ thuật</li>
                <li><Icon name="check" size={16} /> Luyện lại bao nhiêu lần cũng được, không sợ bị đánh giá</li>
                <li><Icon name="check" size={16} /> Điểm rèn luyện, huy hiệu, mở khóa doanh nghiệp mới</li>
              </ul>
              <Link to="/register" className="btn btn-primary">Tạo tài khoản sinh viên</Link>
            </article>
            <article className="audience card accent">
              <span className="feature-icon"><Icon name="school" size={22} /></span>
              <h3>Phòng hỗ trợ việc làm của trường</h3>
              <p>Cung cấp công cụ luyện phỏng vấn cho hàng nghìn sinh viên với đội ngũ nhỏ.</p>
              <ul className="ticks">
                <li><Icon name="check" size={16} /> Bảng theo dõi theo lớp và theo tiêu chí</li>
                <li><Icon name="check" size={16} /> Danh sách sinh viên cần hỗ trợ thêm</li>
                <li><Icon name="check" size={16} /> Mã mời theo lớp, xuất báo cáo CSV</li>
              </ul>
              <button className="btn btn-accent" onClick={() => tryDemo('school')} disabled={busy}>Xem bảng điều khiển nhà trường</button>
            </article>
          </div>
        </div>
      </section>

      <section className="band alt" id="pricing">
        <div className="public-inner">
          <div className="section-head">
            <span className="kicker">Bảng giá</span>
            <h2>Miễn phí cho sinh viên trong giai đoạn thử nghiệm</h2>
          </div>
          <div className="grid grid-3 pricing">
            <article className="plan card">
              <h3>Sinh viên</h3>
              <p className="price">Miễn phí</p>
              <p className="muted">Dùng ngay, không cần thẻ thanh toán.</p>
              <ul className="ticks">
                <li><Icon name="check" size={16} /> 3 doanh nghiệp, 3 chủ đề</li>
                <li><Icon name="check" size={16} /> Giọng nói và chấm 3 tiêu chí</li>
                <li><Icon name="check" size={16} /> Lịch sử và biểu đồ tiến bộ</li>
              </ul>
              <Link to="/register" className="btn btn-ghost">Bắt đầu</Link>
            </article>
            <article className="plan card featured">
              <span className="plan-tag">B2B</span>
              <h3>Nhà trường</h3>
              <p className="price">Liên hệ</p>
              <p className="muted">Theo số lượng sinh viên, có gói thử nghiệm.</p>
              <ul className="ticks">
                <li><Icon name="check" size={16} /> Toàn bộ sinh viên dùng đầy đủ tính năng AI</li>
                <li><Icon name="check" size={16} /> Bảng điều khiển theo lớp, xuất báo cáo</li>
                <li><Icon name="check" size={16} /> Hỗ trợ tổ chức ngày phỏng vấn thử</li>
              </ul>
              <button className="btn btn-accent" onClick={() => tryDemo('school')} disabled={busy}>Xem bản demo</button>
            </article>
            <article className="plan card">
              <h3>Gói nước rút</h3>
              <p className="price">Sắp ra mắt</p>
              <p className="muted">Cho sinh viên cần luyện dồn trước một buổi phỏng vấn quan trọng.</p>
              <ul className="ticks">
                <li><Icon name="check" size={16} /> Không giới hạn buổi AI trong 7 ngày</li>
                <li><Icon name="check" size={16} /> Bộ câu hỏi theo vị trí ứng tuyển</li>
                <li><Icon name="check" size={16} /> Báo cáo điểm mạnh, điểm yếu</li>
              </ul>
              <button className="btn btn-ghost" disabled>Sắp ra mắt</button>
            </article>
          </div>
        </div>
      </section>

      <section className="band" id="faq">
        <div className="public-inner faq-wrap">
          <div className="section-head left">
            <span className="kicker">Hỏi đáp</span>
            <h2>Câu hỏi thường gặp</h2>
          </div>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q} className="faq-item">
                <summary>{q}<Icon name="chevronDown" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="public-inner cta-inner">
          <div>
            <h2>Buổi phỏng vấn tiếp theo của bạn là khi nào?</h2>
            <p>Bắt đầu luyện ngay hôm nay, chỉ mất 10 phút cho buổi đầu tiên.</p>
          </div>
          <Link to="/register" className="btn btn-accent big">Tạo tài khoản miễn phí <Icon name="arrowRight" /></Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
