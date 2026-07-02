// ========================================================
// 💡 مصفوفة النصائح الجاهزة لتغيير النصيحة تلقائياً محلياً (عند عدم الاتصال)
// ========================================================
const cvTips = [
    "تجنب وضع صورتك الشخصية إذا كنت تقدم على شركات عالمية تعتمد نظام ATS تماماً.",
    "احرص على ألا تتجاوز سيرتك الذاتية صفحة واحدة إذا كانت خبرتك أقل من 5 سنوات.",
    "استخدم أرقاماً ونسباً مئوية حقيقية لإثبات إنجازاتك (مثال: زيادة المبيعات بنسبة 20%).",
    "البريد الإلكتروني المهني يجب أن يحتوي على اسمك الحقيقي، ابتعد تماماً عن الأسماء مستعارة.",
    "الكلمات المفتاحية المأخوذة من إعلان الوظيفة نفسه هي مفتاحك السحري لتخطي فلترة الـ ATS."
];

// دالة مخصصة لعرض نصيحة عشوائية عند فتح التطبيق
function displayRandomLiveTip() {
    const tipTextElement = document.getElementById('liveTipText');
    if (tipTextElement) {
        const randomIndex = Math.floor(Math.random() * cvTips.length);
        tipTextElement.innerText = cvTips[randomIndex];
    }
}

// ========================================================
// 🛡️ دالة نجاح التحقق من Cloudflare Turnstile (ربط إخفاء الـ Splash Screen بالتحقق)
// ========================================================
function onTurnstileSuccess(token) {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500); // تختفي تماماً بعد نجاح التحقق بنصف ثانية
    }
}
// تم إضافة هذا السطر ليتعرف Cloudflare على الدالة بنجاح
window.onTurnstileSuccess = onTurnstileSuccess;

// ========================================================
// 🚀 نظام تشغيل وإدارة جولة التطبيق الترحيبية (App Tour) للمستخدم الجديد
// ========================================================
const tourSteps = [
    {
        icon: "🚀",
        title: "مرحباً بك في مستقبلك المهني!",
        desc: "دعنا نأخذك في جولة سريعة مدتها دقيقة واحدة للتعرف على كيفية صناعة سيرة ذاتية لا تقهر بالذكاء الاصطناعي.",
        btnText: "ابدأ الرحلة الآن ←"
    },
    {
        icon: "📊",
        title: "مستشار الـ ATS الذكي لحظة بلحظة",
        desc: "أثنائ كتابة بياناتك، سيقوم العداد الذكي بتقييم قوة مستندك وإعطائك نصائح حية لتخطي أنظمة الفلترة العالمية بنجاح.",
        btnText: "التالي مذهل كالعادة ←"
    },
    {
        icon: "✨",
        title: "الذكاء الاصطناعي في خدمتك",
        desc: "اضغط على زر الإنشاء ليقوم التطبيق بصياغة وتدقيق نصك لغوياً وإصدار نسخة احترافية بالكامل مع رمز QR وتوقيع رقمي آمن.",
        btnText: "إنهاء الجولة والدخول للتطبيق 🎉"
    }
];

let currentTourStep = 0;

function initAppTour() {
    if (localStorage.getItem('cv_tour_completed') === 'true') return;
    const tourModal = document.getElementById('appTourModal');
    if (!tourModal) return;

    tourModal.classList.remove('hidden');
    const nextBtn = document.getElementById('nextTourBtn');
    const skipBtn = document.getElementById('skipTourBtn');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTourStep++;
            if (currentTourStep < tourSteps.length) {
                updateTourContent();
            } else {
                closeTour();
            }
        });
    }
    if (skipBtn) skipBtn.addEventListener('click', closeTour);
}

