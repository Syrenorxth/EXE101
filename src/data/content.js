// Toàn bộ nội dung của bản MVP: ngành, doanh nghiệp mô phỏng, vị trí,
// chủ đề, vai nhà tuyển dụng, bài học và ngân hàng câu hỏi.

export const CAREERS = [
  { id: 'it', name: 'Công nghệ thông tin', desc: 'Lập trình, kiểm thử, phát triển phần mềm', active: true },
  { id: 'marketing', name: 'Marketing', desc: 'Nội dung, truyền thông, digital marketing', active: false },
  { id: 'finance', name: 'Tài chính', desc: 'Kế toán, phân tích tài chính, ngân hàng', active: false },
  { id: 'sales', name: 'Kinh doanh', desc: 'Bán hàng, chăm sóc khách hàng, B2B', active: false }
]

export const COMPANIES = [
  {
    id: 'pixelstart',
    name: 'PixelStart',
    kind: 'Startup',
    level: 'Cơ bản',
    unlockPoints: 0,
    positions: ['Intern'],
    desc: 'Startup 30 người làm ứng dụng giáo dục. Phỏng vấn thân thiện, coi trọng khả năng tự học và thái độ.',
    rounds: 'Phỏng vấn HR → Trao đổi với trưởng nhóm'
  },
  {
    id: 'novatech',
    name: 'NovaTech',
    kind: 'Gia công phần mềm',
    level: 'Trung bình',
    unlockPoints: 60,
    positions: ['Intern', 'Fresher'],
    desc: 'Khoảng 800 nhân sự, làm dự án cho khách hàng Nhật Bản và châu Âu. Có bài test đầu vào, một phần phỏng vấn bằng tiếng Anh.',
    rounds: 'Test đầu vào → Phỏng vấn HR → Phỏng vấn kỹ thuật'
  },
  {
    id: 'globalcore',
    name: 'GlobalCore',
    kind: 'Công ty sản phẩm',
    level: 'Nâng cao',
    unlockPoints: 150,
    positions: ['Fresher'],
    laterPositions: ['Junior'],
    desc: 'Công ty sản phẩm công nghệ có hàng triệu người dùng. Phỏng vấn kỹ thuật sâu, hỏi cả tư duy sản phẩm.',
    rounds: 'Phỏng vấn kỹ thuật → Phỏng vấn tổng hợp với quản lý'
  }
]

export const POSITIONS = {
  Intern: 'Sinh viên chưa có kinh nghiệm đi làm',
  Fresher: 'Mới tốt nghiệp hoặc dưới 1 năm kinh nghiệm',
  Junior: 'Đã có 1–2 năm kinh nghiệm (sau MVP)'
}

export const PERSONAS = {
  hr: {
    id: 'hr',
    name: 'Chị Lan',
    role: 'Chuyên viên nhân sự thân thiện',
    trait: 'Nói chậm, gợi ý và hỗ trợ',
    trains: 'Sự tự tin khi giao tiếp',
    timeLimit: 90,
    intro: {
      vi: 'Chào bạn, mình là Lan bên phòng nhân sự. Bạn cứ thoải mái nhé, mình bắt đầu bằng vài câu hỏi đơn giản thôi.',
      en: "Hi, I'm Lan from HR. Please relax, we'll start with a few simple questions."
    },
    ack: { vi: ['Cảm ơn bạn.', 'Mình hiểu rồi, cảm ơn bạn.', 'Ok, rất tốt.'], en: ['Thank you.', 'I see, thanks.', 'Great, thank you.'] }
  },
  techlead: {
    id: 'techlead',
    name: 'Anh Tuấn',
    role: 'Trưởng nhóm kỹ thuật yêu cầu cao',
    trait: 'Hỏi sâu, yêu cầu giải thích rõ',
    trains: 'Kiến thức chuyên môn',
    timeLimit: 75,
    intro: {
      vi: 'Chào em, anh là Tuấn, Tech Lead team backend. Anh sẽ hỏi sâu một chút, em cứ trả lời theo hiểu biết của mình.',
      en: "Hi, I'm Tuan, backend Tech Lead. I'll dig a bit deeper, just answer based on what you know."
    },
    ack: { vi: ['Ok.', 'Được.', 'Anh hiểu.'], en: ['Okay.', 'Right.', 'I see.'] }
  },
  manager: {
    id: 'manager',
    name: 'Chị Hương',
    role: 'Quản lý bận rộn',
    trait: 'Yêu cầu trả lời ngắn gọn, đúng trọng tâm',
    trains: 'Khả năng trình bày súc tích',
    timeLimit: 45,
    intro: {
      vi: 'Chào em, chị là Hương, quản lý dự án. Chị chỉ có 15 phút nên em trả lời ngắn gọn giúp chị.',
      en: "Hi, I'm Huong, project manager. I only have 15 minutes, so please keep it short."
    },
    ack: { vi: ['Được.', 'Ok, tiếp nhé.', 'Rồi.'], en: ['Fine.', 'Okay, next.', 'Got it.'] }
  }
}

