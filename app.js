// ==========================================
// 💡 مصفوفة النصائح الجاهزة لتغيير النصيحة تلقائياً محلياً (عند عدم الاتصال)
// ==========================================
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

// ==========================================
// 🔥 ميزة 1: عداد قياس قوة وجاهزية الـ CV لنظام الـ ATS
// ==========================================
function initCVScoreGauge() {
    const inputSection = document.querySelector('.input-section');
    if (!inputSection || document.getElementById('cvScoreContainer')) return;

    const gaugeContainer = document.createElement('div');
    gaugeContainer.id = 'cvScoreContainer';
    gaugeContainer.style.cssText = `
        background: #0f172a;
        border: 1px solid #334155;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
    `;

    gaugeContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="color: #94a3b8; font-size: 14px; font-weight: bold;">📊 مدى جاهزية وقوة السيرة الذاتية لـ ATS:</span>
            <span id="cvScorePercent" style="color: #38bdf8; font-weight: bold; font-size: 16px;">0%</span>
        </div>
        <div style="width: 100%; background: #1e293b; height: 10px; border-radius: 5px; overflow: hidden;">
            <div id="cvScoreBar" style="width: 0%; height: 100%; background: #ef4444; transition: width 0.4s ease; border-radius: 5px;"></div>
        </div>
        <p id="cvScoreFeedback" style="margin: 8px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.4;">ابدأ بكتابة بياناتك ليقوم مستشار الذكاء الاصطناعي بتقييمها لحظياً...</p>
    `;

    inputSection.insertBefore(gaugeContainer, inputSection.firstChild);

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
            scoreFeedback.style.color = '#ef4444';
        } else if (score < 75) {
            scoreBar.style.background = '#f59e0b';
            scoreFeedback.innerHTML = '⚡ أداء جيد! أضف المزيد من المهارات أو تفاصيل الخبرة لتخطي حاجز المنافسة.';
            scoreFeedback.style.color = '#f59e0b';
        } else {
            scoreBar.style.background = '#10b981';
            scoreFeedback.innerHTML = '🔥 مذهل! السيرة الذاتية مدعمة بكلمات مفتاحية قوية وجاهزة للقنص الرقمي.';
            scoreFeedback.style.color = '#10b981';
        }
    }
}

// ==========================================
// 🔥 ميزة 2: نظام تخصيص الثيم الملون التفاعلي (Dynamic Color Picker)
// ==========================================
function initThemeColorPicker() {
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody || document.getElementById('themeColorSection')) return;

    const colorCard = document.createElement('div');
    colorCard.id = 'themeColorSection';
    colorCard.className = 'settings-section-card';
    colorCard.innerHTML = `
        <h3>🎨 لون الهوية البصرية المخصص</h3>
        <p>اختر اللون الرئيسي المفضل لتخصيص خطوط وعناوين سيرتك الذاتية بشكل فوري ومميز.</p>
        <div style="display:flex; gap:12px; margin-top:10px; align-items:center;">
            <input type="color" id="themePrimaryColor" value="${localStorage.getItem('cv_theme_color') || '#3b82f6'}" style="width:50px; height:35px; border:none; border-radius:4px; cursor:pointer; background:none;">
            <span style="font-size:13px; color:#cbd5e1;">اضغط على الصندوق لاختيار درجة لونك المفضلة</span>
        </div>
    `;
    modalBody.insertBefore(colorCard, modalBody.firstChild);

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
        if (document.getElementById('templateSelect').value === 'modern') {
            cvArea.style.borderLeftColor = activeColor;
        } else if (document.getElementById('templateSelect').value === 'elegant') {
            cvArea.style.borderTopColor = activeColor;
        }
    }
}

// دالة التحقق من حد الاستخدام اليومي المخصص (5 مرات في اليوم)
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
// 🤖 دالة عامة مطورة ومحمية للاتصال بالذكاء الاصطناعي مع معالجة صامتة لضغط السيرفر
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
// ✨ دالة تحويل الـ Markdown مع تنظيف دقيق للنصوص الإعلانية والترويجية لـ Pollinations
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

// دالة لتطبيق ثيم القوالب
function getTemplateStyles(selectedLang, selectedTemplate) {
    const chosenFont = document.getElementById('fontFamilySelect').value;
    const chosenSize = document.getElementById('fontSizeSelect').value;
    const activeColor = localStorage.getItem('cv_theme_color') || '#3b82f6';

    let styles = `padding:25px; line-height:1.8; font-size:${chosenSize}; font-family:${chosenFont}; border-radius:8px; margin-top:15px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); overflow: hidden;`;
    styles += selectedLang === 'ar' ? " text-align: right; direction: rtl;" : " text-align: left; direction: ltr;";
    
    if (selectedTemplate === 'modern') styles += ` background-color: #1e293b; color: #f8fafc; border-left: 6px solid ${activeColor};`;
    else if (selectedTemplate === 'classic') styles += " background-color: #ffffff; color: #000000; border: 2px solid #000000;";
    else if (selectedTemplate === 'elegant') styles += ` background-color: #fafaf9; color: #1c1917; border-top: 6px solid ${activeColor};`;
    
    return styles;
}

