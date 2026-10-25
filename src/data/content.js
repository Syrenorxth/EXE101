// Toàn bộ nội dung của bản MVP: ngành, doanh nghiệp mô phỏng, vị trí,
// chủ đề, vai nhà tuyển dụng, bài học và ngân hàng câu hỏi.
// Mỗi ngành có 3 doanh nghiệp mô phỏng và một người phỏng vấn chuyên môn riêng;
// câu hỏi hành vi (b*) và tình huống thay đổi (sc*) dùng chung cho mọi ngành.

export const CAREERS = [
  { id: 'it', name: 'Công nghệ thông tin', short: 'IT', desc: 'Lập trình, kiểm thử, phát triển phần mềm', specialist: 'techlead', active: true },
  { id: 'marketing', name: 'Marketing', short: 'Marketing', desc: 'Nội dung, truyền thông, digital marketing', specialist: 'mktlead', active: true },
  { id: 'finance', name: 'Tài chính – Kế toán', short: 'Tài chính', desc: 'Kế toán, kiểm toán, phân tích tài chính, ngân hàng', specialist: 'finlead', active: true },
  { id: 'sales', name: 'Kinh doanh', short: 'Kinh doanh', desc: 'Bán hàng, phát triển khách hàng, B2B', specialist: 'saleslead', active: true }
]

export const COMPANIES = [
  // ---- Công nghệ thông tin ----
  {
    id: 'pixelstart',
    career: 'it',
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
    career: 'it',
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
    career: 'it',
    name: 'GlobalCore',
    kind: 'Công ty sản phẩm',
    level: 'Nâng cao',
    unlockPoints: 150,
    positions: ['Fresher'],
    laterPositions: ['Junior'],
    desc: 'Công ty sản phẩm công nghệ có hàng triệu người dùng. Phỏng vấn kỹ thuật sâu, hỏi cả tư duy sản phẩm.',
    rounds: 'Phỏng vấn kỹ thuật → Phỏng vấn tổng hợp với quản lý'
  },
  // ---- Marketing ----
  {
    id: 'bloom',
    career: 'marketing',
    name: 'Bloom Agency',
    kind: 'Agency truyền thông',
    level: 'Cơ bản',
    unlockPoints: 0,
    positions: ['Intern'],
    desc: 'Agency 40 người làm nội dung và social media cho các thương hiệu trẻ. Phỏng vấn cởi mở, coi trọng ý tưởng và sự chủ động.',
    rounds: 'Phỏng vấn HR → Bài test ý tưởng nội dung'
  },
  {
    id: 'lumina',
    career: 'marketing',
    name: 'Lumina Brands',
    kind: 'Thương hiệu hàng tiêu dùng',
    level: 'Trung bình',
    unlockPoints: 60,
    positions: ['Intern', 'Fresher'],
    desc: 'Công ty hàng tiêu dùng có phòng marketing in-house. Hỏi nhiều về hiểu biết khách hàng, kênh truyền thông và số liệu chiến dịch.',
    rounds: 'Phỏng vấn HR → Case study → Phỏng vấn với trưởng phòng'
  },
  {
    id: 'orbit',
    career: 'marketing',
    name: 'Orbit Commerce',
    kind: 'Sàn thương mại điện tử',
    level: 'Nâng cao',
    unlockPoints: 150,
    positions: ['Fresher'],
    laterPositions: ['Junior'],
    desc: 'Sàn thương mại điện tử có hàng triệu người mua. Phỏng vấn performance marketing, đòi hỏi tư duy số liệu và một phần bằng tiếng Anh.',
    rounds: 'Bài test phân tích số liệu → Phỏng vấn chuyên môn → Phỏng vấn với quản lý'
  },
  // ---- Tài chính – Kế toán ----
  {
    id: 'paynest',
    career: 'finance',
    name: 'PayNest',
    kind: 'Startup fintech',
    level: 'Cơ bản',
    unlockPoints: 0,
    positions: ['Intern'],
    desc: 'Startup ví điện tử 50 người. Phỏng vấn thân thiện, coi trọng sự cẩn thận với con số và tinh thần học hỏi.',
    rounds: 'Phỏng vấn HR → Trao đổi với trưởng nhóm tài chính'
  },
  {
    id: 'vertex',
    career: 'finance',
    name: 'Vertex Bank',
    kind: 'Ngân hàng thương mại',
    level: 'Trung bình',
    unlockPoints: 60,
    positions: ['Intern', 'Fresher'],
    desc: 'Ngân hàng có mạng lưới chi nhánh toàn quốc. Có bài test kiến thức, hỏi kỹ về nghiệp vụ, quy trình và thái độ phục vụ khách hàng.',
    rounds: 'Test kiến thức → Phỏng vấn HR → Phỏng vấn nghiệp vụ'
  },
  {
    id: 'crest',
    career: 'finance',
    name: 'Crest Advisory',
    kind: 'Công ty kiểm toán – tư vấn',
    level: 'Nâng cao',
    unlockPoints: 150,
    positions: ['Fresher'],
    laterPositions: ['Junior'],
    desc: 'Công ty kiểm toán và tư vấn có khách hàng đa quốc gia. Phỏng vấn bằng tiếng Anh, hỏi sâu về báo cáo tài chính và khả năng làm việc dưới áp lực.',
    rounds: 'Test tiếng Anh và kiến thức → Phỏng vấn nhóm → Phỏng vấn với quản lý'
  },
  // ---- Kinh doanh ----
  {
    id: 'freshway',
    career: 'sales',
    name: 'FreshWay Mart',
    kind: 'Chuỗi bán lẻ',
    level: 'Cơ bản',
    unlockPoints: 0,
    positions: ['Intern'],
    desc: 'Chuỗi cửa hàng tiện lợi đang mở rộng. Phỏng vấn thân thiện, coi trọng giao tiếp với khách hàng và sự chăm chỉ.',
    rounds: 'Phỏng vấn HR → Trao đổi với quản lý khu vực'
  },
  {
    id: 'sunrise',
    career: 'sales',
    name: 'Sunrise Distribution',
    kind: 'Phân phối hàng tiêu dùng',
    level: 'Trung bình',
    unlockPoints: 60,
    positions: ['Intern', 'Fresher'],
    desc: 'Nhà phân phối hàng tiêu dùng nhanh cho hàng nghìn điểm bán. Hỏi nhiều về chỉ tiêu doanh số, chăm sóc đại lý và đàm phán.',
    rounds: 'Phỏng vấn HR → Đóng vai bán hàng → Phỏng vấn với giám đốc kinh doanh'
  },
  {
    id: 'cloudpeak',
    career: 'sales',
    name: 'CloudPeak Software',
    kind: 'Công ty phần mềm B2B',
    level: 'Nâng cao',
    unlockPoints: 150,
    positions: ['Fresher'],
    laterPositions: ['Junior'],
    desc: 'Công ty bán phần mềm cho doanh nghiệp trong và ngoài nước. Phỏng vấn tư vấn giải pháp, một phần bằng tiếng Anh.',
    rounds: 'Phỏng vấn HR → Bài thuyết trình bán hàng → Phỏng vấn với quản lý'
  }
]

export const POSITIONS = {
  Intern: 'Sinh viên chưa có kinh nghiệm đi làm',
  Fresher: 'Mới tốt nghiệp hoặc dưới 1 năm kinh nghiệm',
  Junior: 'Đã có 1–2 năm kinh nghiệm (sau MVP)'
}

// hr và manager dùng chung cho mọi ngành; mỗi ngành có một người phỏng vấn chuyên môn (specialist).
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
    career: 'it',
    specialist: true,
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
  mktlead: {
    id: 'mktlead',
    career: 'marketing',
    specialist: true,
    name: 'Chị Mai',
    role: 'Trưởng phòng Marketing yêu cầu cao',
    trait: 'Hỏi sâu về số liệu chiến dịch và hiểu biết khách hàng',
    trains: 'Tư duy marketing và số liệu',
    timeLimit: 75,
    intro: {
      vi: 'Chào em, chị là Mai, trưởng phòng Marketing. Chị sẽ hỏi kỹ về cách em nghĩ và cách em đo kết quả, em cứ trả lời thật nhé.',
      en: "Hi, I'm Mai, Head of Marketing. I'll ask how you think and how you measure results, so just answer honestly."
    },
    ack: { vi: ['Ok.', 'Chị hiểu.', 'Được.'], en: ['Okay.', 'I see.', 'Right.'] }
  },
  finlead: {
    id: 'finlead',
    career: 'finance',
    specialist: true,
    name: 'Anh Quân',
    role: 'Trưởng nhóm phân tích tài chính kỹ tính',
    trait: 'Hỏi kỹ về con số, nguyên tắc và độ chính xác',
    trains: 'Kiến thức tài chính – kế toán',
    timeLimit: 75,
    intro: {
      vi: 'Chào em, anh là Quân, trưởng nhóm phân tích tài chính. Anh sẽ hỏi kỹ về con số, em cứ bình tĩnh trả lời theo hiểu biết của mình.',
      en: "Hi, I'm Quan, financial analysis team lead. I'll ask detailed questions about numbers, so take your time and answer based on what you know."
    },
    ack: { vi: ['Ok.', 'Được.', 'Anh hiểu.'], en: ['Okay.', 'Right.', 'Understood.'] }
  },
  saleslead: {
    id: 'saleslead',
    career: 'sales',
    specialist: true,
    name: 'Anh Hùng',
    role: 'Giám đốc kinh doanh khu vực',
    trait: 'Thích đóng vai khách hàng khó tính, hỏi thẳng về chỉ tiêu',
    trains: 'Kỹ năng bán hàng và thuyết phục',
    timeLimit: 75,
    intro: {
      vi: 'Chào em, anh là Hùng, giám đốc kinh doanh khu vực. Anh sẽ hỏi thẳng như khách hàng thật, em cứ tự tin trả lời.',
      en: "Hi, I'm Hung, regional sales director. I'll ask direct questions like a real customer would, so answer with confidence."
    },
    ack: { vi: ['Ok.', 'Được rồi.', 'Anh nghe.'], en: ['Okay.', 'Fine.', 'Go on.'] }
  },
  manager: {
    id: 'manager',
    name: 'Chị Hương',
    role: 'Quản lý bận rộn',
    trait: 'Yêu cầu trả lời ngắn gọn, đúng trọng tâm',
    trains: 'Khả năng trình bày súc tích',
    timeLimit: 45,
    intro: {
      vi: 'Chào em, chị là Hương, quản lý bộ phận. Chị chỉ có 15 phút nên em trả lời ngắn gọn giúp chị.',
      en: "Hi, I'm Huong, department manager. I only have 15 minutes, so please keep it short."
    },
    ack: { vi: ['Được.', 'Ok, tiếp nhé.', 'Rồi.'], en: ['Fine.', 'Okay, next.', 'Got it.'] }
  }
}