function updateTourContent() {
    const stepData = tourSteps[currentTourStep];
    const progress = document.getElementById('tourProgress');
    const icon = document.getElementById('tourIcon');
    const title = document.getElementById('tourTitle');
    const desc = document.getElementById('tourDescription');
    const nextBtn = document.getElementById('nextTourBtn');

    if (progress) progress.innerText = `خطوة ${currentTourStep + 1} من ${tourSteps.length}`;
    if (icon) icon.innerText = stepData.icon;
    if (title) title.innerText = stepData.title;
    if (desc) desc.innerText = stepData.desc;
    if (nextBtn) nextBtn.innerText = stepData.btnText;
}

function closeTour() {
    const tourModal = document.getElementById('appTourModal');
    if (tourModal) tourModal.classList.add('hidden');
    localStorage.setItem('cv_tour_completed', 'true');
}

// ==========================================
// 🔥 ميزة 1: عداد قياس قوة وجاهزية الـ CV لنظام الـ ATS
// ==========================================
function initCVScoreGauge() {
    const inputs = ['fullName', 'jobTitle', 'experience', 'skills'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateCVScore);
    });
}

function calculateCVScore() {
    const fullName = document.getElementById('fullName')?.value.trim() || "";
    const jobTitle = document.getElementById('jobTitle')?.value.trim() || "";
    const experience = document.getElementById('experience')?.value.trim() || "";
    const skills = document.getElementById('skills')?.value.trim() || "";

    let score = 0;
    if (fullName.length > 4) score += 15;
    if (jobTitle.length > 3) score += 15;
    if (experience.length > 10) score += 20;
    if (experience.length > 50) score += 15;

    const skillsCount = skills.split(',').filter(s => s.trim().length > 1).length;
    if (skillsCount >= 2) score += 20;
    if (skillsCount >= 5) score += 15;

    const scoreBar = document.getElementById('cvScoreBar');
    const scorePercent = document.getElementById('cvScorePercent');
    const scoreFeedback = document.getElementById('cvScoreFeedback');

    if (scoreBar && scorePercent && scoreFeedback) {
        scoreBar.style.width = `${score}%`;
        scorePercent.innerText = `${score}%`;

        if (score < 40) {
            scoreBar.style.background = '#ef4444';
            scoreFeedback.innerHTML = '⚠️ البيانات غير كافية، سيقوم نظام الـ ATS برفض الملف تلقائياً.';
        } else if (score < 75) {
            scoreBar.style.background = '#f59e0b';
            scoreFeedback.innerHTML = '⚡ أداء جيد! أضف المزيد من المهارات أو تفاصيل الخبرة لتخطي حاجز المنافسة.';
        } else {
            scoreBar.style.background = '#10b981';
            scoreFeedback.innerHTML = '🔥 مذهل! السيرة الذاتية مدعمة بكلمات مفتاحية قوية وجاهزة للقنص الرقمي.';
        }
    }
}

// ==========================================
// 🚀 ميزة: مساعد الصياغة الذكي المباشر للحقول (Inline AI Writer)
// ==========================================
function initInlineAIWriters() {
    document.querySelectorAll('.inline-ai-btn').forEach(aiBtn => {
        aiBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const fieldId = aiBtn.getAttribute('data-field');
            const field = document.getElementById(fieldId);
            const textValue = field?.value.trim();
            
            if (!textValue) { alert('الرجاء كتابة نص أولاً ليقوم الذكاء الاصطناعي بتحسينه!'); return; }
            
            const originalText = aiBtn.innerText;
            aiBtn.innerText = '⏳ جاري الصياغة...';
            aiBtn.disabled = true;
            try {
                const optimized = await askAI(`قم بإعادة صياغة هذا النص المهني لجعله أكثر احترافية وقوة ومناسباً لأنظمة الـ ATS في نقاط واضحة ومباشرة: ${textValue}`, "أنت مستشار HR خبير تعيد صياغة العبارات بأسلوب قوي ومقنع.");
                if (optimized && field) field.value = optimized.trim();
            } catch (err) {
                alert('عذراً، الخادم مشغول حالياً. حاول مجدداً.');
            } finally {
                aiBtn.innerText = originalText;
                aiBtn.disabled = false;
                calculateCVScore();
            }
        });
    });
}

