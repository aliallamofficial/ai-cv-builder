// دالة التحقق الصارمة من حد الاستخدام اليومي المخصص (5 مرات في اليوم)
function handleCVCreation() {
    const maxAllowedPerDay = 5; 
    const today = new Date().toDateString(); 
    
    let savedDate = localStorage.getItem('cv_creation_date');
    let creationCount = parseInt(localStorage.getItem('cv_creation_count')) || 0;

    // إذا تغير التاريخ، يتم تصفير العداد ليوم جديد تلقائياً
    if (savedDate !== today) {
        localStorage.setItem('cv_creation_date', today);
        creationCount = 0;
        localStorage.setItem('cv_creation_count', creationCount);
    }

    // فحص تخطي الحد وحظر التشغيل
    if (creationCount >= maxAllowedPerDay) {
        alert("عذراً، لقد وصلت للحد الأقصى المسموح به لإنشاء وتعديل السير الذاتية اليوم (5 مرات). يمكنك المحاولة مجدداً غداً!");
        return false;
    }

    // زيادة العداد بمقدار 1 وحفظ التحديث
    creationCount += 1;
    localStorage.setItem('cv_creation_count', creationCount);
    return true;
}

// حدث الضغط على زر تحسين السيرة الذاتية
document.getElementById('optimizeBtn').addEventListener('click', async () => {
    const fullName = document.getElementById('fullName').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const skills = document.getElementById('skills').value.trim();
    const selectedLang = document.getElementById('langSelect').value;
    const selectedTemplate = document.getElementById('templateSelect').value;

    if (!fullName || !jobTitle) {
        alert(selectedLang === 'ar' ? 'رجاءً أدخل الاسم والمسمى الوظيفي على الأقل!' : 'Please enter Name and Job Title!');
        return;
    }

    // استدعاء فحص الـ 5 مرات أولاً
    if (!handleCVCreation()) return; 

    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');
    const downloadBtn = document.getElementById('downloadPdfBtn');

    // إظهار نص التحميل وإخفاء زر الـ PDF وتفريغ صندوق النتيجة تماماً
    loading.classList.remove('hidden');
    downloadBtn.classList.add('hidden');
    resultBox.innerHTML = '';

    // بناء نص الأوامر (Prompt) بدقة عالية لمنع النمطية الآلية
    let promptMessage = "";
    if (selectedLang === 'ar') {
        promptMessage = `قم بصياغة سيرة ذاتية احترافية وموجزة باللغة العربية للشخص التالي:
        الاسم: ${fullName}
        الوظيفة المستهدفة: ${jobTitle}
        الخبرات الحالية: ${experience || 'مبتدئ يبحث عن فرصته الأولى'}
        المهارات: ${skills || 'تواصل، عمل جماعي، تنظيم المهام'}
        
        شروط الصياغة الصارمة لمنع النمطية:
        1. اكتب بأسلوب بشري طبيعي ومباشر تماماً، وتجنب العبارات الطويلة المكررة (مثل: يسعدني، أتقدم، متطلع لـ).
        2. استخدم أفعالاً حركية قوية ومباشرة في بداية النقاط (مثل: إدارة، تطوير، تنفيذ، تنسيق، تصميم).
        3. ركز على إبراز المهام والنتائج العملية بدقة.
        4. نسق النص في أقسام واضحة مستخدماً النقاط (•) للفصل بين العبارات لسهولة القراءة.`;
    } else {
        promptMessage = `Create a professional and concise resume in English for the following candidate:
        Name: ${fullName}
        Target Job: ${jobTitle}
        Experience: ${experience || 'Entry-level candidate looking for the first opportunity'}
        Skills: ${skills || 'Communication, teamwork, task management'}
        
        Strict Rules to avoid AI clichés:
        1. Write in a natural, direct, and human-like style. Avoid fluffy introductory phrases.
        2. Start bullet points with strong action verbs (e.g., Managed, Developed, Executed, Coordinated).
        3. Highlight practical tasks and results clearly.
        4. Format into clean sections using bullet points (•) for high readability.`;
    }

    const url = `https://text.pollinations.ai/`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: [{ role: "user", content: promptMessage }],
                system: selectedLang === 'ar' ? 
                "أنت مستشار توظيف خبير (HR Consultant). تكتب سير ذاتية دقيقة، واقعية، ومقنعة لأصحاب العمل، بعيداً عن حشو الذكاء الاصطناعي والعبارات المكررة." :
                "You are an expert HR Consultant. You write precise, ATS-friendly, and realistic resumes without fluff or robotic language."
            })
        });

        const aiResult = await response.text();

        if (aiResult && aiResult.trim().length > 0) {
            
            // تطبيق ميزة قوالب التنسيق البصرية (Templates) ديناميكياً
            let templateStyles = "padding:25px; line-height:1.8; font-size:16px; border-radius:8px; margin-top:15px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); font-family: sans-serif;";
            
            // تحديد اتجاه النص حسب اللغة المعتمدة
            if (selectedLang === 'ar') {
                templateStyles += " text-align: right; direction: rtl;";
            } else {
                templateStyles += " text-align: left; direction: ltr;";
            }
            
            // تطبيق خصائص الألوان للقالب المختار
            if (selectedTemplate === 'modern') {
                templateStyles += " background-color: #1e293b; color: #f8fafc; border-left: 6px solid #3b82f6;";
            } else if (selectedTemplate === 'classic') {
                templateStyles += " background-color: #ffffff; color: #000000; border: 2px solid #000000; font-family: 'Times New Roman', serif;";
            } else if (selectedTemplate === 'elegant') {
                templateStyles += " background-color: #fafaf9; color: #1c1917; border-top: 6px solid #d97706;";
            }

            // حقن النتيجة الجديدة كلياً داخل الـ HTML الخاص بصندوق النتيجة
            resultBox.innerHTML = `<div id="cvTemplateArea" style="${templateStyles}">${aiResult.replace(/\n/g, '<br>')}</div>`;
            downloadBtn.classList.remove('hidden'); // إظهار زر الـ PDF فور إنتاج النص
        } else {
            throw new Error("استجابة فارغة");
        }
    } catch (error) {
        // الحل الاحتياطي في حال انقطاع الشبكة
        let fallbackHTML = "";
        if (selectedLang === 'ar') {
            fallbackHTML = `
            <div id="cvTemplateArea" style="padding:25px; text-align: right; direction: rtl; line-height: 1.8; background-color: #1e293b; color: #fff; border-left: 6px solid #3b82f6; border-radius:8px;">
            📌 **الملف المهني الشخصي**
            • **الاسم:** ${fullName}
            • **المسمى الوظيفي المستهدف:** ${jobTitle}

            🎯 **الخلاصة المهنية:**
            متخصص في مجال (${jobTitle})، أمتلك الشغف لتطوير المهارات العملية وتطبيق المعرفة الأكاديمية والشخصية للمساهمة في تحقيق أهداف الفريق بكفاءة، مع التركيز على الإنتاجية وحل المشكلات داخل بيئة العمل.

            🛠️ **المهارات والقدرات الأساسية:**
            ${skills ? skills.split('،').map(s => `• ${s.trim()}`).join('<br>') : '• تنظيم المهام وإدارة الوقت بفعالية<br>• مهارات التواصل الفعال والعمل الجماعي المشترك<br>• القدرة على التحليل وحل المشكلات التقنية أو الإدارية'}

            📜 **الخبرات المهنية والأنشطة:**
            ${experience ? experience : '• التركيز على بناء وتطوير المشاريع الشخصية والتطبيق العملي المستمر.<br>• البحث عن الفرصة المهنية الأولى للمساهمة الفورية واكتساب الخبرة الميدانية.'}
            </div>`;
        } else {
            fallbackHTML = `
            <div id="cvTemplateArea" style="padding:25px; text-align: left; direction: ltr; line-height: 1.8; background-color: #1e293b; color: #fff; border-left: 6px solid #3b82f6; border-radius:8px;">
            📌 **Professional Profile**
            • **Name:** ${fullName}
            • **Target Job Title:** ${jobTitle}

            🎯 **Professional Summary:**
            Dedicated specialist in (${jobTitle}), passionate about developing practical skills and applying personal knowledge to contribute effectively to team goals, focusing on productivity and workplace problem-solving.

            🛠️ **Core Skills & Competencies:**
            ${skills ? skills.split(',').map(s => `• ${s.trim()}`).join('<br>') : '• Effective time management and task organization<br>• Strong communication and collaborative teamwork<br>• Analytical thinking and problem-solving capabilities'}

            📜 **Professional Experience & Activities:**
            ${experience ? experience : '• Focused on building personal projects and continuous practical application.<br>• Seeking an initial professional opportunity to actively contribute and gain field experience.'}
            </div>`;
        }
        resultBox.innerHTML = fallbackHTML;
        downloadBtn.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
});

// 3. ميزة تحميل السيرة الذاتية وطباعتها بصيغة PDF
document.getElementById('downloadPdfBtn').addEventListener('click', () => {
    const printContent = document.getElementById('cvTemplateArea').innerHTML;
    const originalContent = document.body.innerHTML;

    // استبدال الشاشة مؤقتاً لعرض محتوى السيرة الذاتية فقط لطباعة نظيفة
    document.body.innerHTML = `<div style="padding:20px;">${printContent}</div>`;
    window.print();
    
    // إرجاع محتوى التطبيق وإعادة تنشيط الأحداث
    document.body.innerHTML = originalContent;
    window.location.reload(); 
});