// Mỗi chủ đề gồm các bước (stages) theo đúng trình tự một buổi phỏng vấn thật.
// Mỗi bước chọn ngẫu nhiên MỘT câu trong "ids" (các câu cùng loại), nên luyện lại
// không bị trùng y hệt nhưng thứ tự luôn hợp lý.
// "ids" và "name" có thể là mảng/chuỗi dùng chung, hoặc object theo ngành { it, marketing, finance, sales }.
// "bridge": câu chuyển ý người phỏng vấn nói trước khi sang bước đó.
// defaultPersona/lockedPersona = 'specialist' nghĩa là người phỏng vấn chuyên môn của ngành đang chọn.
export const TOPICS = [
  {
    id: 1,
    name: 'Khởi động & phỏng vấn hành vi',
    goal: 'Làm quen với cấu trúc buổi phỏng vấn và xây dựng sự tự tin.',
    defaultPersona: 'hr',
    stages: [
      { name: 'Giới thiệu bản thân', ids: ['b1'] },
      {
        name: 'Kinh nghiệm và cách làm việc',
        ids: ['b3', 'b4', 'b2'],
        bridge: { vi: 'Tiếp theo là phần kinh nghiệm và cách làm việc.', en: "Now I'd like to hear more about your experience." }
      },
      {
        name: 'Động lực ứng tuyển',
        ids: ['b5'],
        bridge: { vi: 'Câu tiếp theo về lý do ứng tuyển.', en: "Next, let's talk about why you applied." }
      }
    ]
  },
  {
    id: 2,
    name: 'Phỏng vấn chuyên môn & tình huống',
    goal: 'Vận dụng kiến thức đã học vào tình huống nghề nghiệp thực tế.',
    defaultPersona: 'specialist',
    lockedPersona: 'specialist', // Phỏng vấn chuyên môn luôn do người phỏng vấn chuyên môn của ngành đảm nhận
    stages: [
      {
        name: { it: 'Dự án và công nghệ đã dùng', marketing: 'Chiến dịch đã tham gia', finance: 'Bài phân tích đã thực hiện', sales: 'Kinh nghiệm thuyết phục' },
        ids: { it: ['t3'], marketing: ['m3'], finance: ['f3'], sales: ['s3'] },
        bridge: { vi: 'Bắt đầu từ kinh nghiệm gần nhất của bạn nhé.', en: "Let's start with your most recent experience." }
      },
      {
        name: 'Kiến thức nền tảng',
        ids: { it: ['t1', 't4'], marketing: ['m1', 'm2'], finance: ['f1', 'f2'], sales: ['s1', 's2'] },
        bridge: { vi: 'Tiếp theo là một câu hỏi kiến thức chuyên môn.', en: 'Now a question on professional fundamentals.' }
      },
      {
        name: 'Tình huống thực tế',
        ids: { it: ['t2', 't5'], marketing: ['m4', 'm5'], finance: ['f4', 'f5'], sales: ['s4', 's5'] },
        bridge: { vi: 'Tiếp theo là một tình huống thực tế khi đi làm.', en: "Next, a practical scenario you might face on the job." }
      }
    ]
  },
  {
    id: 3,
    name: 'Phỏng vấn tổng hợp',
    goal: 'Phản ứng và trình bày trong điều kiện gần với phỏng vấn thật.',
    defaultPersona: 'manager',
    stages: [
      { name: 'Giới thiệu bản thân', ids: ['b1'] },
      {
        name: 'Kinh nghiệm thực tế',
        ids: { it: ['b3', 't3'], marketing: ['b3', 'm3'], finance: ['b3', 'f3'], sales: ['b3', 's3'] },
        bridge: { vi: 'Tiếp theo là phần kinh nghiệm thực tế.', en: 'Next, tell me about your hands-on experience.' }
      }
    ],
    situationChange: true // Tình huống thay đổi luôn là câu chính cuối cùng
  }
]


// Câu hỏi cuối buổi: người phỏng vấn mời ứng viên hỏi lại (không tính điểm).
export const REVERSE_QUESTION = {
  vi: 'Phần câu hỏi của công ty đến đây là hết. Bạn có câu hỏi nào muốn hỏi lại không?',
  en: "That's all from my side. Do you have any questions for me?"
}