// ==========================================
// 🚀 ميزة: محاكي المقابلات الشخصية (AI Interview Prep)
// ==========================================
function initAIInterviewPrep() {
    const interviewBtn = document.getElementById('interviewPrepBtn');
    if (!interviewBtn) return;
    
    interviewBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const jobTitle = document.getElementById('jobTitle').value.trim();
        if (!jobTitle) { alert('يرجى كتابة المسمى الوظيفي المستهدف أولاً لتوليد الأسئلة المناسبة!'); return; }

        const loading = document.getElementById('loading');
        const resultBox = document.getElementById('resultBox');
        interviewBtn.disabled = true;
        loading.classList.remove('hidden');

        try {
            const qaResult = await askAI(`أعطني أهم 5 أسئلة متوقعة في المقابلات الشخصية لوظيفة: ${jobTitle} مع الإجابات النموذجية والمختصرة جداً لكل سؤال باللغة العربية.`, "أنت مسؤول التوظيف التقني الخبير.");
            if (qaResult) {
                let formattedQA = formatMarkdown(qaResult);
                let templateStyles = getTemplateStyles(document.getElementById('langSelect').value, 'modern');
                resultBox.innerHTML = `<div id="cvTemplateArea" style="${templateStyles}"><h3>🧠 الأسئلة المتوقعة في المقابلة والإجابات النموذجية:</h3><br>${formattedQA}</div>`;
                document.getElementById('downloadContainer').classList.add('hidden');
            }
        } catch (err) {
            alert('السيرفر مشغول حالياً بالمعالجة، أعد النقر بعد قليل.');
        } finally {
            loading.classList.add('hidden');
            interviewBtn.disabled = false;
        }
    });
}

// ==========================================
// 🔥 ميزة: تخصيص المظهر (الأبعاد والمسافات واللون)
// ==========================================
function initThemeColorPicker() {
    const container = document.getElementById('dynamicColorPickerContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="settings-section-card" style="text-align: right; direction: rtl; margin-bottom: 15px; background: #0f172a; padding: 15px; border-radius: 6px;">
            <h3 style="color: #38bdf8; margin-top: 0;">🎨 لون الهوية البصرية المخصص</h3>
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">اختر اللون الرئيسي المفضل لتخصيص خطوط وعناوين سيرتك الذاتية بشكل فوري ومميز.</p>
            <div style="display:flex; gap:12px; align-items:center;">
                <input type="color" id="themePrimaryColor" value="${localStorage.getItem('cv_theme_color') || '#3b82f6'}" style="width:50px; height:35px; border:none; border-radius:4px; cursor:pointer; background:none;">
                <span style="font-size:13px; color:#cbd5e1;">اضغط على الصندوق لاختيار درجة لونك المفضلة</span>
            </div>
        </div>
    `;

    document.getElementById('themePrimaryColor').addEventListener('input', (e) => {
        const selectedColor = e.target.value;
        localStorage.setItem('cv_theme_color', selectedColor);
        applyThemeColorToLiveCV();
    });
}

function applyThemeColorToLiveCV() {
    const activeColor = localStorage.getItem('cv_theme_color') || '#3b82f6';
    const cvArea = document.getElementById('cvTemplateArea');
    if (cvArea) {
        cvArea.style.cssText = getTemplateStyles(document.getElementById('langSelect').value, document.getElementById('templateSelect').value);
    }
}

// دالة التحكم في عدد مرات الاستخدام اليومي
function handleCVCreation() {
    const maxAllowedPerDay = 5; 
    const today = new Date().toDateString(); 
    let savedDate = localStorage.getItem('cv_creation_date');
    let creationCount = parseInt(localStorage.getItem('cv_creation_count')) || 0;

    if (savedDate !== today) {
        localStorage.setItem('cv_creation_date', today);
        creationCount = 0;
        localStorage.setItem('cv_creation_count', creationCount);
    }

    if (creationCount >= maxAllowedPerDay) {
        alert("عذراً، لقد وصلت للحد الأقصى المسموح به اليوم (5 مرات). يمكنك المحاولة مجدداً غداً!");
        return false;
    }
    creationCount += 1;
    localStorage.setItem('cv_creation_count', creationCount);
    return true;
}

// ==========================================
// 🤖 دالة عامة محمية للاتصال بالذكاء الاصطناعي
// ==========================================
async function askAI(promptMessage, systemMessage, retries = 3) {
    const url = `https://text.pollinations.ai/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: [{ role: "user", content: promptMessage }],
                system: systemMessage
            })
        });

        if ((response.status === 429 || response.status === 503 || !response.ok) && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            return await askAI(promptMessage, systemMessage, retries - 1); 
        }

        if (!response.ok) throw new Error();
        return await response.text();

    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return await askAI(promptMessage, systemMessage, retries - 1);
        }
        throw error;
    }
}