export const TOPICS = [
  {
    id: 1,
    name: 'Khởi động & phỏng vấn hành vi',
    goal: 'Làm quen với cấu trúc buổi phỏng vấn và xây dựng sự tự tin.',
    defaultPersona: 'hr',
    questionIds: ['b1', 'b2', 'b3', 'b4', 'b5'],
    take: 3
  },
  {
    id: 2,
    name: 'Phỏng vấn chuyên môn & tình huống',
    goal: 'Vận dụng kiến thức đã học vào tình huống nghề nghiệp thực tế.',
    defaultPersona: 'techlead',
    questionIds: ['t1', 't2', 't3', 't4', 't5'],
    take: 3
  },
  {
    id: 3,
    name: 'Phỏng vấn tổng hợp',
    goal: 'Phản ứng và trình bày trong điều kiện gần với phỏng vấn thật.',
    defaultPersona: 'manager',
    questionIds: ['b1', 't2', 'b3', 't3'],
    take: 2,
    situationChange: true
  }
]

export const LESSONS = {
  1: {
    title: 'Trả lời câu hỏi hành vi bằng phương pháp STAR',
    blocks: [
      {
        heading: 'Phương pháp STAR',
        items: [
          ['Situation – Bối cảnh', 'Chuyện xảy ra ở đâu, khi nào. Một đến hai câu là đủ.'],
          ['Task – Nhiệm vụ', 'Bạn chịu trách nhiệm việc gì, mục tiêu là gì.'],
          ['Action – Hành động', 'Chính bạn đã làm gì. Dùng "em đã", "mình đã", không dùng "nhóm em".'],
          ['Result – Kết quả', 'Kết quả cụ thể, có con số càng tốt, và bạn rút ra điều gì.']
        ]
      },
      {
        heading: 'Mẫu câu hữu ích',
        items: [
          ['Mở đầu', '"Em xin kể về dự án … ở học kỳ 5, khi nhóm em cần …"'],
          ['Nhấn vai trò', '"Trong nhóm, em phụ trách phần …"'],
          ['Chốt kết quả', '"Kết quả là … và em học được …"']
        ]
      },
      {
        heading: 'Lỗi thường gặp',
        items: [
          ['Kể lan man', 'Đi thẳng vào ý chính, mỗi câu trả lời khoảng 1–2 phút.'],
          ['Chỉ nói "nhóm em"', 'Nhà tuyển dụng muốn biết bạn làm gì.'],
          ['Không có kết quả', 'Luôn kết thúc bằng kết quả hoặc bài học.']
        ]
      }
    ]
  },
  2: {
    title: 'Trả lời câu hỏi chuyên môn và xử lý sự cố',
    blocks: [
      {
        heading: 'Khung trả lời câu hỏi kiến thức',
        items: [
          ['Định nghĩa', 'Nói ngắn gọn khái niệm là gì.'],
          ['Ví dụ', 'Lấy ví dụ từ dự án bạn đã làm.'],
          ['So sánh / đánh đổi', 'Khi nào nên dùng, khi nào không, ưu nhược điểm.']
        ]
      },
      {
        heading: 'Khung xử lý sự cố',
        items: [
          ['Bình tĩnh và khoanh vùng', 'Lỗi ở đâu: frontend, backend hay database?'],
          ['Thu thập thông tin', 'Đọc log, tái hiện lỗi, xem thay đổi gần nhất.'],
          ['Khắc phục', 'Sửa nhanh hoặc rollback về bản ổn định.'],
          ['Báo cáo', 'Thông báo cho trưởng nhóm, ghi lại nguyên nhân.']
        ]
      },
      {
        heading: 'Từ vựng chuyên ngành',
        items: [
          ['deploy / rollback', 'Triển khai / quay lại phiên bản trước'],
          ['log / debug', 'Nhật ký hệ thống / tìm và sửa lỗi'],
          ['trade-off', 'Sự đánh đổi giữa các lựa chọn']
        ]
      }
    ]
  },
  3: {
    title: 'Phỏng vấn tổng hợp và tình huống thay đổi',
    blocks: [
      {
        heading: 'Kết nối câu trả lời với vị trí',
        items: [
          ['Hiểu công ty', 'Nhắc đến sản phẩm hoặc lĩnh vực của công ty.'],
          ['Gắn với vị trí', 'Giải thích vì sao kinh nghiệm của bạn phù hợp.']
        ]
      },
      {
        heading: 'Khi điều kiện thay đổi',
        items: [
          ['Xác nhận lại', 'Hỏi rõ yêu cầu mới trước khi trả lời.'],
          ['Ưu tiên', 'Việc nào làm trước, việc nào lùi lại.'],
          ['Trao đổi rủi ro', 'Nói rõ rủi ro và đề xuất phương án.']
        ]
      },
      {
        heading: 'Với người phỏng vấn bận rộn',
        items: [['Nói ý chính trước', 'Câu đầu tiên là câu trả lời, giải thích sau.']]
      }
    ]
  }
}

