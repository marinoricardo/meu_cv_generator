const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());



function generatePremiumCVModelo1(data) {
  const pd = (data && data.personalData) ? data.personalData : {};
  const competences = Array.isArray(data && data.competences) ? data.competences : [];
  const education = Array.isArray(data && data.education) ? data.education : [];
  const languages = Array.isArray(data && data.languages) ? data.languages : [];
  const experience = Array.isArray(data && data.professional_experience) ? data.professional_experience : [];

  const esc = (v) => (v === undefined || v === null) ? '' : String(v);

  const experienceHtml = experience.map(exp => `
                      <div class="border-l-2 border-gray-300 pl-4">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${esc(exp.profissao || '')}</h3>
                            <p class="text-gray-700 font-medium">${esc(exp.empresa || '')}</p>
                        </div>
                        <span class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">${esc(exp.ano_inicio || '')} - ${esc(exp.ano_fim || '')}</span>
                    </div>
                    <p class="text-gray-700">${esc(exp.descricao || '')}</p>
                </div>`).join('\n');


  return `<p<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Curriculum Vitae</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
        }
        
        @media print {
            body { font-size: 12pt; }
            .page-break { page-break-after: always; }
            .no-print { display: none; }
            .container { max-width: none; margin: 0; padding: 10px; }
        }
  
    </style>
</head>
<body class="bg-white text-gray-900">
    <div class="container max-w-4xl mx-auto p-8 bg-white shadow-lg">
        
        <!-- Cabeçalho -->
        <header class="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <!-- Foto -->
            <div class="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <!-- Para usar sua própria foto, substitua o SVG acima por: -->
                <img src="${esc(pd.photo || 'https://via.placeholder.com/300')}" alt="${esc(pd.fullName || '')}" class="w-full h-full object-cover"> 
            </div>
            <h1 class="text-3xl font-bold mb-2 text-gray-900">${esc(pd.fullName || '')}</h1>
            <p class="text-lg text-gray-700 mb-4">${esc(pd.profession || '')}</p>
            <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span>${esc(pd.email || '')}</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm1 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <span>${esc(pd.cellphone || '')}</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                    <span>${esc(pd.location || '')}</span>
                </div>
            </div>
        </header>

        <!-- Perfil Profissional -->
        <section class="mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 section-divider">PERFIL PROFISSIONAL</h2>
            <p class="text-gray-700 leading-relaxed">
                ${esc(pd.profile || '')}
            </p>
        </section>

        <!-- Experiência Profissional -->
        <section class="mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 section-divider">EXPERIÊNCIA PROFISSIONAL</h2>
            
            <div class="space-y-6">
                <!-- Experiência 1 -->
                ${experienceHtml || '<p class="text-gray-600">Sem experiência adicionada.</p>'}
            </div>
        </section>

        <!-- Formação Académica -->
        <section class="mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 section-divider">FORMAÇÃO ACADÉMICA</h2>
            <div class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Licenciatura em Engenharia Informática</h3>
                        <p class="text-gray-700">Engenharia de Software</p>
                        <p class="text-gray-600">Universidade Eduardo Mondlane, Maputo</p>
                    </div>
                    <span class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">2015 - 2019</span>
                </div>
                
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Curso Técnico de Informática</h3>
                        <p class="text-gray-700">Gestão de Sistemas e Redes</p>
                        <p class="text-gray-600">Instituto Industrial e Comercial de Maputo</p>
                    </div>
                    <span class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">2012 - 2014</span>
                </div>
            </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Competências -->
            <section class="mb-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-900 section-divider">COMPETÊNCIAS</h2>
                
                <div class="mb-4">
                    <!-- <h3 class="font-semibold text-gray-800 mb-2">Competências Técnicas</h3> -->
                    <ul class="text-gray-700 space-y-1 text-sm">
                        <li>• [Competência técnica 1]</li>
                        <li>• [Competência técnica 2]</li>
                        <li>• [Competência técnica 3]</li>
                        <li>• [Competência técnica 4]</li>
                        <li>• [Competência técnica 5]</li>
                    </ul>
                </div>
            </section>


        </div>

        <!-- Certificações 
        <section class="mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 section-divider">CERTIFICAÇÕES E FORMAÇÕES COMPLEMENTARES</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="text-sm">
                    <h3 class="font-semibold text-gray-800">AWS Solutions Architect Associate</h3>
                    <p class="text-gray-600">Amazon Web Services - 2023</p>
                </div>
                <div class="text-sm">
                    <h3 class="font-semibold text-gray-800">Professional Scrum Master I</h3>
                    <p class="text-gray-600">Scrum.org - 2022</p>
                </div>
                <div class="text-sm">
                    <h3 class="font-semibold text-gray-800">React Developer Professional</h3>
                    <p class="text-gray-600">Meta (Facebook) - 40h - 2021</p>
                </div>
                <div class="text-sm">
                    <h3 class="font-semibold text-gray-800">JavaScript ES6+ Complete Course</h3>
                    <p class="text-gray-600">Udemy - 60h - 2020</p>
                </div>
            </div>
        </section>

        -->

        <!-- Projetos ou Realizações (Opcional) 
        <section class="mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 section-divider">PROJETOS RELEVANTES</h2>
            <div class="space-y-4">
                <div>
                    <h3 class="font-semibold text-gray-800">Sistema de Gestão Bancária</h3>
                    <p class="text-sm text-gray-600 mb-1">TechSolutions Moçambique - 2023</p>
                    <p class="text-gray-700 text-sm">Plataforma completa de internet banking com módulos de transferências, pagamentos e gestão de contas. Desenvolvida com React, Node.js e PostgreSQL, servindo mais de 10,000 utilizadores ativos.</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800">E-Commerce Multicategoria</h3>
                    <p class="text-sm text-gray-600 mb-1">Projeto Pessoal - 2022</p>
                    <p class="text-gray-700 text-sm">Marketplace online com sistema de pagamentos integrado (M-Pesa), gestão de inventário e painel administrativo. Tecnologias: Next.js, Stripe API, MongoDB.</p>
                </div>
            </div>
        </section>
        -->

    </div>
</body>
</html>`;
}


