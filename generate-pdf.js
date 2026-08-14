import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'Thota_Leela_Sai_Krishna_Resume.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: {
    top: 36,
    bottom: 36,
    left: 45,
    right: 45
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Primary and Secondary PDF Colors
const COLOR_PRIMARY = '#000000';
const COLOR_SECONDARY = '#222222';
const COLOR_LINK = '#0000EE';
const COLOR_BORDER = '#111111';

// Section Title Drawer
function addSectionHeader(title) {
  doc.moveDown(0.5);
  doc.x = 45; // Ensure text alignment always snaps back to left margin
  
  // Section text
  doc.fillColor(COLOR_PRIMARY)
     .font('Helvetica-Bold')
     .fontSize(10.5)
     .text(title.toUpperCase(), { characterSpacing: 0.8 });
  
  doc.moveDown(0.15);
  doc.x = 45;
  
  // Clean solid divider rule
  const currentY = doc.y;
  doc.strokeColor(COLOR_BORDER)
     .lineWidth(0.75)
     .moveTo(45, currentY)
     .lineTo(550, currentY)
     .stroke();
  
  doc.moveDown(0.35);
  doc.x = 45;
}

// Draw Header Name & Contact Info
doc.fillColor(COLOR_PRIMARY)
   .font('Helvetica-Bold')
   .fontSize(21)
   .text('Thota Leela Sai Krishna', { align: 'center' });

doc.moveDown(0.15);

doc.fillColor(COLOR_SECONDARY)
   .font('Helvetica')
   .fontSize(9.5);

doc.text('Phone: +91-7013875338', { align: 'center' });
doc.text('Email: thotaleelasaikrishna@email.com', { align: 'center' });
doc.text('Tadepalligudem, Andhra Pradesh, India, 534196', { align: 'center' });

doc.moveDown(0.15);

// Header Links Row
const headerLinks = [
  { text: 'LinkedIn', url: 'https://www.linkedin.com/in/thota-leela-sai-krishna-8003a6292' },
  { text: 'Github', url: 'https://github.com/Leela-sai-krishna-Thota' },
  { text: 'LeetCode', url: 'https://leetcode.com/u/Leela_338/' },
  { text: 'Portfolio', url: 'https://sports-oe7v.onrender.com' }
];

const headerY = doc.y;
doc.fontSize(9.5).font('Helvetica');

let startX = 175;
headerLinks.forEach((l, idx) => {
  doc.fillColor(COLOR_PRIMARY)
     .text(l.text, startX, headerY, { link: l.url, underline: true });
  
  startX += doc.widthOfString(l.text) + 6;
  if (idx < headerLinks.length - 1) {
    doc.fillColor(COLOR_PRIMARY)
       .text(' ', startX, headerY, { underline: false });
    startX += doc.widthOfString(' ') + 4;
  }
});

doc.moveDown(0.5);
doc.x = 45;

// ==================== SECTION: SUMMARY ====================
addSectionHeader('Summary');
doc.fillColor(COLOR_SECONDARY)
   .font('Helvetica')
   .fontSize(9.2)
   .text(
     'Full-Stack Developer (MERN) with hands-on experience building and shipping production-ready web applications. Proficient in JWT authentication, REST APIs, MongoDB Atlas, and Gemini API integration. Passionate about solving real-world problems through clean, scalable code from AI-powered health tools to live sports platforms. Pursuing B.Tech in CSE (CGPA: 9.03) at Vishnu Institute of Technology.',
     { align: 'justify', lineGap: 1.8 }
   );

// ==================== SECTION: TECHNICAL SKILLS ====================
addSectionHeader('Technical Skills');
const skills = [
  { label: 'Programming:', val: 'Java, C' },
  { label: 'Frontend:', val: 'React.js, HTML5, CSS3, Responsive web Design' },
  { label: 'Backend Databases:', val: 'Node.js, Express.js, REST APIs, MongoDB, Firebase Authentication, SQL' },
  { label: 'Tools:', val: 'Git, GitHub, Postman' },
  { label: 'Core CS', val: 'DSA, DBMS, OS, CN, OOPS' }
];

skills.forEach(s => {
  if (s.label === 'Core CS') {
    doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.2).text(s.label + ' ', { continued: true })
       .fillColor(COLOR_SECONDARY).font('Helvetica').text(s.val, { lineGap: 1.5 });
  } else {
    doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.2).text(s.label + ' ', { continued: true })
       .fillColor(COLOR_SECONDARY).font('Helvetica').text(s.val, { lineGap: 1.5 });
  }
});

// ==================== SECTION: PROJECTS ====================
addSectionHeader('Projects');

// Project 1
const p1Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Sports Scheduler Platform (MERN Stack) ', 45, p1Y, { continued: true });
doc.fillColor(COLOR_PRIMARY).font('Helvetica').fontSize(9.5).text('Link', { link: 'https://sports-oe7v.onrender.com', underline: true });
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').text('NOV 2025', 470, p1Y, { align: 'right' });