// kw: từ khóa dùng để chấm Relevance ở chế độ demo.
export const QUESTIONS = {
  b1: {
    vi: 'Bạn hãy giới thiệu ngắn gọn về bản thân.',
    en: 'Tell me about yourself.',
    kw: ['năm', 'ngành', 'học', 'dự án', 'kỹ năng', 'mục tiêu', 'thực tập', 'year', 'major', 'study', 'project', 'skill', 'goal', 'intern'],
    outline: 'Tên, năm học, chuyên ngành → 1 dự án hoặc kỹ năng nổi bật → vì sao ứng tuyển vị trí này.'
  },
  b2: {
    vi: 'Điểm mạnh và điểm yếu lớn nhất của bạn là gì?',
    en: 'What are your greatest strengths and weaknesses?',
    kw: ['điểm mạnh', 'điểm yếu', 'cải thiện', 'ví dụ', 'đang', 'strength', 'weakness', 'improve', 'example'],
    outline: 'Một điểm mạnh kèm ví dụ thật → một điểm yếu thật nhưng không chí mạng → bạn đang khắc phục thế nào.'
  },
  b3: {
    vi: 'Hãy kể về một dự án ở trường mà bạn tâm đắc nhất.',
    en: 'Tell me about a university project you are proud of.',
    kw: ['dự án', 'nhóm', 'vai trò', 'phụ trách', 'công nghệ', 'kết quả', 'project', 'team', 'role', 'technology', 'result'],
    outline: 'Dự án gì, mục tiêu → bạn phụ trách phần nào → khó khăn và cách giải quyết → kết quả, bài học.'
  },
  b4: {
    vi: 'Bạn xử lý thế nào khi có mâu thuẫn trong nhóm?',
    en: 'How do you handle conflicts in a team?',
    kw: ['mâu thuẫn', 'trao đổi', 'lắng nghe', 'thống nhất', 'ý kiến', 'kết quả', 'conflict', 'discuss', 'listen', 'agree', 'opinion'],
    outline: 'Một lần mâu thuẫn thật → bạn lắng nghe và trao đổi thế nào → nhóm thống nhất ra sao → kết quả.'
  },
  b5: {
    vi: 'Vì sao bạn muốn thực tập ở công ty chúng tôi?',
    en: 'Why do you want to intern at our company?',
    kw: ['công ty', 'học hỏi', 'sản phẩm', 'phù hợp', 'mục tiêu', 'môi trường', 'company', 'learn', 'product', 'fit', 'goal'],
    outline: 'Điều bạn biết về công ty → điểm phù hợp với kỹ năng của bạn → bạn muốn học được gì.'
  },
  t1: {
    vi: 'Hãy giải thích sự khác nhau giữa REST API và GraphQL.',
    en: 'Explain the difference between REST API and GraphQL.',
    kw: ['endpoint', 'query', 'client', 'server', 'dữ liệu', 'data', 'schema', 'over-fetching', 'http', 'resource'],
    outline: 'REST: nhiều endpoint theo resource → GraphQL: một endpoint, client chọn trường cần lấy → khi nào nên dùng cái nào.'
  },
  t2: {
    vi: 'Ứng dụng của bạn bỗng trả về lỗi 500 ngay trước buổi demo. Bạn sẽ làm gì?',
    en: 'Your application suddenly returns a 500 error right before the demo. What would you do?',
    kw: ['log', 'lỗi', 'server', 'kiểm tra', 'rollback', 'debug', 'nguyên nhân', 'báo', 'check', 'cause', 'fix', 'error'],
    outline: 'Khoanh vùng lỗi → đọc log, xem thay đổi gần nhất → sửa nhanh hoặc rollback → báo trưởng nhóm, ghi lại nguyên nhân.'
  },
  t3: {
    vi: 'Vì sao bạn chọn bộ công nghệ này cho dự án gần nhất?',
    en: 'Why did you choose this tech stack for your latest project?',
    kw: ['lý do', 'hiệu năng', 'cộng đồng', 'nhóm', 'yêu cầu', 'so sánh', 'reason', 'performance', 'community', 'team', 'requirement', 'compare'],
    outline: 'Yêu cầu của dự án → các lựa chọn đã cân nhắc → lý do chọn (năng lực nhóm, hiệu năng, cộng đồng) → điều sẽ làm khác nếu làm lại.'
  },
  t4: {
    vi: 'Giải thích lập trình hướng đối tượng (OOP) và cho một ví dụ.',
    en: 'Explain object-oriented programming (OOP) and give an example.',
    kw: ['class', 'object', 'kế thừa', 'đóng gói', 'đa hình', 'trừu tượng', 'inheritance', 'encapsulation', 'polymorphism', 'abstraction'],
    outline: 'Khái niệm class/object → bốn tính chất → ví dụ cụ thể từ dự án của bạn.'
  },
  t5: {
    vi: 'Bạn và một thành viên bất đồng về cách thiết kế database. Bạn xử lý thế nào?',
    en: 'You and a teammate disagree about the database design. How do you handle it?',
    kw: ['thiết kế', 'bảng', 'lý do', 'so sánh', 'thống nhất', 'ưu', 'nhược', 'design', 'table', 'compare', 'agree', 'trade-off'],
    outline: 'Lắng nghe lý do của bạn kia → so sánh ưu nhược hai cách bằng tiêu chí cụ thể → hỏi ý kiến trưởng nhóm nếu cần → thống nhất.'
  }
}