function generatePremiumCVModelo2(data) {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { margin: 0; }
    html, body { margin: 0; height: 100%; font-family: 'Poppins', sans-serif; background: white; color: #333; }
    .accent { color: #544A9F; }
    .line-accent { border-color: #544A9F; }
    .full-height { height: 100vh; }
    .skill-bar { height: 6px; border-radius: 3px; }
    .category-title { font-weight: 600; margin-top: 0.5rem; margin-bottom: 0.25rem; }
  </style>
</head>
<body>
  <div class="flex w-full full-height">
    <!-- Coluna Lateral -->
    <div class="w-1/3 bg-gray-50 p-8 flex flex-col items-center full-height">
      <img src="${esc(pd.photo || 'https://via.placeholder.com/300')}" alt="${esc(pd.fullName || '')}" class="w-32 h-32 rounded-full mb-4 border-4 border-accent object-cover">
      <h2 class="text-2xl font-bold accent mb-1">Marino Ricardo</h2>
      <p class="text-sm text-gray-600 mb-6">Frontend & Fullstack Developer</p>

      <div class="w-full text-left">
        <h3 class="font-semibold text-sm mb-1 accent">Contacto</h3>
        <p class="text-xs mb-1">marino.ricardo@email.com</p>
        <p class="text-xs mb-1">+258 84 123 4567</p>
        <p class="text-xs mb-3">Maputo, Moçambique</p>

        <h3 class="font-semibold text-sm mb-1 accent">Competências</h3>
        <div class="text-xs">
          <p class="category-title accent">Frontend</p>
          <ul class="list-disc list-inside mb-2">
            <li>HTML, CSS, Tailwind CSS</li>
            <li>JavaScript, TypeScript</li>
            <li>Angular, React</li>
            <li>Bootstrap</li>
          </ul>

          <p class="category-title accent">Backend</p>
          <ul class="list-disc list-inside mb-2">
            <li>Node.js, Express</li>
            <li>PHP, Laravel</li>
            <li>MySQL, MongoDB</li>
          </ul>

          <p class="category-title accent">DevOps & Ferramentas</p>
          <ul class="list-disc list-inside mb-2">
            <li>Git, GitHub, GitLab</li>
            <li>Docker</li>
            <li>Jenkins, CI/CD</li>
            <li>Firebase</li>
          </ul>

          <p class="category-title accent">Outras</p>
          <ul class="list-disc list-inside">
            <li>UI/UX Design</li>
            <li>Figma & Adobe XD</li>
            <li>Testes Unitários</li>
          </ul>
        </div>

        <h3 class="font-semibold text-sm mb-1 accent mt-4">Línguas</h3>
        <ul class="text-xs list-disc list-inside">
          <li>Português (Nativo)</li>
          <li>Inglês (Avançado)</li>
          <li>Espanhol (Intermediário)</li>
        </ul>
      </div>
    </div>

    <!-- Coluna Principal -->
    <div class="w-2/3 p-8">
      <section class="mb-6">
        <h2 class="text-2xl font-bold accent mb-2 border-b-2 line-accent pb-1">Perfil</h2>
        <p class="text-sm">Desenvolvedor Frontend e Fullstack com mais de 5 anos de experiência em criação de aplicações web modernas, responsivas e escaláveis. Forte capacidade em design de interfaces, integração de APIs e otimização de performance. Apaixonado por tecnologia e soluções inovadoras.</p>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-bold accent mb-2 border-b-2 line-accent pb-1">Experiência</h2>
        <div class="mb-4">
          <h3 class="font-semibold text-lg">Fullstack Developer - Moza Tech</h3>
          <span class="text-xs text-gray-500">Jan 2022 - Atual</span>
          <p class="text-sm mt-1">Desenvolvimento de sistemas bancários internos, integração com APIs externas e otimização de dashboards de análise de dados.</p>
        </div>
        <div class="mb-4">
          <h3 class="font-semibold text-lg">Frontend Developer - SmartPOS</h3>
          <span class="text-xs text-gray-500">Jul 2020 - Dez 2021</span>
          <p class="text-sm mt-1">Criação de interfaces web interativas para POS, implementação de sistemas de autenticação e gestão de produtos.</p>
        </div>
        <div class="mb-4">
          <h3 class="font-semibold text-lg">Estagiário de Desenvolvimento - DevLab</h3>
          <span class="text-xs text-gray-500">Jan 2019 - Jun 2020</span>
          <p class="text-sm mt-1">Participação em projetos de front-end, criação de componentes reutilizáveis e suporte em integração de APIs.</p>
        </div>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-bold accent mb-2 border-b-2 line-accent pb-1">Educação</h2>
        <div class="mb-4">
          <h3 class="font-semibold text-lg">Bacharel em Engenharia Informática - Universidade Eduardo Mondlane</h3>
          <span class="text-xs text-gray-500">2015 - 2019</span>
          <p class="text-sm mt-1">Formação sólida em desenvolvimento de software, algoritmos, estruturas de dados e desenvolvimento web.</p>
        </div>
        <div class="mb-4">
          <h3 class="font-semibold text-lg">Certificação em Angular Avançado - Udemy</h3>
          <span class="text-xs text-gray-500">2021</span>
          <p class="text-sm mt-1">Curso completo de Angular com foco em boas práticas, performance e testes unitários.</p>
        </div>
      </section>
    </div>
  </div>
</body>
</html>
`;
}


function generatePremiumCVModelo3(data) {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<style>
@page { margin: 0; }
html, body { margin: 0; font-family: 'Poppins', sans-serif; background: white; color: #333; }
.accent { color: #544A9F; }
hr { border: none; border-top: 1px solid #e5e5e5; margin: 1rem 0; }
.badge { display: inline-block; background: #544A9F; color: white; padding: 0.35rem 0.6rem; border-radius: 0.25rem; font-size: 0.75rem; margin: 0.125rem 0.125rem 0 0; }
</style>
</head>
<body class="p-16">

  <!-- Header -->
  <div class="flex items-center mb-10">
    <img src="${esc(pd.photo || 'https://via.placeholder.com/300')}" alt="Foto" class="w-36 h-36 rounded-full mr-6 border-4 border-[#544A9F] object-cover">
    <div>
      <h1 class="text-4xl font-bold accent mb-2">Marino Ricardo</h1>
      <p class="text-lg text-gray-600">Frontend & Fullstack Developer</p>
    </div>
  </div>

  <!-- Contato -->
<!-- Contato Centralizado -->
<div class="text-sm text-gray-700 mb-10 text-center">
  marino.ricardo@email.com | +258 84 123 4567 | Maputo, Moçambique
</div>


  <!-- Perfil -->
  <section class="mb-8">
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Perfil</h2>
    <p class="text-sm leading-relaxed">Desenvolvedor Frontend e Fullstack com mais de 5 anos de experiência na criação de aplicações web modernas, responsivas e escaláveis. Habilidade em design de interfaces, integração de APIs, performance e soluções inovadoras para negócios.</p>
  </section>

  <!-- Experiência -->
  <section class="mb-8">
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Experiência</h2>

    <div class="mb-5">
      <h3 class="font-semibold text-lg">Fullstack Developer - Moza Tech</h3>
      <span class="text-xs text-gray-500">Jan 2022 - Atual</span>
      <p class="text-sm mt-1 leading-relaxed">Desenvolvimento de sistemas bancários internos, integração com APIs externas, dashboards de análise de dados e otimização de performance das aplicações.</p>
    </div>

    <div class="mb-5">
      <h3 class="font-semibold text-lg">Frontend Developer - SmartPOS</h3>
      <span class="text-xs text-gray-500">Jul 2020 - Dez 2021</span>
      <p class="text-sm mt-1 leading-relaxed">Criação de interfaces web interativas, implementação de sistemas de autenticação, gestão de produtos e melhoria da experiência do usuário.</p>
    </div>
  </section>

  <!-- Educação -->
  <section class="mb-8">
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Educação</h2>
    <div class="mb-3">
      <h3 class="font-semibold">Bacharel em Engenharia Informática - Universidade Eduardo Mondlane</h3>
      <span class="text-xs text-gray-500">2015 - 2019</span>
    </div>
    <div>
      <h3 class="font-semibold">Certificação Angular Avançado - Udemy</h3>
      <span class="text-xs text-gray-500">2021</span>
    </div>
  </section>

  <!-- Competências -->
  <section class="mb-8">
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Competências</h2>
    <div>
      <span class="badge">JavaScript</span>
      <span class="badge">TypeScript</span>
      <span class="badge">Angular</span>
      <span class="badge">React</span>
      <span class="badge">Node.js</span>
      <span class="badge">Express</span>
      <span class="badge">HTML & CSS</span>
      <span class="badge">Tailwind CSS</span>
      <span class="badge">Firebase</span>
      <span class="badge">MySQL</span>
    </div>
  </section>

  <!-- Línguas -->
  <section>
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Línguas</h2>
    <ul class="text-sm list-disc list-inside leading-relaxed">
      <li>Português (Nativo)</li>
      <li>Inglês (Avançado)</li>
      <li>Espanhol (Intermediário)</li>
    </ul>
  </section>

</body>
</html>
`;
}


function generatePremiumCVModelo4(data) {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<style>
@page { margin: 0; }
html, body { margin: 0; font-family: 'Poppins', sans-serif; background: white; color: #333; }
.accent { color: #544A9F; }
hr { border: none; border-top: 1px solid #e5e5e5; margin: 1rem 0; }
.badge { display: inline-block; background: #544A9F; color: white; padding: 0.35rem 0.6rem; border-radius: 0.25rem; font-size: 0.75rem; margin: 0.125rem 0.125rem 0 0; }
</style>
</head>
<body class="p-16">

  <!-- Header -->
  <div class="flex flex-col items-center mb-10">
    <img src="${esc(pd.photo || 'https://via.placeholder.com/300')}" alt="Foto" class="w-36 h-36 rounded-full mb-4 border-4 border-[#544A9F] object-cover">
    <h1 class="text-4xl font-bold accent mb-1">Marino Ricardo</h1>
    <p class="text-lg text-gray-600 mb-4">Marketing Specialist</p>

    <!-- Contato Centralizado -->
    <div class="text-sm text-gray-700 text-center">
      marino.ricardo@email.com | +258 84 123 4567 | Maputo, Moçambique
    </div>
  </div>

  <!-- Perfil -->
  <section class="mb-8">
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Perfil</h2>
    <p class="text-sm leading-relaxed">
      Profissional de Marketing com experiência em estratégias digitais, branding, campanhas de mídia social e análise de dados. Capaz de aumentar engajamento, gerar leads e melhorar a presença de marca de forma mensurável.
    </p>
  </section>

  <!-- Experiência -->
  <section class="mb-8">
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Experiência</h2>

    <div class="mb-5">
      <h3 class="font-semibold text-lg">Marketing Specialist - Moza Digital</h3>
      <span class="text-xs text-gray-500">Jan 2022 - Atual</span>
      <p class="text-sm mt-1 leading-relaxed">
        Desenvolvimento de campanhas digitais, análise de métricas, SEO/SEM e gestão de redes sociais, aumentando a presença online e a conversão de leads.
      </p>
    </div>

    <div class="mb-5">
      <h3 class="font-semibold text-lg">Social Media Manager - BrandUp</h3>
      <span class="text-xs text-gray-500">Jul 2020 - Dez 2021</span>
      <p class="text-sm mt-1 leading-relaxed">
        Criação de conteúdo, planejamento de calendário editorial e monitoramento de desempenho das campanhas, aumentando engajamento em 35%.
      </p>
    </div>
  </section>

  <!-- Educação -->
  <section class="mb-8">
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Educação</h2>
    <div class="mb-3">
      <h3 class="font-semibold">Bacharel em Marketing - Universidade Eduardo Mondlane</h3>
      <span class="text-xs text-gray-500">2015 - 2019</span>
    </div>
    <div>
      <h3 class="font-semibold">Certificação em Marketing Digital - HubSpot Academy</h3>
      <span class="text-xs text-gray-500">2021</span>
    </div>
  </section>

  <!-- Competências -->
  <section class="mb-8">
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Competências</h2>
    <div>
      <span class="badge">SEO</span>
      <span class="badge">SEM</span>
      <span class="badge">Branding</span>
      <span class="badge">Redes Sociais</span>
      <span class="badge">Google Ads</span>
      <span class="badge">Facebook Ads</span>
      <span class="badge">Email Marketing</span>
      <span class="badge">Análise de Dados</span>
      <span class="badge">Content Marketing</span>
      <span class="badge">Copywriting</span>
    </div>
  </section>

  <!-- Línguas -->
  <section>
    <h2 class="text-2xl font-semibold accent mb-3 border-b-2 border-[#544A9F] inline-block pb-1">Línguas</h2>
    <ul class="text-sm list-disc list-inside leading-relaxed">
      <li>Português (Nativo)</li>
      <li>Inglês (Avançado)</li>
      <li>Espanhol (Intermediário)</li>
    </ul>
  </section>

</body>
</html>
`;
}


function generatePremiumCVModelo5(data) {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<style>
@page { margin: 0; }
html, body { margin: 0; font-family: 'Poppins', sans-serif; background: white; color: #333; }
.accent { color: #544A9F; }
hr { border: none; border-top: 1px solid #e5e5e5; margin: 1rem 0; }
.progress { background: #e5e5e5; border-radius: 9999px; height: 6px; width: 100%; margin-top: 0.25rem; }
.progress-bar { background: #544A9F; height: 6px; border-radius: 9999px; }
.section-title { font-size: 1.25rem; font-weight: 600; color: #544A9F; margin-bottom: 0.5rem; border-bottom: 2px solid #544A9F; display: inline-block; padding-bottom: 2px; }
</style>
</head>
<body class="p-16">

  <div class="flex gap-12">

    <!-- Coluna esquerda -->
    <div class="w-1/3 flex flex-col items-center">
      <img src="${esc(pd.photo || 'https://via.placeholder.com/300')}" alt="Foto" class="w-40 h-40 rounded-full border-4 border-[#544A9F] object-cover mb-6">
      <h1 class="text-3xl font-bold accent mb-1 text-center">Marino Ricardo</h1>
      <p class="text-lg text-gray-600 mb-4 text-center">UI/UX & Visual Designer</p>
      <p class="text-sm text-gray-700 text-center mb-6">
        marino.ricardo@email.com<br>
        +258 84 123 4567<br>
        Maputo, Moçambique
      </p>

      <section class="mb-6 w-full">
        <h2 class="section-title">Competências</h2>
        <div class="mb-3">
          <p class="text-sm">Figma</p>
          <div class="progress"><div class="progress-bar" style="width: 95%;"></div></div>
        </div>
        <div class="mb-3">
          <p class="text-sm">Adobe Photoshop</p>
          <div class="progress"><div class="progress-bar" style="width: 90%;"></div></div>
        </div>
        <div class="mb-3">
          <p class="text-sm">Adobe Illustrator</p>
          <div class="progress"><div class="progress-bar" style="width: 85%;"></div></div>
        </div>
        <div class="mb-3">
          <p class="text-sm">UI/UX Design</p>
          <div class="progress"><div class="progress-bar" style="width: 95%;"></div></div>
        </div>
        <div class="mb-3">
          <p class="text-sm">Prototipagem</p>
          <div class="progress"><div class="progress-bar" style="width: 90%;"></div></div>
        </div>
      </section>

      <section class="w-full">
        <h2 class="section-title">Línguas</h2>
        <ul class="text-sm list-disc list-inside leading-relaxed">
          <li>Português (Nativo)</li>
          <li>Inglês (Avançado)</li>
          <li>Espanhol (Intermediário)</li>
        </ul>
      </section>
    </div>

    <!-- Coluna direita -->
    <div class="w-2/3">
      <section class="mb-8">
        <h2 class="section-title">Perfil</h2>
        <p class="text-sm leading-relaxed">
          Designer criativo especializado em UI/UX e design visual, com experiência em branding, criação de interfaces digitais e experiência do usuário. Habilidade em transformar ideias em produtos visuais impactantes.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="section-title">Experiência</h2>
        <div class="mb-5">
          <h3 class="font-semibold text-lg">UI/UX Designer - Creative Studio</h3>
          <span class="text-xs text-gray-500">Jan 2022 - Atual</span>
          <p class="text-sm mt-1 leading-relaxed">
            Desenvolvimento de interfaces digitais, criação de protótipos e design responsivo. Colaboração com equipes de produto para melhorar a experiência do usuário.
          </p>
        </div>

        <div class="mb-5">
          <h3 class="font-semibold text-lg">Visual Designer - BrandLab</h3>
          <span class="text-xs text-gray-500">Jul 2020 - Dez 2021</span>
          <p class="text-sm mt-1 leading-relaxed">
            Criação de materiais visuais para marketing digital, branding e campanhas promocionais, aumentando o engajamento visual das marcas.
          </p>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="section-title">Educação</h2>
        <div class="mb-3">
          <h3 class="font-semibold">Bacharel em Design Gráfico - Universidade Eduardo Mondlane</h3>
          <span class="text-xs text-gray-500">2015 - 2019</span>
        </div>
        <div>
          <h3 class="font-semibold">Certificação em UI/UX - Coursera</h3>
          <span class="text-xs text-gray-500">2021</span>
        </div>
      </section>
    </div>

  </div>

</body>
</html>
`;
}


function generatePremiumCVModelo6(data) {
  const pd = (data && data.personalData) ? data.personalData : {};
  const competences = Array.isArray(data && data.competences) ? data.competences : [];
  const education = Array.isArray(data && data.education) ? data.education : [];
  const languages = Array.isArray(data && data.languages) ? data.languages : [];
  const experience = Array.isArray(data && data.professional_experience) ? data.professional_experience : [];

  const esc = (v) => (v === undefined || v === null) ? '' : String(v);

  const competencesHtml = competences.map(c => `<span class="bg-purple-600 text-white px-3 py-1 rounded-md text-sm">${esc(c)}</span>`).join('\n        ');

  const educationHtml = education.map(e => `
    <div class="mb-2">
      <p><strong>${esc(e.classe || e.course || '')}</strong> - ${esc(e.escola || e.school || '')} (${esc(e.ano_inicio || '')} – ${esc(e.ano_fim || '')})</p>
    </div>
  `).join('\n');

  const languagesHtml = languages.map(l => `
    <li>${esc(l.nome || l.name || '')} - ${esc(l.fala || l.speaking || l.level || '')}</li>
  `).join('\n');

  const experienceHtml = experience.map(exp => `
    <div class="mb-4">
      <h4 class="font-semibold text-gray-800 text-lg">${esc(exp.profissao || exp.position || '')}</h4>
      <p class="italic text-gray-600 text-sm">${esc(exp.empresa || exp.company || '')}</p>
      <p class="text-gray-500 text-xs mb-1">${esc(exp.ano_inicio || '')} ${exp.ano_fim ? '– ' + esc(exp.ano_fim) : ''}</p>
      <p>${esc(exp.descricao || exp.description || '')}</p>
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<title>CV - ${esc(pd.fullName || 'Nome')}</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
@page { margin: 0; }
body { font-family: 'Inter', sans-serif; }
</style>
</head>
<body class="bg-white text-gray-800 p-10">

<!-- Cabeçalho -->
<div class="flex items-center mb-10 gap-6">
  <img src="${esc(pd.photo || 'https://via.placeholder.com/300')}" alt="${esc(pd.fullName || '')}" class="w-32 h-32 rounded-xl object-cover">
  <div>
    <h1 class="text-4xl font-bold text-purple-900">${esc(pd.fullName || '')}</h1>
    <h2 class="text-lg font-medium text-purple-600 mt-1">${esc(pd.profession || '')}</h2>
    <p class="text-gray-600 mt-2 text-sm">${esc(pd.email || '')} | ${esc(pd.cellphone || pd.cellphoneOptional || '')} | ${esc(pd.location || '')}</p>
  </div>
</div>

<!-- Perfil Profissional -->
<div class="mb-8">
  <h3 class="text-purple-900 font-semibold uppercase border-b-2 border-purple-600 inline-block pb-1 mb-3">Perfil Profissional</h3>
  <p>${esc(pd.profile || '')}</p>
</div>

<!-- Experiência Profissional -->
<div class="mb-8">
  <h3 class="text-purple-900 font-semibold uppercase border-b-2 border-purple-600 inline-block pb-1 mb-3">Experiência Profissional</h3>

  ${experienceHtml || '<p class="text-gray-600">Sem experiência adicionada.</p>'}
</div>

<!-- Habilidades -->
<div class="mb-8">
  <h3 class="text-purple-900 font-semibold uppercase border-b-2 border-purple-600 inline-block pb-1 mb-3">Habilidades Técnicas</h3>
  <div class="flex flex-wrap gap-2 mt-2">
    ${competencesHtml || '<span class="text-gray-600">Sem competências adicionadas.</span>'}
  </div>
</div>

<!-- Idiomas -->
<div class="mb-8">
  <h3 class="text-purple-900 font-semibold uppercase border-b-2 border-purple-600 inline-block pb-1 mb-3">Idiomas</h3>
  <ul class="list-disc ml-5">
    ${languagesHtml || '<li class="text-gray-600">Sem idiomas adicionados.</li>'}
  </ul>
</div>

<!-- Formação Acadêmica -->
<div class="mb-8">
  <h3 class="text-purple-900 font-semibold uppercase border-b-2 border-purple-600 inline-block pb-1 mb-3">Formação Acadêmica</h3>
  ${educationHtml || '<p class="text-gray-600">Sem formação adicionada.</p>'}
</div>

</body>
</html>
`;
}

app.get('/', (req, res) => {
  res.json({ 'success': true, 'message': 'API de Geração de CV em PDF está funcionando!' });
});

app.post('/generate-pdf', async (req, res) => {
  const data = req.body;
  console.log("Data: ", data)
  try {
    // const browser = await puppeteer.launch({
    //   args: ['--no-sandbox', '--disable-setuid-sandbox']
    // });

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();
    const modelo = (data && data.modelo) ? data.modelo : {};

    const name = modelo.name;
    let html = '';

    switch (name) {
      case 'modelo1.php':
        html = generatePremiumCVModelo1(data);
        break;
      case 'modelo2.php':
        html = generatePremiumCVModelo2(data);
        break;
      case 'modelo3.php':
        html = generatePremiumCVModelo3(data);
        break;
      case 'modelo4.php':
        html = generatePremiumCVModelo4(data);
        break;
      case 'modelo5.php':
        html = generatePremiumCVModelo5(data);
        break;
      case 'modelo6.php':
        html = generatePremiumCVModelo6(data);
        break;
      default:
        throw new Error(`Modelo não suportado: ${name}`);;
    }
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
    console.error('Erro ao gerar PDF2:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
});

app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });
