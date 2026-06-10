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
    top: 40,
    bottom: 40,
    left: 45,
    right: 45
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Primary and Secondary PDF Colors
const COLOR_PRIMARY = '#111827';   // Gray 900
const COLOR_SECONDARY = '#374151'; // Gray 700
const COLOR_LINK = '#2563eb';      // Indigo Link
const COLOR_BORDER = '#e5e7eb';    // Light divider line

// Section Title Drawer
function addSectionHeader(title) {
  doc.moveDown(0.7);
  doc.x = 45; // Ensure text alignment always snaps back to left margin
  
  // Section text
  doc.fillColor(COLOR_PRIMARY)
     .font('Helvetica-Bold')
     .fontSize(10.5)
     .text(title.toUpperCase(), { characterSpacing: 0.8 });
  
  doc.moveDown(0.2);
  doc.x = 45; // Guard alignment for stroke line mapping
  
  // Clean solid divider rule
  const currentY = doc.y;
  doc.strokeColor(COLOR_BORDER)
     .lineWidth(1)
     .moveTo(45, currentY)
     .lineTo(550, currentY)
     .stroke();
  
  doc.moveDown(0.4);
  doc.x = 45; // Retain standard left padding bounding box for subsequent text runs
}

// Draw Contact Detail Items
doc.fillColor(COLOR_PRIMARY)
   .font('Helvetica-Bold')
   .fontSize(22)
   .text('Thota Leela sai krishna', { align: 'center', characterSpacing: 0.5 });

doc.moveDown(0.15);

doc.fillColor(COLOR_SECONDARY)
   .font('Helvetica')
   .fontSize(9.5);

const contactText = 'Phone: +91-7013875338  |  Email: thotaleelasaikrishna@gmail.com  |  Tadepalligudem, AP, India, 534196';
doc.text(contactText, { align: 'center' });

doc.moveDown(0.2);

// Center-aligned Social Links Row (Underline, Interactive)
const linkY = doc.y;
doc.fontSize(9.5).font('Helvetica-Bold');

const links = [
  { text: 'LinkedIn', url: 'https://www.linkedin.com/in/thota-leela-sai-krishna-8003a6292' },
  { text: 'GitHub', url: 'https://github.com/Leela-sai-krishna-Thota' },
  { text: 'LeetCode', url: 'https://leetcode.com/u/Leela_338/' }
];

let currentX = 180; // Estimate center x starting point
links.forEach((l, idx) => {
  doc.fillColor(COLOR_LINK)
     .text(l.text, currentX, linkY, { link: l.url, underline: true });
  
  currentX += doc.widthOfString(l.text) + 8;
  if (idx < links.length - 1) {
    doc.fillColor(COLOR_SECONDARY)
       .font('Helvetica')
       .text(' | ', currentX, linkY, { underline: false });
    currentX += doc.widthOfString(' | ') + 8;
  }
});

// Restore normal text flow below header
doc.moveDown(0.6);
doc.x = 45; // Reset horizontal coordinates following absolute link positions
doc.font('Helvetica').fontSize(9.5);

// ==================== SECTION: SUMMARY ====================
addSectionHeader('Summary');
doc.fillColor(COLOR_SECONDARY)
   .font('Helvetica')
   .fontSize(9.2)
   .text(
     'Full-Stack Developer (MERN) with hands-on experience building and shipping production-ready web applications. Proficient in JWT authentication, REST APIs, MongoDB Atlas, and Gemini API integration. Passionate about solving real-world problems through clean, scalable code from AI-powered health tools to live sports platforms. Pursuing B.Tech in CSE (CGPA: 9.03) at Vishnu Institute of Technology.',
     { align: 'justify', lineGap: 2.2 }
   );

// ==================== SECTION: TECHNICAL SKILLS ====================
addSectionHeader('Technical Skills');
const skills = [
  { label: 'Programming:', val: 'JavaScript (ES6+), Java' },
  { label: 'Frontend:', val: 'React.js, HTML5, CSS3, Responsive Web Design' },
  { label: 'Backend:', val: 'Node.js, Express.js, REST APIs, JWT Authentication' },
  { label: 'Databases:', val: 'MongoDB, Firebase, SQL' },
  { label: 'Tools:', val: 'Git, GitHub, Postman, N8N, Gemini API' }
];

skills.forEach(s => {
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.2).text(s.label + ' ', { continued: true })
     .fillColor(COLOR_SECONDARY).font('Helvetica').text(s.val, { lineGap: 1.8 });
});

// ==================== SECTION: PROJECTS ====================
addSectionHeader('Projects');

// Project 1
const p1Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Sports Scheduler Platform (MERN Stack)', 45, p1Y);

// Align Date to Right Margin
doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').text('NOV 2025', 470, p1Y, { align: 'right' });