doc.moveDown(0.2);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const p1Bullets = [
  'Engineered a full-stack Sports Scheduler using the MERN stack, enabling real-time event creation.',
  'Architected JWT-based authentication with role-specific dashboards for Admin and Player workflows.',
  'Designed admin and player interfaces with live match search, event management, and role-based access.',
  'Deployed MongoDB Atlas for cloud-native data management, ensuring scalable and reliable storage.'
];
p1Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.5, width: 490 });
});

doc.moveDown(0.4);

// Project 2
const p2Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('NANOHEAL–AI Medical Assistant Chatbot (SIH 2025) ', 45, p2Y, { continued: true });
doc.fillColor(COLOR_PRIMARY).font('Helvetica').fontSize(9.5).text('Link', { link: 'https://spendwise-urqo.onrender.com', underline: true });

doc.moveDown(0.2);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const p2Bullets = [
  'Ranked Top 50 out of 230 teams in the SIH 2025 internal screening round.',
  'Integrated Gemini API into a MERN stack application to deliver real-time, symptom-based health guidance.',
  'Prioritised health accessibility and privacy-first architecture in system design decisions.'
];
p2Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.5, width: 490 });
});

// ==================== SECTION: EXPERIENCES ====================
addSectionHeader('Experiences');

// Experience 1
const e1Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Web Development Intern - CoderOne ', 45, e1Y, { continued: true });
doc.fillColor(COLOR_PRIMARY).font('Helvetica').fontSize(9.5).text('Link', { link: 'https://github.com/Leela-sai-krishna-Thota', underline: true });
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').text('DEC 2024 - FEB 2025', 470, e1Y, { align: 'right' });

doc.moveDown(0.2);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const e1Bullets = [
  'Delivered a full-stack Feedback Collection System across the complete development lifecycle, from UI to Firestore integration, using HTML, CSS, JS, Node.js, and Express.js.',
  'Implemented secure authentication and end-to-end data flow for reliable feedback submission.',
  'Completed a 3-month internship within scope and timeline, earning an official certification from CoderOne.'
];
e1Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.5, width: 490 });
});

doc.moveDown(0.4);

// Experience 2
const e2Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Team Leader at Forever Living Products (Wellness Industry)', 45, e2Y);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').text('OCT 2025 - MAR 2026', 470, e2Y, { align: 'right' });

doc.moveDown(0.2);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const e2Bullets = [
  'Successfully generated a turnover of 2Lakhs+ in 6 months of business.',
  'Led team outreach and digital marketing strategies, achieving conversion rates.',
  'Managed client relationships end-to-end, maintaining high engagement and securing repeat conversions.'
];
e2Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.5, width: 490 });
});

// ==================== SECTION: EDUCATION ====================
addSectionHeader('Education');

// Edu 1
const ed1Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Vishnu Institute of Technology', 45, ed1Y);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').text('2023 – 2027', 470, ed1Y, { align: 'right' });

doc.font('Helvetica').fontSize(9.0);
doc.fillColor(COLOR_SECONDARY).text('B.Tech in Computer Science and Engineering', 45, doc.y, { continued: true });
doc.fillColor(COLOR_PRIMARY).font('Helvetica').text('                                CGPA: 9.03/10', { align: 'left' });

doc.moveDown(0.3);

// Edu 2
const ed2Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Aditya junior college', 45, ed2Y);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').text('2021 – 2023', 470, ed2Y, { align: 'right' });

doc.font('Helvetica').fontSize(9.0);
doc.fillColor(COLOR_SECONDARY).text('Intermediate(MPC)', 45, doc.y, { continued: true });
doc.fillColor(COLOR_PRIMARY).font('Helvetica').text('                                                  MARKS: 977/1000', { align: 'left' });

// ==================== SECTION: ACHIEVEMENTS ====================
addSectionHeader('Achievements');

// Ach 1
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
doc.text('•  Placed Runner-up at Pivot Hackathon built and shipped a full-stack solution under time constraints. ', 55, doc.y, { continued: true, width: 490 });
doc.fillColor(COLOR_PRIMARY).text('Link', { link: 'https://github.com/Leela-sai-krishna-Thota', underline: true });

doc.moveDown(0.15);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
doc.text('•  Designed and delivered a Git & GitHub workshop for 65+ students, formally recognised by the CSE.', 55, doc.y, { width: 490 });

doc.moveDown(0.15);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
doc.text('•  Full Stack Web Development Certification Vishnu Vedic Institute (NOV 2025). ', 55, doc.y, { continued: true, width: 490 });
doc.fillColor(COLOR_PRIMARY).text('Link', { link: 'https://github.com/Leela-sai-krishna-Thota', underline: true });

// Finalize stream
doc.end();
console.log('PDF Compiled successfully to: ' + outputPath);
