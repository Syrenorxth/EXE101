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
    vi: 'Em là Minh, sinh viên năm ba ngành Kỹ thuật phần mềm. Thế mạnh của em là backend: trong đồ án quản lý thư viện ở học kỳ 5, em phụ trách thiết kế cơ sở dữ liệu và viết 12 API bằng Spring Boot, giúp nhóm hoàn thành sớm một tuần. Ngoài giờ học, em đang tự học Docker qua một dự án cá nhân nhỏ. Em ứng tuyển vị trí này vì muốn được làm việc với sản phẩm có người dùng thật và học cách làm việc theo quy trình chuyên nghiệp.',
    en: "I'm Minh, a third-year Software Engineering student. My strongest area is backend development: in our library management project last semester, I designed the database and built 12 REST APIs with Spring Boot, which helped the team finish a week early. Outside class, I'm learning Docker through a small personal project. I'm applying for this position because I want to work on a product with real users and learn how a professional team works."
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
    vi: 'Em đã tìm hiểu về {company} và thấy công ty đang phát triển những sản phẩm phần mềm có người dùng thật, đúng định hướng em muốn theo. Em có kinh nghiệm backend với Spring Boot qua hai đồ án ở trường, phù hợp với yêu cầu của vị trí này. Ở {company}, em mong học được cách làm việc theo quy trình chuyên nghiệp, cách review code và cách xây dựng tính năng từ yêu cầu thật của khách hàng.',
    en: 'I researched {company} and saw that you build software products with real users, which is the direction I want to grow in. I have backend experience with Spring Boot from two university projects, which fits the requirements of this role. At {company}, I hope to learn professional workflows, code review, and how to build features from real customer requirements.'
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