doc.moveDown(0.25);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const p1Bullets = [
  'Engineered a full-stack Sports Scheduler using the MERN stack, enabling real-time event creation.',
  'Architected JWT-based authentication with role-specific dashboards for Admin and Player workflows.',
  'Designed admin and player interfaces with live match search, event management, and role-based access.',
  'Deployed MongoDB Atlas for cloud-native data management, ensuring scalable and reliable storage.'
];
p1Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.8, width: 490 });
});

doc.moveDown(0.5);

// Project 2
const p2Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('AI Code & Smart Contract Auditor', 45, p2Y);

doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').text('DEC 2024', 470, p2Y, { align: 'right' });

doc.moveDown(0.25);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const p2Bullets = [
  'Engineered an automated code auditor combining React, Express, and Gemini API to scan codebase structures.',
  'Built sandbox processing pipelines to parse source files safely and detect structural or security vulnerabilities.',
  'Formulated structured JSON linting reports enabling instant warnings, feedback, and optimization action items.'
];
p2Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.8, width: 490 });
});

doc.moveDown(0.5);

// Project 3
const p3Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('AI Resume Analyzer & ATS Optimizer', 45, p3Y);

doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').text('FEB 2025', 470, p3Y, { align: 'right' });

doc.moveDown(0.25);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const p3Bullets = [
  'Developed a SaaS application leveraging Gemini-Pro to compute semantic similarity matching for jobs.',
  'Structured an automated ATS scoring engine that gauges keyword-density and recommends critical keyword enhancements.',
  'Integrated interactive Recharts dashboarding and PDF download capabilities for active review processing.'
];
p3Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.8, width: 490 });
});

// ==================== SECTION: EXPERIENCES ====================
addSectionHeader('Experiences');

// Experience 1
const e1Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Web Development Intern - CoderOne', 45, e1Y);

doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').text('DEC 2024 - FEB 2025', 470, e1Y, { align: 'right' });

doc.moveDown(0.25);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const e1Bullets = [
  'Delivered production-ready web application features across the complete development lifecycle using HTML, CSS, React, Node.js, and Express.js.',
  'Implemented secure authentication, REST APIs, and end-to-end data flow architectures for reliable application submission.',
  'Completed a 3-month internship within scope and timeline, earning an official certification from CoderOne.'
];
e1Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.8, width: 490 });
});

doc.moveDown(0.5);

// Experience 2
const e2Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Team Leader at Forever Living Products (Wellness Industry)', 45, e2Y);
doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').text('OCT 2025 - MAR 2026', 470, e2Y, { align: 'right' });

doc.moveDown(0.25);
doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
const e2Bullets = [
  'Successfully generated a turnover of 3Lakhs+ in 6 months of business.',
  'Led team outreach and digital marketing strategies, achieving high conversion rates.',
  'Managed client relationships end-to-end, maintaining high engagement and securing repeat conversions.'
];
e2Bullets.forEach(b => {
  doc.text('•  ' + b, 55, doc.y, { lineGap: 1.8, width: 490 });
});

// ==================== SECTION: EDUCATION ====================
addSectionHeader('Education');

// Edu 1
const ed1Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Vishnu Institute of Technology', 45, ed1Y);
doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').text('2023 - 2027', 470, ed1Y, { align: 'right' });

doc.font('Helvetica').fontSize(9.0);
doc.text('B.Tech in Computer Science and Engineering', 45, doc.y, { continued: true });
doc.font('Helvetica-Bold').text('  |  CGPA: 9.03 / 10.0', { align: 'left' });

doc.moveDown(0.4);

// Edu 2
const ed2Y = doc.y;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text('Aditya Junior College', 45, ed2Y);
doc.fillColor(COLOR_SECONDARY).font('Helvetica-Bold').text('2021 - 2023', 470, ed2Y, { align: 'right' });

doc.font('Helvetica').fontSize(9.0);
doc.text('Intermediate (MPC)', 45, doc.y, { continued: true });
doc.font('Helvetica-Bold').text('  |  MARKS: 977 / 1000', { align: 'left' });

// ==================== SECTION: ACHIEVEMENTS ====================
addSectionHeader('Achievements');
const achs = [
  { text: 'Placed Runner-up at Pivot Hackathon, built and shipped a full-stack solution under tight constraints.' },
  { text: 'Designed and delivered a Git & GitHub workshop for 65+ students, formally recognised by the CSE department.' },
  { text: 'Attained Diamond Level (Top 3) nationally as Campus Ambassador at Emertxe.' }
];

doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(9.0);
achs.forEach(a => {
  doc.fillColor(COLOR_SECONDARY).font('Helvetica').text('•  ' + a.text);
  doc.moveDown(0.15);
});

// Finalize stream
doc.end();
console.log('PDF Compiled successfully to: ' + outputPath);