// ==========================================
// ✨ دالة تنظيف وتنسيق النصوص (Markdown to HTML)
// ==========================================
function formatMarkdown(text) {
    if (!text) return '';
    let cleanedText = text
        .replace(/Powered by Pollinations\.AI.*/gi, '')
        .replace(/.*Support our mission.*/gi, '')
        .replace(/.*accessible for everyone.*/gi, '')
        .replace(/🌸\s*Ad\s*🌸/gi, '')
        .replace(/Pollinations\.AI:/gi, '');

    return cleanedText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/\*(.*?)\*/g, '<em>$1</em>')          
        .replace(/\n/g, '<br>')
        .trim();
}

// دالة بناء التنسيقات والقوالب مع دعم أبعاد الهوامش الديناميكية الجديدة
function getTemplateStyles(selectedLang, selectedTemplate) {
    const chosenFont = document.getElementById('fontFamilySelect').value;
    const chosenSize = document.getElementById('fontSizeSelect').value;
    const chosenLineHeight = document.getElementById('lineHeightSelect')?.value || "1.6";
    const chosenPadding = document.getElementById('paddingSelect')?.value || "22px";
    const activeColor = localStorage.getItem('cv_theme_color') || '#3b82f6';

    let styles = `padding:${chosenPadding}; line-height:${chosenLineHeight}; font-size:${chosenSize}; font-family:${chosenFont}; border-radius:8px; margin-top:15px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); overflow: hidden; box-sizing: border-box; background-color: #fff; color: #1e293b;`;
    styles += selectedLang === 'ar' ? " text-align: right; direction: rtl;" : " text-align: left; direction: ltr";
    
    if (selectedTemplate === 'modern') styles += ` background-color: #1e293b; color: #f8fafc; border-left: 6px solid ${activeColor}; border-right: none;`;
    else if (selectedTemplate === 'classic') styles += " background-color: #ffffff; color: #000000; border: 2px solid #000000;";
    else if (selectedTemplate === 'elegant') styles += ` background-color: #fafaf9; color: #1c1917; border-top: 6px solid ${activeColor};`;
    
    return styles;
}

// دالة حقن التوقيع البرمجي الموثق
function appendCryptoSignatureToCV(htmlContent) {
    const signatureHtml = `
        <div class="cv-crypto-footer" style="margin-top: 35px; padding-top: 15px; border-top: 1px dashed #cbd5e1; text-align: center; font-family: monospace; direction: ltr; clear: both;">
            <p style="font-size: 10px; color: #64748b; margin: 0; letter-spacing: 1px;">🔒 Digitally Signed & Verified via AI CV Optimizer</p>
            <p style="font-size: 11px; color: #0f172a; font-weight: bold; margin: 4px 0; letter-spacing: 0.5px;">Authority Key: @aliallamofficial [GPG: 55392380FBF1C8F1]</p>
        </div>
    `;
    return htmlContent + signatureHtml;
}