export const SITUATION_CHANGES = [
  {
    vi: 'Tình huống thay đổi: khách hàng vừa yêu cầu bàn giao sớm hơn một tuần so với kế hoạch. Bạn sẽ điều chỉnh công việc thế nào?',
    en: 'Situation change: the client now wants delivery one week earlier than planned. How would you adjust your work?',
    kw: ['ưu tiên', 'kế hoạch', 'trao đổi', 'phạm vi', 'rủi ro', 'tính năng', 'priority', 'plan', 'scope', 'risk', 'communicate', 'feature'],
    outline: 'Xác nhận lại yêu cầu → ưu tiên tính năng cốt lõi → trao đổi rủi ro với trưởng nhóm và khách hàng → đề xuất phương án.'
  },
  {
    vi: 'Tình huống thay đổi: một thành viên trong nhóm bất ngờ nghỉ ốm đúng tuần cuối dự án. Bạn xử lý ra sao?',
    en: 'Situation change: a teammate suddenly falls sick during the final week of the project. How do you handle it?',
    kw: ['phân chia', 'ưu tiên', 'trao đổi', 'hỗ trợ', 'kế hoạch', 'rủi ro', 'reassign', 'priority', 'support', 'plan', 'risk'],
    outline: 'Nắm phần việc còn dở → phân chia lại theo ưu tiên → báo trưởng nhóm về rủi ro tiến độ.'
  }
]