// دالة لحقن التوقيع الرقمي ومفتاح الـ GPG
function appendCryptoSignatureToCV(htmlContent) {
    const signatureHtml = `
        <div class="cv-crypto-footer" style="margin-top: 35px; padding-top: 15px; border-top: 1px dashed #cbd5e1; text-align: center; font-family: monospace; direction: ltr; clear: both;">
            <p style="font-size: 10px; color: #64748b; margin: 0; letter-spacing: 1px;">🔒 Digitally Signed & Verified via AI CV Optimizer</p>
            <p style="font-size: 11px; color: #0f172a; font-weight: bold; margin: 4px 0; letter-spacing: 0.5px;">Authority Key: @aliallamofficial [GPG: 55392380FBF1C8F1]</p>
        </div>
    `;
    return htmlContent + signatureHtml;
}

// دالة لتوليد الـ QR Code السريع
function generateCVQRCode(containerId, textToEncode) {
    const existingQr = document.getElementById('cvQrCode');
    if (existingQr) existingQr.remove();

    const qrContainer = document.createElement('div');
    qrContainer.id = "cvQrCode";
    const isAr = document.getElementById('langSelect').value === 'ar';
    qrContainer.style = `float: ${isAr ? 'left' : 'right'}; margin: 10px; padding: 6px; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; display: inline-block;`;
    
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
// 📄 🔥 ميزة 3: التنزيل المباشر الفوري كملف PDF
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
    document.getElementById('downloadPdfBtn').innerText = "⏳ جاري التنزيل المباشر...";

    const executeDirectDownload = () => {
        const options = {
            margin:       [10, 10, 10, 10],
            filename:     `${fullName}_Resume.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(cvElement).save().then(() => {
            document.getElementById('downloadPdfBtn').innerText = originalBtnText;
            document.getElementById('downloadOptions').classList.add('hidden');
        }).catch((err) => {
            console.error(err);
            document.getElementById('downloadPdfBtn').innerText = originalBtnText;
        });
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
// 📝 ميزة 4: التنزيل المباشر كملف Word (.doc)
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

    const blob = new Blob(['\ufeff' + blobContent], {
        type: 'application/msword;charset=utf-8'
    });

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

// حدث تحسين السيرة الذاتية
document.getElementById('optimizeBtn').addEventListener('click', async () => {
    const btn = document.getElementById('optimizeBtn');
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
        `قم بصياغة سيرة ذاتية احترافية وموجزة باللغة العربية للشخص التالي:\nالاسم: ${fullName}\nالوظيفة: ${jobTitle}\nالخبرات: ${experience || 'مبتدئ'}\nالمهارات: ${skills || 'تواصل'}\n\nشروط صارمة: أسلوب بشري، نقاط واضحة (•)، أفعال حركة قوية، وقم بإجراء تدقيق لغوي وإملائي كامل وتصحيح كافة الأخطاء النحوية واللغوية بصرامة.` :
        `Create a professional resume in English for:\nName: ${fullName}\nJob: ${jobTitle}\nExperience: ${experience || 'Entry-level'}\nSkills: ${skills || 'Communication'}\n\nStrict Rules: Human style, bullet points (•), and absolute proofreading to ensure zero spelling or grammatical errors.`;

    const systemMessage = selectedLang === 'ar' ? 
        "أنت مستشار توظيف خبير ومدقق لغوي صارم (HR & Proofreader Consultant). تكتب سير ذاتية بليغة خالية تماماً من الأخطاء." : 
        "You are an expert HR Consultant and professional editor. You write flawless, ATS-friendly resumes.";

    try {
        const aiResult = await askAI(promptMessage, systemMessage);
        if (aiResult && aiResult.trim().length > 0) {
            let templateStyles = getTemplateStyles(selectedLang, selectedTemplate);
            let formattedResult = formatMarkdown(aiResult);
            
            resultBox.innerHTML = `<div id="cvTemplateArea" style="${templateStyles}">${formattedResult}</div>`;
            generateCVQRCode('cvTemplateArea', `https://aliallamofficial.github.io/ali-cv-builder/?user=${encodeURIComponent(fullName)}`);
            downloadContainer.classList.remove('hidden'); 
            applyThemeColorToLiveCV();
        } else { throw new Error(); }
    } catch (error) {
        resultBox.innerHTML = `<p style="color:red;">السيرفر مشغول حالياً بالمعالجة، يرجى النقر مرة أخرى بعد لحظات.</p>`;
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// ✉️ صانع رسائل التغطية الذكي (AI Cover Letter Generator)
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

    if (!navigator.onLine) {
        alert(selectedLang === 'ar' ? "هذه الميزة تتطلب اتصالاً بالإنترنت." : "This feature requires an internet connection.");
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
            applyThemeColorToLiveCV();
        }
    } catch (e) {
        alert("السيرفر مضغوط حالياً، يرجى المحاولة بعد قليل.");
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// تهيئة الأدوات عند تحميل الصفحة والنافذة المنبثقة بشكل فوري
document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    if(splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 500);
        }, 1000);
    }
    
    // عرض النصيحة العشوائية فوراً بمجرد فتح التطبيق ودخول المستخدم
    displayRandomLiveTip();
    
    initCVScoreGauge();
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
    if(closeSettings && modal) closeSettings.addEventListener('click', () => modal.classList.add('hidden'));

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