// دالة توليد الـ QR Code
function generateCVQRCode(containerId, textToEncode) {
    const existingQr = document.getElementById('cvQrCode');
    if (existingQr) existingQr.remove();

    const qrContainer = document.createElement('div');
    qrContainer.id = "cvQrCode";
    const isAr = document.getElementById('langSelect').value === 'ar';
    qrContainer.style = `float: ${isAr ? 'left' : 'right'}; margin: 10px; padding: 6px; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; display: inline-block; z-index: 10; position: relative;`;
    
    const targetElement = document.getElementById(containerId);
    if (targetElement) {
        targetElement.prepend(qrContainer);
        new QRCode(qrContainer, {
            text: textToEncode,
            width: 80,
            height: 80,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
}

// ==========================================
// 📄 ميزة: التنزيل المباشر المطور PDF (مع مهلة زمنية لمنع الصفحة البيضاء)
// ==========================================
document.getElementById('downloadPdfBtn').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cvElement = document.getElementById('cvTemplateArea');
    if (!cvElement || cvElement.innerText.trim() === "") {
        alert("الرجاء توليد السيرة الذاتية أولاً قبل التحميل!");
        return;
    }

    if (!cvElement.innerHTML.includes('cv-crypto-footer')) {
        cvElement.innerHTML = appendCryptoSignatureToCV(cvElement.innerHTML);
    }

    const fullName = document.getElementById('fullName').value.trim() || "CV";
    const originalBtnText = document.getElementById('downloadPdfBtn').innerText;
    document.getElementById('downloadPdfBtn').innerText = "⏳ جاري التجهيز والتنزيل...";

    const executeDirectDownload = () => {
        const options = {
            margin:       [10, 10, 10, 10],
            filename:     `${fullName}_Resume.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false, letterRendering: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // إضافة مهلة زمنية 500 ملي ثانية لضمان رندرة الـ DOM والـ CSS بالكامل
        setTimeout(() => {
            html2pdf().set(options).from(cvElement).save().then(() => {
                document.getElementById('downloadPdfBtn').innerText = originalBtnText;
                document.getElementById('downloadOptions').classList.add('hidden');
            }).catch((err) => {
                console.error(err);
                document.getElementById('downloadPdfBtn').innerText = originalBtnText;
            });
        }, 500);
    };

    if (typeof html2pdf === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = executeDirectDownload;
        script.onerror = () => {
            document.getElementById('downloadPdfBtn').innerText = originalBtnText;
            alert("فشل جلب أداة التنزيل المباشر، تأكد من اتصالك بالإنترنت.");
        };
        document.head.appendChild(script);
    } else {
        executeDirectDownload();
    }
});

// ==========================================
// 📝 ميزة: التنزيل المباشر كملف Word
// ==========================================
document.getElementById('downloadWordBtn').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cvElement = document.getElementById('cvTemplateArea');
    if (!cvElement || cvElement.innerText.trim() === "") {
        alert("الرجاء توليد السيرة الذاتية أولاً قبل التحميل!");
        return;
    }

    const fullName = document.getElementById('fullName').value.trim() || "CV";
    const htmlContent = cvElement.innerHTML;
    
    const blobContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Resume</title><meta charset='utf-8'></head>
      <body>${htmlContent}</body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + blobContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName}_Resume.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.getElementById('downloadOptions').classList.add('hidden');
});

// ==========================================
// ✨ حدث معالجة وإنشاء السيرة الذاتية الرئيسي (Optimize)
// ==========================================
document.getElementById('optimizeBtn').addEventListener('click', async () => {
    const btn = document.getElementById('optimizeBtn');
    const fullName = document.getElementById('fullName').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const skills = document.getElementById('skills').value.trim();
    const jdText = document.getElementById('jobDescriptionInput')?.value.trim() || "";
    const selectedLang = document.getElementById('langSelect').value;
    const selectedTemplate = document.getElementById('templateSelect').value;

    if (!fullName || !jobTitle) {
        alert(selectedLang === 'ar' ? 'رجاءً أدخل الاسم والمسمى الوظيفي على الأقل!' : 'Please enter Name and Job Title!');
        return;
    }

    if (!handleCVCreation()) return; 

    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');
    const downloadContainer = document.getElementById('downloadContainer');

    btn.disabled = true;
    loading.classList.remove('hidden');
    downloadContainer.classList.add('hidden');
    resultBox.innerHTML = '';

    if (navigator.onLine && jobTitle) {
        askAI(`أعطني نصيحة توظيف احترافية وموجزة جداً (سطر واحد فقط) لشخص يريد التقديم على وظيفة: ${jobTitle}`, "أنت خبير توظيف تعطي نصيحة مباشرة بدون مقدمات.")
        .then(aiTip => {
            if(aiTip) document.getElementById('liveTipText').innerText = aiTip;
        }).catch(()=>{});
    }

    if (!navigator.onLine) {
        alert(selectedLang === 'ar' ? "أنت تعمل الآن بدون إنترنت (Offline Mode)." : "You are offline.");
        let offlineResult = `<h2>${fullName}</h2><h3>${jobTitle}</h3><hr><br>${experience || ''}<br>${skills || ''}`;
        let templateStyles = getTemplateStyles(selectedLang, selectedTemplate);
        resultBox.innerHTML = `<div id="cvTemplateArea" style="${templateStyles}">${offlineResult}</div>`;
        downloadContainer.classList.remove('hidden');
        loading.classList.add('hidden');
        btn.disabled = false;
        return; 
    }

    let promptMessage = selectedLang === 'ar' ? 
        `قم بصياغة سيرة ذاتية احترافية وموجزة باللغة العربية للشخص التالي:\nالاسم: ${fullName}\nالوظيفة: ${jobTitle}\nالخبرات: ${experience || 'مبتدئ'}\nالمهارات: ${skills || 'تواصل'}\n\n` +
        (jdText ? `إعلان الوظيفة المستهدفة: ${jdText}\nشروط إضافية: قم بمطابقة السيرة الذاتية مع هذا الإعلان بذكاء ودمج الكلمات المفتاحية الأساسية المطلوبة فيه لضمان تخطي فحص الـ ATS بدقة شديدة.\n\n` : "") +
        `شروط صارمة: أسلوب بشري، نقاط واضحة (•)، أفعال حركة قوية، وقم بإجراء تدقيق لغوي وإملائي كامل وتصحيح كافة الأخطاء النحوية واللغوية بصرامة.` :
        `Create a professional resume in English for:\nName: ${fullName}\nJob: ${jobTitle}\nExperience: ${experience || 'Entry-level'}\nSkills: ${skills || 'Communication'}\n\n` +
        (jdText ? `Target Job Description: ${jdText}\nAdditional rules: Align the resume dynamically with this job description. Incorporate key technical and soft keywords from it to ensure flawless ATS compliance.\n\n` : "") +
        `Strict Rules: Human style, bullet points (•), and absolute proofreading to ensure zero spelling or grammatical errors.`;

    const systemMessage = selectedLang === 'ar' ? 
        "أنت مستشار توظيف خبير ومدقق لغوي صارم (HR & Proofreader Consultant). تكتب سير ذاتية بليغة خالية تماماً من الأخطاء وتطابق أنظمة الـ ATS بشكل استراتيجي." : 
        "You are an expert HR Consultant and professional editor. You write flawless, ATS-friendly resumes aligned perfectly with specific job requirements.";

    try {
        const aiResult = await askAI(promptMessage, systemMessage);
        if (aiResult && aiResult.trim().length > 0) {
            let templateStyles = getTemplateStyles(selectedLang, selectedTemplate);
            let formattedResult = formatMarkdown(aiResult);
            
            resultBox.innerHTML = `<div id="cvTemplateArea" style="${templateStyles}">${formattedResult}</div>`;
            generateCVQRCode('cvTemplateArea', `https://aliallamofficial.github.io/ali-cv-builder/?user=${encodeURIComponent(fullName)}`);
            downloadContainer.classList.remove('hidden'); 
        } else { throw new Error(); }
    } catch (error) {
        resultBox.innerHTML = `<p style="color:red;">السيرفر مشغول حالياً بالمعالجة، يرجى النقر مرة أخرى بعد لحظات.</p>`;
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// ==========================================
// ✉️ صانع رسائل التغطية الذكي (AI Cover Letter Generator)
// ==========================================
document.getElementById('coverLetterBtn').addEventListener('click', async () => {
    const btn = document.getElementById('coverLetterBtn');
    const fullName = document.getElementById('fullName').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const selectedLang = document.getElementById('langSelect').value;

    if (!fullName || !jobTitle) {
        alert(selectedLang === 'ar' ? 'رجاءً أدخل الاسم والمسمى الوظيفي أولاً لإنشاء رسالة التغطية!' : 'Please enter Name and Job Title first!');
        return;
    }

    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');
    btn.disabled = true;
    loading.classList.remove('hidden');

    let promptMessage = selectedLang === 'ar' ?
        `اكتب رسالة تغطية (Cover Letter) احترافية ومقنعة وموجهة لمدير التوظيف باسم المرشح: ${fullName} للتقديم على وظيفة: ${jobTitle}. بناءً على خبراته المذكورة باختصار: ${experience || 'مبتدئ متحمس'}. اجعلها منسقة وخالية تماماً من الأخطاء اللغوية.` :
        `Write a professional Cover Letter from ${fullName} for a ${jobTitle} position based on this brief experience: ${experience || 'Enthusiastic entry-level'}. Ensure zero grammatical mistakes.`;

    try {
        const aiResult = await askAI(promptMessage, "أنت خبير صياغة خطابات التوظيف الرسمية. تكتب بأسلوب جذاب وبليغ.");
        if (aiResult) {
            let formattedLetter = formatMarkdown(aiResult);
            let templateStyles = getTemplateStyles(selectedLang, document.getElementById('templateSelect').value);
            resultBox.innerHTML = `<div id="cvTemplateArea" style="${templateStyles}"><h3>✉️ رسالة التغطية الاحترافية (Cover Letter):</h3><br>${formattedLetter}</div>`;
            document.getElementById('downloadContainer').classList.remove('hidden');
        }
    } catch (e) {
        alert("السيرفر مضغوط حالياً، يرجى المحاولة بعد قليل.");
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// ==========================================
// 🏁 تهيئة وتفعيل المنظومة عند تحميل المستند
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    displayRandomLiveTip();
    initAppTour();
    initCVScoreGauge();
    initInlineAIWriters();
    initAIInterviewPrep();
    initThemeColorPicker();
    
    const dropBtn = document.getElementById('dropdownToggleBtn');
    const menu = document.getElementById('topLeftMenu');
    if (dropBtn && menu) {
        dropBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }

    const openSettings = document.getElementById('openSettingsBtn');
    const closeSettings = document.getElementById('closeSettingsBtn');
    const modal = document.getElementById('settingsPageModal');
    if(openSettings && modal) openSettings.addEventListener('click', () => { modal.classList.remove('hidden'); menu.classList.add('hidden'); });
    
    if(closeSettings && modal) {
        closeSettings.addEventListener('click', () => {
            modal.classList.add('hidden');
            const cvArea = document.getElementById('cvTemplateArea');
            if (cvArea) {
                cvArea.style.cssText = getTemplateStyles(document.getElementById('langSelect').value, document.getElementById('templateSelect').value);
            }
        });
    }

    const mainDown = document.getElementById('mainDownloadBtn');
    const downOpts = document.getElementById('downloadOptions');
    if(mainDown && downOpts) {
        mainDown.addEventListener('click', (e) => {
            e.stopPropagation();
            downOpts.classList.toggle('hidden');
        });
        document.addEventListener('click', () => downOpts.classList.add('hidden'));
    }
});