export const REVERSE_TIP = {
  vi: 'Nên chuẩn bị sẵn 1–2 câu hỏi về công việc, nhóm hoặc lộ trình học tập, ví dụ: “Một ngày làm việc của thực tập sinh trong nhóm diễn ra thế nào?” hoặc “Công ty đánh giá thực tập sinh dựa trên những tiêu chí nào?”. Trả lời “không có câu hỏi” dễ bị xem là chưa thật sự quan tâm.',
  en: 'Nên chuẩn bị sẵn 1–2 câu hỏi về công việc, nhóm hoặc lộ trình học tập, ví dụ: “What does a typical day look like for a new member of your team?” hoặc “How do you evaluate interns and freshers here?”. Trả lời “No, I don\'t have any questions” dễ bị xem là chưa thật sự quan tâm.'
}

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
  // Chủ đề 2 có bài học riêng cho từng ngành.
  2: {
    it: {
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
    marketing: {
      title: 'Trả lời câu hỏi chuyên môn Marketing và xử lý khủng hoảng',
      blocks: [
        {
          heading: 'Khung trả lời câu hỏi kiến thức',
          items: [
            ['Định nghĩa', 'Nói ngắn gọn khái niệm là gì, dùng để làm gì.'],
            ['Ví dụ', 'Lấy ví dụ từ chiến dịch, bài tập nhóm hoặc fanpage bạn từng làm.'],
            ['Số liệu', 'Chỉ ra cách đo: reach, CTR, tỷ lệ chuyển đổi, chi phí trên mỗi đơn hàng.']
          ]
        },
        {
          heading: 'Khung xử lý khủng hoảng truyền thông',
          items: [
            ['Xác nhận vấn đề', 'Đọc kỹ phản hồi tiêu cực, xác định mức độ lan truyền.'],
            ['Tìm nguyên nhân', 'Nội dung sai, hiểu nhầm hay lỗi sản phẩm?'],
            ['Phản hồi và khắc phục', 'Tạm dừng nội dung, phản hồi chân thành, đưa ra giải pháp.'],
            ['Báo cáo và rút kinh nghiệm', 'Báo cấp trên, cập nhật quy trình duyệt nội dung.']
          ]
        },
        {
          heading: 'Từ vựng chuyên ngành',
          items: [
            ['brand awareness / performance', 'Nhận biết thương hiệu / marketing tạo chuyển đổi'],
            ['target audience / insight', 'Khách hàng mục tiêu / sự thật ngầm hiểu của khách hàng'],
            ['KPI / ROAS', 'Chỉ số đo hiệu quả / doanh thu trên chi phí quảng cáo']
          ]
        }
      ]
    },
    finance: {
      title: 'Trả lời câu hỏi chuyên môn Tài chính – Kế toán và xử lý sai lệch số liệu',
      blocks: [
        {
          heading: 'Khung trả lời câu hỏi kiến thức',
          items: [
            ['Định nghĩa', 'Nói chính xác khái niệm, dùng đúng thuật ngữ.'],
            ['Ví dụ bằng con số', 'Minh họa bằng một ví dụ số đơn giản, dễ theo dõi.'],
            ['Ý nghĩa với doanh nghiệp', 'Chỉ số đó giúp ra quyết định gì, cần lưu ý điều gì.']
          ]
        },
        {
          heading: 'Khung xử lý sai lệch số liệu',
          items: [
            ['Khoanh vùng', 'Sai lệch nằm ở tài khoản, kỳ hay chứng từ nào?'],
            ['Đối chiếu', 'So sánh sổ sách, chứng từ gốc và sao kê để tìm nguyên nhân.'],
            ['Điều chỉnh', 'Lập bút toán điều chỉnh theo đúng quy định, có người duyệt.'],
            ['Báo cáo', 'Báo trưởng nhóm, ghi lại nguyên nhân và đề xuất kiểm soát.']
          ]
        },
        {
          heading: 'Từ vựng chuyên ngành',
          items: [
            ['profit / cash flow', 'Lợi nhuận / dòng tiền'],
            ['balance sheet / income statement', 'Bảng cân đối kế toán / báo cáo kết quả kinh doanh'],
            ['reconciliation', 'Đối chiếu số liệu']
          ]
        }
      ]
    },
    sales: {
      title: 'Trả lời câu hỏi chuyên môn Kinh doanh và xử lý khách hàng khó',
      blocks: [
        {
          heading: 'Khung trả lời câu hỏi kiến thức',
          items: [
            ['Định nghĩa', 'Nói ngắn gọn khái niệm hoặc quy trình.'],
            ['Ví dụ', 'Lấy ví dụ từ việc làm thêm, bán hàng online hoặc hoạt động câu lạc bộ.'],
            ['Kết quả', 'Nói rõ con số: doanh số, số khách hàng, tỷ lệ chốt đơn.']
          ]
        },
        {
          heading: 'Khung xử lý khách hàng phàn nàn',
          items: [
            ['Lắng nghe và xác nhận', 'Để khách nói hết, xác nhận lại vấn đề, không tranh cãi.'],
            ['Tìm nguyên nhân', 'Kiểm tra đơn hàng, lịch giao, cam kết đã đưa ra.'],
            ['Đề xuất giải pháp', 'Đưa phương án cụ thể và thời hạn, có thể kèm bù đắp.'],
            ['Theo dõi', 'Gọi lại kiểm tra, báo cấp trên, cải thiện quy trình.']
          ]
        },
        {
          heading: 'Từ vựng chuyên ngành',
          items: [
            ['lead / prospect', 'Khách hàng tiềm năng'],
            ['closing / objection', 'Chốt đơn / lời từ chối của khách hàng'],
            ['target / quota', 'Chỉ tiêu doanh số']
          ]
        }
      ]
    }
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
// kind: loại câu hỏi, quyết định khung chấm Structure ở chế độ demo
//   behavior → STAR · tech → định nghĩa → ví dụ → so sánh · incident → khoanh vùng → nguyên nhân → khắc phục → báo cáo
export const QUESTIONS = {
  b1: {
    kind: 'behavior',
    vi: 'Bạn hãy giới thiệu ngắn gọn về bản thân.',
    en: 'Tell me about yourself.',
    kw: ['năm', 'ngành', 'học', 'dự án', 'kỹ năng', 'mục tiêu', 'thực tập', 'year', 'major', 'study', 'project', 'skill', 'goal', 'intern'],
    outline: 'Tên, năm học, chuyên ngành → 1 dự án hoặc kỹ năng nổi bật → vì sao ứng tuyển vị trí này.'
  },
  b2: {
    kind: 'behavior',
    vi: 'Điểm mạnh và điểm yếu lớn nhất của bạn là gì?',
    en: 'What are your greatest strengths and weaknesses?',
    kw: ['điểm mạnh', 'điểm yếu', 'cải thiện', 'ví dụ', 'đang', 'strength', 'weakness', 'improve', 'example'],
    outline: 'Một điểm mạnh kèm ví dụ thật → một điểm yếu thật nhưng không chí mạng → bạn đang khắc phục thế nào.'
  },
  b3: {
    kind: 'behavior',
    vi: 'Hãy kể về một dự án ở trường mà bạn tâm đắc nhất.',
    en: 'Tell me about a university project you are proud of.',
    kw: ['dự án', 'nhóm', 'vai trò', 'phụ trách', 'công nghệ', 'kết quả', 'project', 'team', 'role', 'technology', 'result'],
    outline: 'Dự án gì, mục tiêu → bạn phụ trách phần nào → khó khăn và cách giải quyết → kết quả, bài học.'
  },
  b4: {
    kind: 'behavior',
    vi: 'Bạn xử lý thế nào khi có mâu thuẫn trong nhóm?',
    en: 'How do you handle conflicts in a team?',
    kw: ['mâu thuẫn', 'trao đổi', 'lắng nghe', 'thống nhất', 'ý kiến', 'kết quả', 'conflict', 'discuss', 'listen', 'agree', 'opinion'],
    outline: 'Một lần mâu thuẫn thật → bạn lắng nghe và trao đổi thế nào → nhóm thống nhất ra sao → kết quả.'
  },
  b5: {
    kind: 'behavior',
    vi: 'Vì sao bạn muốn ứng tuyển vào công ty chúng tôi?',
    en: 'Why do you want to join our company?',
    kw: ['công ty', 'học hỏi', 'sản phẩm', 'phù hợp', 'mục tiêu', 'môi trường', 'company', 'learn', 'product', 'fit', 'goal'],
    outline: 'Điều bạn biết về công ty → điểm phù hợp với kỹ năng của bạn → bạn muốn học được gì.'
  },
  t1: {
    kind: 'tech',
    career: 'it',
    vi: 'Hãy giải thích sự khác nhau giữa REST API và GraphQL.',
    en: 'Explain the difference between REST API and GraphQL.',
    kw: ['endpoint', 'query', 'client', 'server', 'dữ liệu', 'data', 'schema', 'over-fetching', 'http', 'resource'],
    outline: 'REST: nhiều endpoint theo resource → GraphQL: một endpoint, client chọn trường cần lấy → khi nào nên dùng cái nào.'
  },
  t2: {
    kind: 'incident',
    career: 'it',
    vi: 'Ứng dụng của bạn bỗng trả về lỗi 500 ngay trước buổi demo. Bạn sẽ làm gì?',
    en: 'Your application suddenly returns a 500 error right before the demo. What would you do?',
    kw: ['log', 'lỗi', 'server', 'kiểm tra', 'rollback', 'debug', 'nguyên nhân', 'báo', 'check', 'cause', 'fix', 'error'],
    outline: 'Khoanh vùng lỗi → đọc log, xem thay đổi gần nhất → sửa nhanh hoặc rollback → báo trưởng nhóm, ghi lại nguyên nhân.'
  },
  t3: {
    kind: 'tech',
    career: 'it',
    vi: 'Bạn hãy kể về bộ công nghệ đã dùng trong dự án gần nhất. Vì sao bạn chọn nó?',
    en: 'Walk me through the tech stack of your latest project. Why did you choose it?',
    kw: ['lý do', 'hiệu năng', 'cộng đồng', 'nhóm', 'yêu cầu', 'so sánh', 'reason', 'performance', 'community', 'team', 'requirement', 'compare'],
    outline: 'Yêu cầu của dự án → các lựa chọn đã cân nhắc → lý do chọn (năng lực nhóm, hiệu năng, cộng đồng) → điều sẽ làm khác nếu làm lại.'
  },
  t4: {
    kind: 'tech',
    career: 'it',
    vi: 'Giải thích lập trình hướng đối tượng (OOP) và cho một ví dụ.',
    en: 'Explain object-oriented programming (OOP) and give an example.',
    kw: ['class', 'object', 'kế thừa', 'đóng gói', 'đa hình', 'trừu tượng', 'inheritance', 'encapsulation', 'polymorphism', 'abstraction'],
    outline: 'Khái niệm class/object → bốn tính chất → ví dụ cụ thể từ dự án của bạn.'
  },
  t5: {
    kind: 'behavior',
    career: 'it',
    vi: 'Bạn và một thành viên bất đồng về cách thiết kế database. Bạn xử lý thế nào?',
    en: 'You and a teammate disagree about the database design. How do you handle it?',
    kw: ['thiết kế', 'bảng', 'lý do', 'so sánh', 'thống nhất', 'ưu', 'nhược', 'design', 'table', 'compare', 'agree', 'trade-off'],
    outline: 'Lắng nghe lý do của bạn kia → so sánh ưu nhược hai cách bằng tiêu chí cụ thể → hỏi ý kiến trưởng nhóm nếu cần → thống nhất.'
  },
  // ---- Marketing ----
  m1: {
    kind: 'tech',
    career: 'marketing',
    vi: 'Hãy giải thích sự khác nhau giữa marketing xây dựng nhận biết thương hiệu và performance marketing. Khi nào nên ưu tiên cái nào?',
    en: 'Explain the difference between brand awareness marketing and performance marketing. When should each be prioritised?',
    kw: ['nhận biết', 'thương hiệu', 'chuyển đổi', 'doanh số', 'dài hạn', 'ngắn hạn', 'đo lường', 'awareness', 'brand', 'conversion', 'sales', 'long-term', 'short-term', 'measure', 'kpi'],
    outline: 'Awareness: xây dựng nhận biết lâu dài, đo bằng reach/recall → Performance: tạo đơn hàng ngay, đo bằng chuyển đổi/ROAS → ví dụ → khi nào ưu tiên cái nào.'
  },
  m2: {
    kind: 'tech',
    career: 'marketing',
    vi: 'Bạn sẽ đo hiệu quả của một chiến dịch quảng cáo trên Facebook bằng những chỉ số nào?',
    en: 'Which metrics would you use to measure the effectiveness of a Facebook ad campaign?',
    kw: ['reach', 'ctr', 'cpc', 'chuyển đổi', 'conversion', 'chi phí', 'cost', 'roas', 'mục tiêu', 'goal', 'tương tác', 'engagement'],
    outline: 'Xác định mục tiêu chiến dịch → chỉ số theo từng tầng (reach, CTR, CPC, tỷ lệ chuyển đổi, ROAS) → ví dụ đọc số liệu → hành động tối ưu.'
  },
  m3: {
    kind: 'behavior',
    career: 'marketing',
    vi: 'Hãy kể về một chiến dịch hoặc dự án marketing bạn đã tham gia. Vai trò và kết quả của bạn là gì?',
    en: 'Tell me about a marketing campaign or project you took part in. What was your role and what were the results?',
    kw: ['chiến dịch', 'mục tiêu', 'nội dung', 'kênh', 'vai trò', 'kết quả', 'campaign', 'goal', 'content', 'channel', 'role', 'result', 'reach'],
    outline: 'Bối cảnh và mục tiêu chiến dịch → phần bạn phụ trách → cách làm (nội dung, kênh) → kết quả bằng số liệu và bài học.'
  },
  m4: {
    kind: 'incident',
    career: 'marketing',
    vi: 'Một bài đăng của thương hiệu bị khách hàng phản ứng tiêu cực và lan rộng trên mạng xã hội. Bạn sẽ xử lý thế nào?',
    en: "One of the brand's posts receives a wave of negative reactions that is spreading on social media. How would you handle it?",
    kw: ['phản hồi', 'tạm dừng', 'xin lỗi', 'nguyên nhân', 'báo cáo', 'khách hàng', 'respond', 'pause', 'apologize', 'cause', 'report', 'customer', 'monitor'],
    outline: 'Xác nhận mức độ lan truyền → tạm dừng nội dung, tìm nguyên nhân → phản hồi chân thành, đưa giải pháp → báo cấp trên và cập nhật quy trình duyệt nội dung.'
  },
  m5: {
    kind: 'behavior',
    career: 'marketing',
    vi: 'Ngân sách chiến dịch bị cắt 30% ngay trước khi chạy. Bạn sẽ điều chỉnh kế hoạch thế nào?',
    en: 'The campaign budget is cut by 30% right before launch. How would you adjust the plan?',
    kw: ['ưu tiên', 'kênh', 'hiệu quả', 'mục tiêu', 'trao đổi', 'kpi', 'priority', 'channel', 'effective', 'goal', 'discuss', 'reallocate'],
    outline: 'Xác nhận lại mục tiêu → giữ kênh hiệu quả nhất, cắt kênh kém → điều chỉnh KPI và trao đổi với cấp trên → theo dõi sát kết quả.'
  },
  // ---- Tài chính – Kế toán ----
  f1: {
    kind: 'tech',
    career: 'finance',
    vi: 'Hãy giải thích sự khác nhau giữa lợi nhuận và dòng tiền. Vì sao một công ty có lãi vẫn có thể thiếu tiền?',
    en: 'Explain the difference between profit and cash flow. Why can a profitable company still run out of cash?',
    kw: ['lợi nhuận', 'dòng tiền', 'doanh thu', 'công nợ', 'phải thu', 'hàng tồn kho', 'profit', 'cash flow', 'revenue', 'receivable', 'inventory', 'accrual'],
    outline: 'Lợi nhuận ghi nhận theo dồn tích → dòng tiền là tiền thực thu, thực chi → ví dụ bán chịu, tồn kho → hệ quả và cách quản lý.'
  },
  f2: {
    kind: 'tech',
    career: 'finance',
    vi: 'Ba báo cáo tài chính chính là gì và chúng liên kết với nhau như thế nào?',
    en: 'What are the three main financial statements and how are they linked?',
    kw: ['bảng cân đối', 'kết quả kinh doanh', 'lưu chuyển tiền tệ', 'tài sản', 'lợi nhuận', 'balance sheet', 'income statement', 'cash flow', 'assets', 'equity', 'net income'],
    outline: 'Bảng cân đối kế toán, báo cáo kết quả kinh doanh, báo cáo lưu chuyển tiền tệ → mỗi báo cáo cho biết gì → lợi nhuận và tiền liên kết các báo cáo ra sao.'
  },
  f3: {
    kind: 'behavior',
    career: 'finance',
    vi: 'Hãy kể về một bài phân tích tài chính hoặc bài tập kế toán bạn đã thực hiện. Bạn làm phần nào và rút ra điều gì?',
    en: 'Tell me about a financial analysis or accounting assignment you worked on. What part did you do and what did you learn?',
    kw: ['phân tích', 'báo cáo', 'số liệu', 'excel', 'chỉ số', 'kết luận', 'analysis', 'report', 'data', 'ratio', 'conclusion', 'role', 'result'],
    outline: 'Bối cảnh bài phân tích → dữ liệu và công cụ bạn dùng → phát hiện chính bằng con số → kết quả, bài học.'
  },
  f4: {
    kind: 'incident',
    career: 'finance',
    vi: 'Khi đối chiếu số liệu cuối tháng, bạn phát hiện báo cáo lệch 50 triệu đồng so với sổ sách. Bạn sẽ làm gì?',
    en: 'During the month-end reconciliation, you find a 50-million-VND difference between the report and the ledger. What would you do?',
    kw: ['đối chiếu', 'chứng từ', 'nguyên nhân', 'điều chỉnh', 'báo cáo', 'kiểm tra', 'reconcile', 'document', 'cause', 'adjust', 'report', 'check', 'ledger'],
    outline: 'Khoanh vùng tài khoản và kỳ bị lệch → đối chiếu chứng từ, sao kê để tìm nguyên nhân → điều chỉnh đúng quy định, có người duyệt → báo trưởng nhóm và đề xuất kiểm soát.'
  },
  f5: {
    kind: 'behavior',
    career: 'finance',
    vi: 'Quản lý yêu cầu bạn hoàn thành báo cáo gấp trong hôm nay, nhưng số liệu từ phòng khác vẫn chưa gửi. Bạn xử lý thế nào?',
    en: 'Your manager needs a report by the end of today, but another department has not sent its data yet. How do you handle it?',
    kw: ['ưu tiên', 'liên hệ', 'trao đổi', 'thời hạn', 'giả định', 'báo cáo', 'priority', 'contact', 'communicate', 'deadline', 'assumption', 'update'],
    outline: 'Làm trước phần đã có số liệu → liên hệ trực tiếp phòng kia, hỏi thời điểm gửi → báo sớm cho quản lý, đề xuất bản tạm có ghi chú giả định → hoàn thiện khi có số liệu.'
  },
  // ---- Kinh doanh ----
  s1: {
    kind: 'tech',
    career: 'sales',
    vi: 'Quy trình bán hàng gồm những bước nào? Theo bạn, bước nào quan trọng nhất và vì sao?',
    en: 'What are the steps of the sales process? Which step do you think matters most, and why?',
    kw: ['tìm kiếm', 'tiếp cận', 'nhu cầu', 'trình bày', 'chốt', 'chăm sóc', 'prospect', 'approach', 'needs', 'present', 'close', 'follow up', 'objection'],
    outline: 'Các bước: tìm khách hàng → tiếp cận → tìm hiểu nhu cầu → trình bày giải pháp → xử lý từ chối → chốt đơn → chăm sóc sau bán → nêu bước quan trọng nhất kèm ví dụ.'
  },
  s2: {
    kind: 'tech',
    career: 'sales',
    vi: 'Bạn hiểu thế nào về tỷ lệ chuyển đổi và giá trị vòng đời khách hàng? Hai chỉ số này giúp gì cho người bán hàng?',
    en: 'What do conversion rate and customer lifetime value mean? How do these metrics help a salesperson?',
    kw: ['tỷ lệ', 'chuyển đổi', 'khách hàng', 'vòng đời', 'mua lại', 'doanh thu', 'conversion', 'rate', 'lifetime value', 'clv', 'repeat', 'revenue', 'retention'],
    outline: 'Định nghĩa tỷ lệ chuyển đổi → định nghĩa CLV → ví dụ bằng con số → dùng để ưu tiên khách hàng và chăm sóc khách hàng cũ.'
  },
  s3: {
    kind: 'behavior',
    career: 'sales',
    vi: 'Hãy kể về một lần bạn thuyết phục được người khác (khách hàng, thầy cô, bạn bè) đồng ý với đề xuất của mình.',
    en: 'Tell me about a time you persuaded someone, such as a customer, a teacher or a friend, to agree with your proposal.',
    kw: ['thuyết phục', 'nhu cầu', 'lắng nghe', 'lợi ích', 'đồng ý', 'kết quả', 'persuade', 'needs', 'listen', 'benefit', 'agree', 'result', 'customer'],
    outline: 'Bối cảnh và người cần thuyết phục → bạn tìm hiểu nhu cầu của họ thế nào → lập luận, lợi ích bạn đưa ra → kết quả và bài học.'
  },
  s4: {
    kind: 'incident',
    career: 'sales',
    vi: 'Một khách hàng lớn gọi điện phàn nàn vì giao hàng trễ và dọa hủy hợp đồng. Bạn xử lý thế nào?',
    en: 'A major customer calls to complain about a late delivery and threatens to cancel the contract. How do you handle it?',
    kw: ['lắng nghe', 'xin lỗi', 'kiểm tra', 'giải pháp', 'cam kết', 'theo dõi', 'listen', 'apologize', 'check', 'solution', 'commit', 'follow up', 'compensate'],
    outline: 'Lắng nghe, xác nhận vấn đề và xin lỗi → kiểm tra nguyên nhân với bộ phận giao hàng → đưa giải pháp và thời hạn cụ thể, có thể bù đắp → theo dõi, báo cấp trên, cải thiện quy trình.'
  },
  s5: {
    kind: 'behavior',
    career: 'sales',
    vi: 'Còn một tuần nữa là hết tháng mà bạn mới đạt 60% chỉ tiêu doanh số. Bạn sẽ làm gì?',
    en: 'There is one week left in the month and you have only reached 60% of your sales target. What would you do?',
    kw: ['ưu tiên', 'khách hàng', 'tiềm năng', 'kế hoạch', 'chỉ tiêu', 'hỗ trợ', 'priority', 'customer', 'pipeline', 'plan', 'target', 'support', 'follow up'],
    outline: 'Rà soát danh sách khách hàng sắp chốt → ưu tiên cơ hội lớn, gọi lại khách cũ → xin hỗ trợ khuyến mãi hoặc từ trưởng nhóm → rút kinh nghiệm để không dồn cuối tháng.'
  }
}

export const SITUATION_CHANGES = [
  {
    id: 'sc1',
    vi: 'Tình huống thay đổi: khách hàng vừa yêu cầu bàn giao sớm hơn một tuần so với kế hoạch. Bạn sẽ điều chỉnh công việc thế nào?',
    en: 'Situation change: the client now wants delivery one week earlier than planned. How would you adjust your work?',
    kw: ['ưu tiên', 'kế hoạch', 'trao đổi', 'phạm vi', 'rủi ro', 'tính năng', 'priority', 'plan', 'scope', 'risk', 'communicate', 'feature'],
    outline: 'Xác nhận lại yêu cầu → ưu tiên tính năng cốt lõi → trao đổi rủi ro với trưởng nhóm và khách hàng → đề xuất phương án.'
  },
  {
    id: 'sc2',
    vi: 'Tình huống thay đổi: một thành viên trong nhóm bất ngờ nghỉ ốm đúng tuần cuối dự án. Bạn xử lý ra sao?',
    en: 'Situation change: a teammate suddenly falls sick during the final week of the project. How do you handle it?',
    kw: ['phân chia', 'ưu tiên', 'trao đổi', 'hỗ trợ', 'kế hoạch', 'rủi ro', 'reassign', 'priority', 'support', 'plan', 'risk'],
    outline: 'Nắm phần việc còn dở → phân chia lại theo ưu tiên → báo trưởng nhóm về rủi ro tiến độ.'
  }
]

// Câu trả lời mẫu tối ưu cho chế độ demo ({company} được thay bằng tên doanh nghiệp).
// Ở chế độ AI thật, câu trả lời mẫu do AI viết lại dựa trên chính nội dung người học đã nói.
export const MODEL_ANSWERS = {
  b1: {
    vi: 'Em là Minh, sinh viên năm bốn ngành Kỹ thuật phần mềm, định hướng lập trình fullstack. Trong đồ án quản lý thư viện, em làm cả hai phía: giao diện bằng React và 12 API bằng Spring Boot, giúp nhóm hoàn thành sớm một tuần. Ngoài giờ học, em đang tự học Docker qua một dự án cá nhân nhỏ. Em ứng tuyển vị trí này vì muốn được làm việc với sản phẩm có người dùng thật và học cách làm việc theo quy trình chuyên nghiệp.',
    en: "I'm Minh, a final-year Software Engineering student focusing on fullstack development. In our library management project, I worked on both sides: I built the React frontend and 12 REST APIs with Spring Boot, which helped the team finish a week early. Outside class, I'm learning Docker through a small personal project. I'm applying for this position because I want to work on a product with real users and learn how a professional team works."
  },
  b2: {
    vi: 'Điểm mạnh của em là tự học nhanh. Ví dụ, khi nhóm cần làm giao diện bằng React mà chưa ai biết, em tự học trong hai tuần và hoàn thành phần frontend đúng hạn. Điểm yếu của em là còn ngại thuyết trình trước đông người. Để cải thiện, em chủ động nhận phần trình bày trong các buổi bảo vệ đồ án, và ở lần gần nhất em đã trình bày trọn mười phút mà không cần nhìn slide.',
    en: 'My main strength is learning quickly. For example, when our team needed a React frontend and nobody knew React, I taught myself in two weeks and delivered the UI on time. My weakness is that I get nervous speaking in front of groups. To improve, I volunteer to present at every project defense, and last time I presented for ten minutes without reading from the slides.'
  },
  b3: {
    vi: 'Dự án em tâm đắc nhất là hệ thống quản lý thư viện ở học kỳ 5, giúp sinh viên tra cứu và mượn sách online thay vì ghi sổ. Trong nhóm năm người, em phụ trách backend: thiết kế cơ sở dữ liệu và viết API mượn trả sách. Khó nhất là xử lý hai người mượn cùng một cuốn sách một lúc, em giải quyết bằng transaction và khóa bản ghi. Kết quả là hệ thống chạy ổn định, thời gian tìm sách giảm khoảng 30%, và em học được cách thiết kế API rõ ràng cho nhóm frontend.',
    en: 'The project I am most proud of is a library management system that let students search and borrow books online instead of using paper records. In a team of five, I owned the backend: the database design and the borrowing APIs. The hardest part was two people borrowing the same book at once, which I solved with transactions and row locking. As a result, the system ran reliably, search time dropped by about 30 percent, and I learned how to design clear APIs for the frontend team.'
  },
  b4: {
    vi: 'Ở đồ án kỳ trước, hai bạn trong nhóm bất đồng về việc chọn thư viện giao diện, khiến tiến độ chậm gần một tuần. Em đề nghị cả nhóm họp 30 phút, mỗi bạn trình bày ưu nhược điểm theo ba tiêu chí: thời gian học, tài liệu và yêu cầu của đồ án. Sau khi so sánh, cả nhóm thống nhất chọn phương án đáp ứng đủ yêu cầu và quen thuộc với nhiều người hơn. Kết quả là nhóm bắt kịp tiến độ, và từ đó nhóm em luôn chốt tiêu chí trước khi tranh luận.',
    en: 'In a project last semester, two teammates disagreed about which UI library to use, which delayed us by almost a week. I suggested a 30-minute meeting where each person compared the options on three criteria: learning time, documentation and project requirements. After comparing, the team agreed on the option that met the requirements and was familiar to more people. We caught up on schedule, and since then our team agrees on criteria before debating.'
  },
  b5: {
    vi: 'Em đã tìm hiểu về {company} và thấy công ty đang phát triển những sản phẩm phần mềm có người dùng thật, đúng định hướng em muốn theo. Em có kinh nghiệm fullstack với React và Spring Boot qua hai đồ án ở trường, phù hợp với yêu cầu của vị trí này. Ở {company}, em mong học được cách làm việc theo quy trình chuyên nghiệp, cách review code và cách xây dựng tính năng từ yêu cầu thật của khách hàng.',
    en: 'I researched {company} and saw that you build software products with real users, which is the direction I want to grow in. I have fullstack experience with React and Spring Boot from two university projects, which fits the requirements of this role. At {company}, I hope to learn professional workflows, code review, and how to build features from real customer requirements.'
  },
  t1: {
    vi: 'REST tổ chức API theo tài nguyên, mỗi tài nguyên có endpoint riêng như /books hay /users, và server quyết định dữ liệu trả về. GraphQL chỉ có một endpoint, client tự viết query để lấy đúng những trường cần. Ví dụ màn hình danh sách sách chỉ cần tên và tác giả thì GraphQL tránh được việc lấy thừa dữ liệu. Tuy vậy REST đơn giản và dễ cache hơn, nên với dự án nhỏ như đồ án của em, REST là lựa chọn hợp lý.',
    en: 'REST organizes the API around resources, with a separate endpoint for each, like /books and /users, and the server decides what data is returned. GraphQL has a single endpoint where the client writes a query to fetch exactly the fields it needs. For example, if a book list screen only needs titles and authors, GraphQL avoids over-fetching. However, REST is simpler and easier to cache, so for a small project like mine, REST is the more practical choice.'
  },
  t2: {
    vi: 'Đầu tiên em giữ bình tĩnh và khoanh vùng lỗi: 500 là lỗi phía server nên em xem log của server ngay. Tiếp theo em kiểm tra thay đổi được deploy gần nhất, vì lỗi xuất hiện đột ngột thường do lần cập nhật cuối. Nếu không sửa kịp trong vài phút, em rollback về phiên bản ổn định trước đó để buổi demo vẫn diễn ra. Sau buổi demo, em báo lại cho trưởng nhóm, ghi nguyên nhân và bổ sung test để lỗi không lặp lại.',
    en: "First, I stay calm and narrow it down: a 500 is a server-side error, so I check the server logs immediately. Next, I look at the most recent deployment, since sudden errors usually come from the latest change. If I can't fix it within a few minutes, I roll back to the last stable version so the demo can go ahead. Afterwards, I report to the team lead, document the root cause and add a test so it doesn't happen again."
  },
  t3: {
    vi: 'Ở dự án gần nhất, nhóm em cần làm web quản lý có đăng nhập, phân quyền và báo cáo trong tám tuần. Em cân nhắc giữa Node.js và Spring Boot, cuối cùng chọn Spring Boot vì cả nhóm đã học Java, Spring Security có sẵn phần phân quyền, và tài liệu rất đầy đủ. Nếu làm lại, em sẽ dùng Docker ngay từ đầu để mọi thành viên chạy cùng một môi trường, tránh lỗi chỉ xảy ra trên máy một người.',
    en: 'In my latest project, our team had eight weeks to build a management web app with login, role-based access and reports. I compared Node.js and Spring Boot and chose Spring Boot because everyone already knew Java, Spring Security handled roles out of the box, and the documentation is extensive. If I did it again, I would use Docker from day one so everyone runs the same environment and we avoid bugs that only happen on one machine.'
  },
  t4: {
    vi: 'Lập trình hướng đối tượng là cách tổ chức chương trình thành các đối tượng, mỗi đối tượng gồm dữ liệu và hành vi, được tạo từ class. OOP có bốn tính chất: đóng gói, kế thừa, đa hình và trừu tượng. Ví dụ trong đồ án thư viện, em tạo class User chung, rồi Student và Librarian kế thừa từ User; mỗi class ghi đè hàm getPermissions theo quyền riêng, đó là đa hình. Nhờ vậy khi thêm loại người dùng mới, em không phải sửa code cũ.',
    en: "Object-oriented programming organizes a program into objects that combine data and behavior, created from classes. OOP has four principles: encapsulation, inheritance, polymorphism and abstraction. For example, in my library project I created a base User class, and Student and Librarian inherit from it; each overrides getPermissions with its own rules, which is polymorphism. As a result, adding a new user type doesn't require changing existing code."
  },
  t5: {
    vi: 'Đầu tiên em lắng nghe lý do của bạn ấy để hiểu vì sao bạn chọn cách thiết kế đó. Sau đó em đề xuất hai bên so sánh theo tiêu chí cụ thể: tính toàn vẹn dữ liệu, tốc độ truy vấn của các màn hình chính và độ khó khi mở rộng. Nếu vẫn chưa thống nhất, em nhờ trưởng nhóm góp ý. Ở đồ án trước, cách này giúp nhóm chọn được thiết kế chuẩn hóa hơn mà vẫn truy vấn nhanh nhờ index, và không ai thấy ý kiến mình bị gạt đi.',
    en: "First, I listen to my teammate's reasons to understand why they chose that design. Then I suggest we compare both options on concrete criteria: data integrity, query speed for the main screens and how easy it is to extend. If we still disagree, I ask the team lead for input. In a previous project, this helped us choose a more normalized design while keeping queries fast with indexes, and nobody felt their opinion was ignored."
  },
  sc1: {
    vi: 'Trước tiên em xác nhận lại với trưởng nhóm phạm vi cần bàn giao sớm, vì không phải tính năng nào cũng bắt buộc. Sau đó em sắp xếp lại công việc theo mức ưu tiên, tập trung hoàn thành các tính năng cốt lõi và lùi các phần phụ sang đợt sau. Em cũng nói rõ rủi ro, ví dụ thời gian kiểm thử bị rút ngắn, và đề xuất bàn giao theo hai đợt để khách hàng có sản phẩm dùng được đúng hạn mới.',
    en: 'First, I confirm with the team lead which scope must be delivered early, since not every feature is essential. Then I reprioritize the work, focusing on core features and moving secondary ones to a later release. I also flag the risks clearly, such as reduced testing time, and propose delivering in two phases so the client gets a usable product by the new deadline.'
  },
  sc2: {
    vi: 'Em sẽ nắm lại phần việc bạn ấy đang làm dở qua task board, và hỏi nhanh bạn ấy những điểm quan trọng nếu bạn có thể trả lời. Sau đó em cùng nhóm phân chia lại công việc theo mức ưu tiên, việc nào ảnh hưởng đến bàn giao thì làm trước. Em báo ngay cho trưởng nhóm về rủi ro tiến độ để có phương án dự phòng, thay vì đợi đến hạn mới thông báo.',
    en: "I would review my teammate's unfinished tasks on the task board and briefly ask them about key points if they're able to respond. Then the team redistributes the work by priority, handling anything that affects delivery first. I would also notify the team lead about the schedule risk right away so we can plan a backup, instead of waiting until the deadline."
  }
}

// Câu trả lời mẫu theo ngành cho các câu hỏi hành vi dùng chung (b1, b3, b5) và bản trung tính cho b2, b4.
// Ghép vào MODEL_ANSWERS: b1/b3/b5 có khóa theo ngành, b2/b4 có khóa it + default.
export const BEHAVIOR_BY_CAREER = {
  b1: {
    marketing: {
      vi: 'Em là Linh, sinh viên năm bốn ngành Marketing. Thế mạnh của em là digital marketing: trong dự án môn học kỳ trước, em phụ trách nội dung cho fanpage của một quán cà phê, giúp lượng tương tác tăng 40% sau hai tháng. Ngoài giờ học, em tự học quảng cáo Facebook và Google Analytics. Em ứng tuyển vị trí này vì muốn làm chiến dịch thật với ngân sách thật và học cách đo hiệu quả bằng số liệu.',
      en: "I'm Linh, a final-year Marketing student. My strongest area is digital marketing: in a course project last semester, I managed content for a coffee shop's Facebook page, and engagement grew by 40% in two months. Outside class, I'm learning Facebook Ads and Google Analytics. I'm applying for this position because I want to work on real campaigns with real budgets and learn to measure results with data."
    },
    finance: {
      vi: 'Em là An, sinh viên năm bốn ngành Tài chính – Ngân hàng. Thế mạnh của em là phân tích số liệu: trong đồ án môn Phân tích báo cáo tài chính, em phụ trách tính toán và so sánh các chỉ số của ba công ty niêm yết bằng Excel, và nhóm em đạt điểm cao nhất lớp. Em đang ôn chứng chỉ ACCA phần đầu tiên. Em ứng tuyển vị trí này vì muốn áp dụng kiến thức vào số liệu thật và học quy trình làm việc chuyên nghiệp.',
      en: "I'm An, a final-year Finance and Banking student. My strongest skill is working with numbers: in our financial statement analysis project, I calculated and compared the key ratios of three listed companies in Excel, and our team received the highest score in the class. I'm also preparing for my first ACCA exam. I'm applying for this position because I want to apply my knowledge to real data and learn professional processes."
    },
    sales: {
      vi: 'Em là Huy, sinh viên năm bốn ngành Quản trị kinh doanh. Thế mạnh của em là giao tiếp và thuyết phục: hai năm qua em bán hàng online và làm thêm tại một cửa hàng điện máy, có tháng em đạt 120% chỉ tiêu được giao. Em cũng là trưởng ban đối ngoại của câu lạc bộ, phụ trách tìm nhà tài trợ. Em ứng tuyển vị trí này vì muốn phát triển sự nghiệp bán hàng một cách bài bản và chinh phục những chỉ tiêu lớn hơn.',
      en: "I'm Huy, a final-year Business Administration student. My strengths are communication and persuasion: for two years I have sold products online and worked part-time at an electronics store, where I once reached 120% of my monthly target. I also lead the partnerships team of a student club, finding sponsors for our events. I'm applying for this position because I want to build a professional sales career and take on bigger targets."
    }
  },
  b3: {
    marketing: {
      vi: 'Dự án em tâm đắc nhất là chiến dịch truyền thông cho một hội chợ việc làm của trường. Mục tiêu là thu hút 1.000 sinh viên tham gia. Trong nhóm bốn người, em phụ trách lên kế hoạch nội dung và chạy fanpage. Khó nhất là ngân sách quảng cáo rất nhỏ, nên em tập trung vào video ngắn và hợp tác với các câu lạc bộ để chia sẻ. Kết quả là sự kiện có 1.300 sinh viên đăng ký, và em học được cách chọn kênh phù hợp với ngân sách.',
      en: "The project I'm most proud of is a promotion campaign for our university job fair. The goal was to attract 1,000 students. In a team of four, I was responsible for the content plan and the fanpage. The hardest part was the tiny ad budget, so I focused on short videos and partnered with student clubs to share them. As a result, 1,300 students registered, and I learned how to choose channels that fit the budget."
    },
    finance: {
      vi: 'Dự án em tâm đắc nhất là bài định giá một công ty bán lẻ niêm yết trong môn Tài chính doanh nghiệp. Trong nhóm năm người, em phụ trách dự báo dòng tiền và tính giá trị theo phương pháp chiết khấu dòng tiền. Khó nhất là số liệu các năm không thống nhất, em phải đối chiếu lại từng báo cáo thường niên. Kết quả là mức giá nhóm em đưa ra chỉ chênh khoảng 8% so với giá thị trường, và em học được tầm quan trọng của việc kiểm tra số liệu đầu vào.',
      en: "The project I'm most proud of is the valuation of a listed retail company in our Corporate Finance course. In a team of five, I was responsible for forecasting cash flows and running the discounted cash flow valuation. The hardest part was inconsistent data across years, so I reconciled every annual report again. As a result, our valuation was within about 8% of the market price, and I learned how important it is to check input data."
    },
    sales: {
      vi: 'Dự án em tâm đắc nhất là chương trình bán hàng gây quỹ của câu lạc bộ. Mục tiêu là bán 500 sản phẩm trong hai tuần. Em phụ trách nhóm bán hàng năm người và trực tiếp liên hệ các tập thể lớp. Khó nhất là tuần đầu chỉ bán được 120 sản phẩm, nên em đổi cách làm: bán theo combo cho từng lớp và tặng quà cho lớp mua nhiều. Kết quả là nhóm bán được 560 sản phẩm, và em học được cách điều chỉnh nhanh khi kết quả chưa đạt.',
      en: "The project I'm most proud of is our club's fundraising sales campaign. The goal was to sell 500 products in two weeks. I led a sales team of five and contacted class groups directly. The hardest part was the first week, when we sold only 120 products, so I changed our approach: we offered class bundles and a gift for the class that bought the most. As a result, we sold 560 products, and I learned to adjust quickly when results fall short."
    }
  },
  b5: {
    marketing: {
      vi: 'Em đã tìm hiểu về {company} và rất ấn tượng với cách công ty làm nội dung gần gũi với người trẻ, đúng hướng em muốn theo đuổi. Em có kinh nghiệm làm nội dung và chạy fanpage qua các dự án ở trường, phù hợp với yêu cầu của vị trí này. Ở {company}, em mong học được cách lên kế hoạch chiến dịch bài bản và đo hiệu quả bằng số liệu.',
      en: "I researched {company} and was impressed by how your content connects with young people, which is the direction I want to pursue. I have experience creating content and managing fanpages through university projects, which fits this role. At {company}, I hope to learn how to plan campaigns professionally and measure their impact with data."
    },
    finance: {
      vi: 'Em đã tìm hiểu về {company} và thấy công ty có môi trường làm việc chuyên nghiệp, chú trọng đào tạo người mới, đúng điều em đang tìm kiếm. Em có nền tảng phân tích báo cáo tài chính và sử dụng Excel thành thạo, phù hợp với yêu cầu của vị trí này. Ở {company}, em mong học được quy trình nghiệp vụ chuẩn mực và cách làm việc cẩn thận với số liệu thật.',
      en: "I researched {company} and saw that you offer a professional environment with strong training for newcomers, which is exactly what I'm looking for. I have a solid foundation in financial statement analysis and I'm proficient in Excel, which fits this role. At {company}, I hope to learn standard professional procedures and how to work carefully with real figures."
    },
    sales: {
      vi: 'Em đã tìm hiểu về {company} và thấy công ty đang mở rộng thị trường rất nhanh, nên có nhiều cơ hội cho người làm kinh doanh trẻ. Em có kinh nghiệm bán hàng thực tế và từng vượt chỉ tiêu khi làm thêm, phù hợp với vị trí này. Ở {company}, em mong học được kỹ năng bán hàng chuyên nghiệp và phát triển thành người quản lý khách hàng giỏi.',
      en: "I researched {company} and saw that you are expanding quickly, which creates many opportunities for young salespeople. I have hands-on sales experience and exceeded my targets in my part-time job, which fits this role. At {company}, I hope to learn professional selling skills and grow into a strong account manager."
    }
  },
  b2: {
    default: {
      vi: 'Điểm mạnh của em là tự học nhanh. Ví dụ, khi nhóm cần làm báo cáo bằng một công cụ mới mà chưa ai biết, em tự học trong một tuần và hướng dẫn lại cho cả nhóm, giúp nộp bài đúng hạn. Điểm yếu của em là còn ngại thuyết trình trước đông người. Để cải thiện, em chủ động nhận phần trình bày trong các bài tập nhóm, và ở lần gần nhất em đã trình bày trọn mười phút mà không cần nhìn slide.',
      en: 'My main strength is learning quickly. For example, when our team needed to use a new tool for a report and nobody knew it, I taught myself in a week and showed the others, so we submitted on time. My weakness is that I get nervous speaking in front of groups. To improve, I volunteer to present in every team assignment, and last time I presented for ten minutes without reading from the slides.'
    }
  },
  b4: {
    default: {
      vi: 'Ở dự án môn học kỳ trước, hai bạn trong nhóm bất đồng về hướng làm bài, khiến tiến độ chậm gần một tuần. Em đề nghị cả nhóm họp 30 phút, mỗi bạn trình bày ưu nhược điểm theo ba tiêu chí: yêu cầu của đề bài, thời gian và nguồn lực. Sau khi so sánh, cả nhóm thống nhất chọn phương án đáp ứng tốt nhất yêu cầu. Kết quả là nhóm bắt kịp tiến độ, và từ đó nhóm em luôn chốt tiêu chí trước khi tranh luận.',
      en: 'In a course project last semester, two teammates disagreed about the direction of our work, which delayed us by almost a week. I suggested a 30-minute meeting where each person compared the options on three criteria: assignment requirements, time and resources. After comparing, the team agreed on the option that best met the requirements. We caught up on schedule, and since then our team agrees on criteria before debating.'
    }
  }
}

// Câu trả lời mẫu cho câu hỏi chuyên môn mới.
export const NEW_MODEL_ANSWERS = {
  m1: {
    vi: 'Marketing xây dựng nhận biết thương hiệu nhằm để nhiều người biết và nhớ đến thương hiệu, thường đo bằng lượt tiếp cận và mức độ ghi nhớ. Performance marketing nhằm tạo hành động ngay như mua hàng hay đăng ký, đo bằng tỷ lệ chuyển đổi và chi phí trên mỗi đơn. Ví dụ, khi ra mắt sản phẩm mới, nên ưu tiên nhận biết để khách hàng biết đến; khi chạy khuyến mãi cuối tháng, nên ưu tiên performance để tạo doanh số. Thực tế hai hướng cần kết hợp, vì nhận biết tốt giúp quảng cáo chuyển đổi rẻ hơn.',
    en: 'Brand awareness marketing aims to make people know and remember the brand, and is usually measured by reach and recall. Performance marketing aims to drive an immediate action such as a purchase or sign-up, and is measured by conversion rate and cost per order. For example, when launching a new product, awareness should come first so customers know it exists; for an end-of-month promotion, performance should come first to drive sales. In practice the two work together, because strong awareness makes performance ads cheaper.'
  },
  m2: {
    vi: 'Trước tiên em xác định mục tiêu chiến dịch, vì mỗi mục tiêu cần chỉ số khác nhau. Với chiến dịch bán hàng, em theo dõi theo từng tầng: lượt tiếp cận để biết quảng cáo đến đúng người chưa, CTR để biết nội dung có hấp dẫn không, chi phí mỗi lượt nhấp, và cuối cùng là tỷ lệ chuyển đổi và ROAS, tức doanh thu trên chi phí quảng cáo. Ví dụ, nếu CTR cao nhưng chuyển đổi thấp, vấn đề có thể nằm ở trang đích chứ không phải quảng cáo. Từ đó em đề xuất điều chỉnh đúng chỗ.',
    en: 'First, I define the campaign goal, because each goal needs different metrics. For a sales campaign, I track metrics at each stage: reach to see whether the ads reach the right people, CTR to see whether the content is attractive, cost per click, and finally conversion rate and ROAS, the revenue generated per unit of ad spend. For example, if CTR is high but conversions are low, the problem is probably the landing page rather than the ad. That way I can recommend changes in the right place.'
  },
  m3: {
    vi: 'Em xin kể về chiến dịch quảng bá cho một tiệm bánh nhỏ trong môn Digital Marketing. Mục tiêu là tăng đơn đặt hàng online trong một tháng. Em phụ trách nội dung và quảng cáo trên Facebook: em khảo sát nhanh 30 khách quen để hiểu họ thích gì, rồi làm loạt video ngắn về quy trình làm bánh. Em thử hai mẫu quảng cáo với ngân sách nhỏ và giữ lại mẫu có CTR cao hơn. Kết quả là đơn online tăng 35%, và em học được giá trị của việc thử nghiệm trước khi tăng ngân sách.',
    en: 'I worked on a campaign for a small bakery in our Digital Marketing course. The goal was to increase online orders within one month. I was responsible for content and Facebook ads: I surveyed 30 regular customers to understand what they liked, then created a series of short videos showing how the cakes were made. I tested two ad versions with a small budget and kept the one with the higher CTR. As a result, online orders grew by 35%, and I learned the value of testing before increasing the budget.'
  },
  m4: {
    vi: 'Đầu tiên em giữ bình tĩnh và xác nhận mức độ lan truyền: bao nhiêu bình luận tiêu cực, đã có trang lớn chia sẻ chưa. Tiếp theo em tạm ẩn bài đăng và tìm nguyên nhân, xem nội dung bị hiểu nhầm hay thực sự có sai sót. Sau đó em đề xuất với cấp trên một phản hồi chân thành, nhận trách nhiệm nếu thương hiệu sai và nêu rõ cách khắc phục. Cuối cùng em theo dõi phản ứng sau khi phản hồi, báo cáo lại và đề xuất bổ sung bước duyệt nội dung để không lặp lại.',
    en: "First, I stay calm and assess how far it has spread: how many negative comments there are and whether large pages have shared it. Next, I hide the post and look for the cause, whether the content was misunderstood or genuinely wrong. Then I propose a sincere response to my manager, taking responsibility if the brand made a mistake and explaining how we will fix it. Finally, I monitor reactions after the response, report back and suggest an extra content review step so it doesn't happen again."
  },
  m5: {
    vi: 'Trước tiên em xác nhận lại với cấp trên mục tiêu quan trọng nhất của chiến dịch, vì với ngân sách ít hơn không thể làm mọi thứ. Sau đó em xem số liệu các chiến dịch trước để giữ lại những kênh có chi phí mỗi kết quả thấp nhất, và cắt hoặc lùi các kênh kém hiệu quả. Em điều chỉnh lại KPI cho phù hợp với ngân sách mới và báo rõ cho cấp trên. Trong lúc chạy, em theo dõi số liệu hằng ngày để dồn tiền vào nội dung đang hiệu quả nhất.',
    en: 'First, I confirm the most important goal of the campaign with my manager, because with less budget we cannot do everything. Then I review data from previous campaigns to keep the channels with the lowest cost per result, and cut or postpone the weaker ones. I adjust the KPIs to match the new budget and communicate them clearly to my manager. During the campaign, I track results daily and shift money to the content that performs best.'
  },
  f1: {
    vi: 'Lợi nhuận được ghi nhận theo nguyên tắc dồn tích, tức doanh thu ghi nhận khi bán hàng dù khách chưa trả tiền. Dòng tiền là số tiền thực thu và thực chi trong kỳ. Ví dụ, một công ty bán chịu 1 tỷ đồng, báo cáo có lãi, nhưng khách hàng ba tháng sau mới trả, trong khi công ty vẫn phải trả lương và nhập hàng ngay. Vì vậy công ty có lãi vẫn có thể thiếu tiền. Để tránh điều này, doanh nghiệp cần quản lý công nợ phải thu, hàng tồn kho và lập kế hoạch dòng tiền.',
    en: 'Profit is recognised on an accrual basis, meaning revenue is recorded when goods are sold even if the customer has not paid yet. Cash flow is the money actually received and paid during the period. For example, a company sells 1 billion VND on credit and reports a profit, but the customer pays three months later, while the company must pay salaries and suppliers now. That is how a profitable company can run out of cash. To avoid this, it needs to manage receivables and inventory and plan its cash flow.'
  },
  f2: {
    vi: 'Ba báo cáo chính là bảng cân đối kế toán, báo cáo kết quả kinh doanh và báo cáo lưu chuyển tiền tệ. Bảng cân đối cho biết tài sản, nợ và vốn chủ sở hữu tại một thời điểm. Báo cáo kết quả kinh doanh cho biết doanh thu, chi phí và lợi nhuận trong kỳ. Báo cáo lưu chuyển tiền tệ cho biết tiền vào, tiền ra từ hoạt động kinh doanh, đầu tư và tài chính. Chúng liên kết với nhau: lợi nhuận sau thuế làm tăng vốn chủ sở hữu trên bảng cân đối, và thay đổi tiền trên báo cáo lưu chuyển tiền tệ khớp với khoản mục tiền trên bảng cân đối.',
    en: 'The three main statements are the balance sheet, the income statement and the cash flow statement. The balance sheet shows assets, liabilities and equity at a point in time. The income statement shows revenue, expenses and profit over a period. The cash flow statement shows cash in and out from operating, investing and financing activities. They are linked: net income increases equity on the balance sheet, and the change in cash on the cash flow statement matches the cash line on the balance sheet.'
  },
  f3: {
    vi: 'Em xin kể về bài phân tích tình hình tài chính của một công ty sữa niêm yết trong môn Phân tích báo cáo tài chính. Mục tiêu là đánh giá công ty có nên đầu tư không. Em phụ trách nhóm chỉ số thanh khoản và hiệu quả hoạt động, dùng Excel tính và so sánh ba năm liên tiếp. Em phát hiện vòng quay hàng tồn kho giảm 15%, nên đề xuất nhóm tìm hiểu thêm nguyên nhân. Kết quả là bài được giảng viên đánh giá cao vì có kết luận dựa trên số liệu, và em học được cách đi từ con số đến câu chuyện kinh doanh.',
    en: 'I analysed the financial position of a listed dairy company in our Financial Statement Analysis course. The goal was to assess whether it was a good investment. I was responsible for the liquidity and efficiency ratios, calculating and comparing three consecutive years in Excel. I found that inventory turnover had fallen by 15%, so I suggested the team investigate the cause. Our lecturer praised the report because its conclusions were based on data, and I learned how to turn numbers into a business story.'
  },
  f4: {
    vi: 'Đầu tiên em khoanh vùng: khoản chênh lệch nằm ở tài khoản nào, phát sinh trong khoảng thời gian nào. Tiếp theo em đối chiếu sổ sách với chứng từ gốc và sao kê ngân hàng để tìm nguyên nhân, ví dụ một hóa đơn bị ghi trùng hoặc ghi nhầm kỳ. Khi tìm ra, em lập bút toán điều chỉnh theo đúng quy định và nhờ trưởng nhóm duyệt, không tự ý sửa số. Cuối cùng em báo cáo nguyên nhân và đề xuất thêm bước kiểm tra chéo để lỗi không lặp lại.',
    en: 'First, I narrow it down: which account the difference sits in and in which period it arose. Next, I reconcile the ledger with the source documents and the bank statement to find the cause, such as a duplicated invoice or an entry in the wrong period. Once I find it, I prepare an adjusting entry according to the rules and ask my team lead to approve it, rather than changing the figures myself. Finally, I report the cause and suggest an extra cross-check so the error does not happen again.'
  },
  f5: {
    vi: 'Trước tiên em hoàn thành ngay những phần báo cáo đã có đủ số liệu để tiết kiệm thời gian. Đồng thời em liên hệ trực tiếp người phụ trách bên phòng kia, nói rõ thời hạn và hỏi chính xác khi nào họ gửi được. Em báo sớm cho quản lý về rủi ro trễ hạn, và đề xuất gửi trước một bản tạm dùng số liệu tháng trước có ghi chú rõ giả định. Khi nhận được số liệu, em cập nhật và kiểm tra lại toàn bộ trước khi gửi bản cuối cùng.',
    en: 'First, I complete the parts of the report for which I already have data, to save time. At the same time, I contact the person responsible in the other department directly, explain the deadline and ask exactly when they can send the data. I inform my manager early about the risk of delay and propose sending a draft based on last month’s figures with the assumptions clearly noted. When the data arrives, I update the report and check everything again before sending the final version.'
  },
  s1: {
    vi: 'Quy trình bán hàng thường gồm: tìm kiếm khách hàng tiềm năng, tiếp cận, tìm hiểu nhu cầu, trình bày giải pháp, xử lý từ chối, chốt đơn và chăm sóc sau bán. Theo em, bước tìm hiểu nhu cầu quan trọng nhất, vì nếu hiểu đúng điều khách cần thì phần trình bày và chốt đơn sẽ dễ hơn nhiều. Ví dụ, khi làm thêm ở cửa hàng điện máy, em luôn hỏi khách dùng máy lạnh cho phòng bao nhiêu mét vuông và ai sử dụng trước khi giới thiệu, nhờ vậy tỷ lệ chốt đơn của em cao hơn mức trung bình của cửa hàng.',
    en: "The sales process usually includes prospecting, approaching the customer, discovering needs, presenting the solution, handling objections, closing and after-sales follow-up. I think needs discovery matters most, because when you understand what the customer really needs, presenting and closing become much easier. For example, in my part-time job at an electronics store, I always asked about the room size and who would use the air conditioner before recommending one, and my closing rate was higher than the store's average."
  },
  s2: {
    vi: 'Tỷ lệ chuyển đổi là tỷ lệ khách hàng tiềm năng trở thành khách hàng thực sự, ví dụ 100 người được tư vấn có 20 người mua thì tỷ lệ là 20%. Giá trị vòng đời khách hàng là tổng doanh thu một khách hàng mang lại trong suốt thời gian gắn bó. Ví dụ một đại lý mỗi tháng nhập 10 triệu đồng và gắn bó ba năm thì giá trị vòng đời khoảng 360 triệu đồng. Hai chỉ số này giúp người bán biết cần tiếp cận bao nhiêu khách để đạt chỉ tiêu, và hiểu vì sao chăm sóc khách hàng cũ cũng quan trọng như tìm khách mới.',
    en: 'Conversion rate is the share of prospects who become actual customers: if 20 out of 100 people you consult buy, the rate is 20%. Customer lifetime value is the total revenue a customer brings during the whole relationship. For example, a retailer that orders 10 million VND per month for three years is worth about 360 million VND. These metrics help a salesperson know how many prospects are needed to hit a target, and understand why keeping existing customers matters as much as finding new ones.'
  },
  s3: {
    vi: 'Năm ba, câu lạc bộ của em cần thuyết phục một quán cà phê tài trợ địa điểm cho sự kiện 200 người. Em phụ trách liên hệ. Thay vì xin tài trợ ngay, em hỏi chủ quán điều họ cần nhất và biết họ muốn tăng khách vào buổi tối. Em đề xuất tổ chức sự kiện vào tối thứ Bảy, in logo quán trên tài liệu và giới thiệu thực đơn cho người tham dự. Kết quả là quán đồng ý tài trợ miễn phí, doanh thu tối đó tăng gấp đôi, và họ mời câu lạc bộ hợp tác tiếp.',
    en: "In my third year, my club needed a coffee shop to sponsor the venue for a 200-person event, and I was responsible for contacting them. Instead of asking for sponsorship straight away, I asked the owner what they needed most and learned they wanted more evening customers. I proposed holding the event on a Saturday evening, printing their logo on our materials and promoting their menu to attendees. As a result, they sponsored the venue for free, their revenue that evening doubled, and they invited our club to work together again."
  },
  s4: {
    vi: 'Đầu tiên em lắng nghe để khách nói hết, xác nhận lại vấn đề và xin lỗi vì sự bất tiện, không đổ lỗi hay tranh cãi. Tiếp theo em kiểm tra ngay với bộ phận giao hàng để biết nguyên nhân và thời gian giao chính xác. Sau đó em gọi lại khách trong ngày với giải pháp cụ thể: thời hạn giao mới, và nếu được cấp trên đồng ý, một ưu đãi cho đơn hàng sau để bù đắp. Cuối cùng em theo dõi đến khi khách nhận đủ hàng, báo cáo cấp trên và đề xuất cải thiện khâu giao hàng.',
    en: 'First, I listen and let the customer finish, confirm the problem and apologise for the inconvenience, without blaming anyone or arguing. Next, I check with the delivery team right away to find the cause and the exact delivery time. Then I call the customer back the same day with a concrete solution: a new delivery date and, with my manager’s approval, a discount on the next order to make up for it. Finally, I follow up until the goods arrive, report to my manager and suggest improvements to the delivery process.'
  },
  s5: {
    vi: 'Đầu tiên em rà soát lại danh sách khách hàng đang trong quá trình chốt, ưu tiên những khách có khả năng mua cao và giá trị đơn lớn. Em gọi lại các khách hàng cũ có nhu cầu định kỳ để đề xuất nhập hàng sớm. Nếu cần, em xin trưởng nhóm hỗ trợ một chương trình khuyến mãi ngắn hạn hoặc cùng đi gặp khách hàng lớn. Sau tháng đó, em rút kinh nghiệm bằng cách chia chỉ tiêu theo tuần và theo dõi hằng tuần để không bị dồn vào cuối tháng.',
    en: 'First, I review my pipeline and prioritise the deals that are most likely to close and have the highest value. I call existing customers with regular needs and suggest they place their next order early. If needed, I ask my team lead for a short-term promotion or to join me in meeting a key customer. Afterwards, I learn from it by splitting my target into weekly goals and tracking them every week, so I am not rushing at the end of the month.'
  }
}

Object.assign(MODEL_ANSWERS, NEW_MODEL_ANSWERS)

// ---------- Tra cứu theo ngành ----------
export const DEFAULT_CAREER = 'it'

export const careerById = (id) => CAREERS.find((c) => c.id === id) || CAREERS[0]
export const careerOf = (companyId) => COMPANIES.find((c) => c.id === companyId)?.career || DEFAULT_CAREER
export const companiesOf = (careerId) => COMPANIES.filter((c) => c.career === careerId)

// 'specialist' → người phỏng vấn chuyên môn của ngành.
export const resolvePersona = (key, careerId) => (key === 'specialist' ? careerById(careerId).specialist : key)
export const defaultPersonaOf = (topic, careerId) => resolvePersona(topic.defaultPersona, careerId)
export const personasOf = (careerId) => ['hr', careerById(careerId).specialist, 'manager'].map((id) => PERSONAS[id])

const byCareer = (value, careerId) => (value && !Array.isArray(value) && typeof value === 'object' ? value[careerId] || value[DEFAULT_CAREER] : value)
export const stageIds = (stage, careerId) => byCareer(stage.ids, careerId)
export const stageName = (stage, careerId) => byCareer(stage.name, careerId)

export const lessonFor = (topicId, careerId) => {
  const lesson = LESSONS[topicId]
  return lesson.blocks ? lesson : lesson[careerId] || lesson[DEFAULT_CAREER]
}

// Câu trả lời mẫu: ưu tiên bản theo ngành, rồi bản trung tính (ngoài IT), rồi bản chung.
export function modelAnswerFor(id, careerId, lang, companyName = '') {
  const variants = BEHAVIOR_BY_CAREER[id]
  const entry = variants?.[careerId] || (careerId !== DEFAULT_CAREER && variants?.default) || MODEL_ANSWERS[id]
  return (entry?.[lang] || '').replaceAll('{company}', companyName)
}

// Câu hỏi xuất hiện ở chủ đề nào của một ngành.
export const topicsOfQuestion = (id, careerId) =>
  TOPICS.filter((t) => t.stages.some((s) => (stageIds(s, careerId) || []).includes(id)) || (id.startsWith('sc') && t.situationChange)).map((t) => t.id)
