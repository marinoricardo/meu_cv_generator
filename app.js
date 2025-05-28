const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

function generatePremiumCVHtml(data) {
    return `
  <!DOCTYPE html>
  <html lang="pt">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Currículo - ${data.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
    body {
      font-family: 'Montserrat', sans-serif;
      max-width: 900px;
      color: #222;
    }
    header {
      border-bottom: 3px solid #264653;
      padding-bottom: 15px;
      margin-bottom: 35px;
    }
    header h1 {
      font-weight: 700;
      font-size: 44px;
      color: #264653;
      margin: 0 0 5px 0;
    }
    header h2 {
      font-weight: 600;
      font-size: 20px;
      color: #2a9d8f;
      margin: 0;
      letter-spacing: 1.1px;
    }
    section {
      margin-bottom: 40px;
    }
    .section-title {
      font-weight: 700;
      font-size: 18px;
      color: #264653;
      border-left: 6px solid #e76f51;
      padding-left: 12px;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1.3px;
    }
    .profile-text {
      font-size: 16px;
      line-height: 1.65;
      color: #444;
    }
    .experience-item {
      margin-bottom: 22px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ddd;
    }
    .experience-title {
      font-weight: 600;
      font-size: 18px;
      color: #264653;
      margin: 0;
    }
    .experience-company {
      font-style: italic;
      font-size: 14px;
      color: #6c757d;
      margin-bottom: 8px;
    }
    .experience-period {
      font-size: 13px;
      color: #999;
      margin-bottom: 8px;
    }
    .experience-desc {
      font-size: 15px;
      color: #444;
    }
    ul.skills-list, ul.languages-list {
      list-style: none;
      padding-left: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    ul.skills-list li, ul.languages-list li {
      font-size: 14px;
      color: #264653;
      background: none;
      padding: 0;
      border-radius: 0;
      box-shadow: none;
      font-weight: 500;
    }
    .two-columns {
      display: flex;
      gap: 40px;
      flex-wrap: wrap;
    }
    .column {
      flex: 1;
      min-width: 280px;
    }
    .education-item {
      margin-bottom: 15px;
    }
    .education-degree {
      font-weight: 700;
      font-size: 17px;
      color: #264653;
    }
    .education-institution {
      font-style: italic;
      font-size: 14px;
      color: #6c757d;
      margin-bottom: 5px;
    }
    .education-period {
      font-size: 13px;
      color: #999;
    }
    .contact-list p {
      margin: 6px 0;
      font-size: 14px;
      color: #444;
    }
    .contact-list a {
      color: #2a9d8f;
      text-decoration: none;
    }
    .contact-list a:hover {
      text-decoration: underline;
    }
  </style>
  </head>
  <body>
  
  <header>
    <h1>${data.name}</h1>
    <h2>${data.profession}</h2>
  </header>
  
  <section>
    <div class="section-title">Perfil Profissional</div>
    <p class="profile-text">${data.profile}</p>
  </section>
  
  <section>
    <div class="section-title">Experiência Profissional</div>
    ${data.experiences.map(exp => `
      <div class="experience-item">
        <h3 class="experience-title">${exp.title}</h3>
        <div class="experience-company">${exp.company}</div>
        <div class="experience-period">${exp.period}</div>
        <p class="experience-desc">${exp.description}</p>
      </div>
    `).join('')}
  </section>
  
  <section>
    <div class="section-title">Habilidades Técnicas</div>
    <ul class="skills-list">
      ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
    </ul>
  </section>
  
  <section class="two-columns">
    <div class="column">
      <div class="section-title">Idiomas</div>
      <ul class="languages-list">
        ${data.languages.map(lang => `<li>${lang.name} — ${lang.level}</li>`).join('')}
      </ul>
    </div>
  
    <div class="column">
      <div class="section-title">Formação Acadêmica</div>
      <div class="education-item">
        <div class="education-degree">${data.education.degree}</div>
        <div class="education-institution">${data.education.institution}</div>
        <div class="education-period">${data.education.period}</div>
      </div>
  
      <div class="section-title">Contato</div>
      <div class="contact-list">
        <p>Email: <a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
        <p>Telefone: ${data.contact.phone}</p>
        <p>LinkedIn: <a href="${data.contact.linkedin}" target="_blank">${data.contact.linkedin}</a></p>
      </div>
    </div>
  </section>
  
  </body>
  </html>
    `;
}
  
  
  

app.post('/generate-pdf', async (req, res) => {
  const data = req.body;

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const html = generatePremiumCVHtml(data);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const filename = `cv_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, 'pdfs');

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    const fullPath = path.join(filePath, filename);

    await page.pdf({
      path: fullPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });

    await browser.close();

    const downloadUrl = `${req.protocol}://${req.get('host')}/pdfs/${filename}`;
    res.json({ url: downloadUrl });

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
});

app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
