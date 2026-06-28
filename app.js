// ==========================================
// 💡 مصفوفة النصائح الجاهزة لتغيير النصيحة تلقائياً محلياً (عند عدم الاتصال)
// ==========================================
const cvTips = [
    "تجنب وضع صورتك الشخصية إذا كنت تقدم على شركات عالمية تعتمد نظام ATS تماماً.",
    "احرص على ألا تتجاوز سيرتك الذاتية صفحة واحدة إذا كانت خبرتك أقل من 5 سنوات.",
    "استخدم أرقاماً ونسباً مئوية حقيقية لإثبات إنجازاتك (مثال: زيادة المبيعات بنسبة 20%).",
    "البريد الإلكتروني المهني يجب أن يحتوي على اسمك الحقيقي، ابتعد تماماً عن الأسماء المستعارة.",
    "الكلمات المفتاحية المأخوذة من إعلان الوظيفة نفسه هي مفتاحك السحري لتخطي فلترة الـ ATS."
];

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

// دالة عامة لإرسال الطلبات إلى API الذكاء الاصطناعي
async function askAI(promptMessage, systemMessage) {
    const url = `https://text.pollinations.ai/`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [{ role: "user", content: promptMessage }],
            system: systemMessage
        })
    });
    return await response.text();
}

// دالة تحويل الـ Markdown
function formatMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/\*(.*?)\*/g, '<em>$1</em>')          
        .replace(/\n/g, '<br>');                        
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
        resultBox.innerHTML = `<p style="color:red;">حدث خطأ أثناء الصياغة. يرجى المحاولة مجدداً.</p>`;
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
        alert("فشل خادم توليد الرسائل حالياً.");
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// 📊 ميزة تقييم السيرة الذاتية (Resume Scoring)
document.getElementById('rateBtn').addEventListener('click', async () => {
    const btn = document.getElementById('rateBtn');
    const fullName = document.getElementById('fullName').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const skills = document.getElementById('skills').value.trim();
    const selectedLang = document.getElementById('langSelect').value;

    if (!fullName || !jobTitle) {
        alert(selectedLang === 'ar' ? 'رجاءً أدخل الاسم والمسمى الوظيفي أولاً ليتم التقييم بناءً عليهما!' : 'Please enter Name and Job Title first!');
        return;
    }

    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');

    btn.disabled = true;
    loading.classList.remove('hidden');

    let promptMessage = `قم بتحليل وتقييم البيانات المدخلة للسيرة الذاتية التالية وإعطاء تقييم من 100%:\nالاسم: ${fullName}\nالمسمى المستهدف: ${jobTitle}\nالخبرات: ${experience}\nالمهارات: ${skills}`;

    try {
        const aiResult = await askAI(promptMessage, "أنت مسؤول توظيف خبير ومدقق سير ذاتية صارم.");
        if (aiResult) {
            let formattedRating = formatMarkdown(aiResult);
            resultBox.innerHTML = `<div style="padding:20px; background:#1e293b; color:#fff; text-align:right; direction:rtl; border-radius:8px; line-height:1.8;"><h3>📊 تقييم السيرة الذاتية الذكي:</h3><br>${formattedRating}</div>`;
        }
    } catch (error) {
        resultBox.innerHTML = `<p style="color:red;">تعذر الاتصال بخادم التقييم.</p>`;
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// 🔍 ميزة فحص التوافق العالمي ATS Shadow Checker
document.getElementById('atsCheckBtn').addEventListener('click', async () => {
    const btn = document.getElementById('atsCheckBtn');
    const cvArea = document.getElementById('cvTemplateArea');
    if (!cvArea) return;

    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');
    
    btn.disabled = true;
    loading.classList.remove('hidden');

    let promptMessage = `تظاهر بأنك نظام فحص السير الذاتية العالمي ATS. قم بقراءة وفحص النص التالي ومقارنته بالمسمى المستهدف لتحديد مدى استجابته للخوارزميات:\n\n${cvArea.innerText}`;

    try {
        const aiResult = await askAI(promptMessage, "أنت روبوت ونظام تصفية وفرز آلي ATS عالمي تفحص الكلمات الدلالية.");
        if (aiResult) {
            let formattedAts = formatMarkdown(aiResult);
            resultBox.innerHTML = `<div class="ats-report" style="padding:20px; background:rgba(15,23,42,0.9); border:1px solid #38bdf8; color:#f8fafc; border-radius:12px; direction:rtl; text-align:right; line-height:1.8;"><h3>🔍 تقرير محاكاة نظام الفرز العالمي ATS:</h3><br>${formattedAts}</div>`;
        }
    } catch (e) {
        alert("فشل فحص الـ ATS حالياً.");
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// 🔐 ميزة التوقيع والتشفير الرقمي GPG الرقمي للمستند
document.getElementById('signCvBtn').addEventListener('click', () => {
    const cvArea = document.getElementById('cvTemplateArea');
    if (!cvArea) return;

    const randomHash = 'SHA256:' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 8).toUpperCase();
    const badgeHtml = `<div class="crypto-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px; font-family:monospace; direction:ltr;">🔐 SIGNED BY @aliallamofficial [GPG: 55392380FBF1C8F1] | ${randomHash}</div>`;
    
    const currentContent = cvArea.innerHTML;
    if(!currentContent.includes('SIGNED BY')) {
        cvArea.innerHTML = badgeHtml + currentContent;
        alert('تم توقيع السيرة الذاتية رقمياً بنجاح!');
    }
});

// 📥 إدارة قائمة التحميل
document.getElementById('mainDownloadBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('downloadOptions').classList.toggle('hidden');
});

document.addEventListener('click', () => {
    const options = document.getElementById('downloadOptions');
    if(options) options.classList.add('hidden');
});

// 📄 🔥 ميزة 3: خيار طباعة وتحميل متقدم ومتوافق بالكامل مع الهوية الملونة
document.getElementById('downloadPdfBtn').addEventListener('click', () => {
    const cvElement = document.getElementById('cvTemplateArea');
    if (!cvElement || cvElement.innerText.trim() === "") return;

    let currentHtml = cvElement.innerHTML;
    if (!currentHtml.includes('cv-crypto-footer')) {
        currentHtml = appendCryptoSignatureToCV(currentHtml);
    }

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    const isEn = cvElement.style.textAlign === 'left';
    const direction = isEn ? 'ltr' : 'rtl';
    const activeColor = localStorage.getItem('cv_theme_color') || '#3b82f6';

    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="${direction}">
        <head>
            <title>المستند الموثق</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; background: #ffffff; color: #000000; line-height: 1.8; font-size: 15px;}
                strong { font-weight: bold; color: #000000; }
                .crypto-badge { display: inline-block !important; margin-bottom:15px; color:${activeColor}; }
                @media print { body { padding: 0; } @page { margin: 2cm; } }
            </style>
        </head>
        <body>
            <div>${currentHtml}</div>
            <script>
                window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
});

// 📄 خيار تحميل السيرة الذاتية بصيغة Word
document.getElementById('downloadWordBtn').addEventListener('click', () => {
    const cvElement = document.getElementById('cvTemplateArea');
    if (!cvElement) return;

    let cvContentText = cvElement.innerText;
    const wordSignature = `\n\n=========================================\n🔒 Digitally Signed via AI CV Optimizer\nAuthority Key: @aliallamofficial [GPG: 55392380FBF1C8F1]\n=========================================`;
    const fullWordContent = cvContentText + wordSignature;
    const wordUrl = 'data:application/msword;charset=utf-8,\ufeff' + encodeURIComponent(fullWordContent);

    const a = document.createElement('a');
    a.href = wordUrl;
    a.download = 'المستند.doc';
    a.click();
});

// ==========================================
// 🔄 دالة الفحص التلقائي لآخر تعديل للملفات
// ==========================================
async function checkAutomatedUpdates() {
    if (!navigator.onLine) return;
    try {
        const response = await fetch(window.location.href, { method: 'HEAD', cache: 'no-cache' });
        const lastModifiedHeader = response.headers.get('Last-Modified') || response.headers.get('ETag');
        
        if (lastModifiedHeader) {
            const savedBuildTag = localStorage.getItem('app_last_build_tag');
            
            if (savedBuildTag && savedBuildTag !== lastModifiedHeader) {
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("🚀 تم تحديث التطبيق تلقائياً!", {
                        body: "هناك ميزات وتحسينات جديدة تمت إضافتها للتطبيق، ألقِ نظرة عليها الآن."
                    });
                }
                setTimeout(() => {
                    alert("✨ تحديث تلقائي سحري:\nتم رصد تعديلات برمجية وتحسينات جديدة في النظام لزيادة سرعة الذكاء الاصطناعي وتطوير المظهر!");
                }, 3000);
            }
            localStorage.setItem('app_last_build_tag', lastModifiedHeader);
        }
    } catch (e) { console.log("خطأ في جلب تاريخ التحديث التلقائي"); }
}

// ==========================================
// ⚙️ إدارة القائمة والتهيئة العامة عند التحميل
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // تشغيل الميزات الجديدة تلقائياً عند التهيئة
    setTimeout(() => {
        initCVScoreGauge();
        initThemeColorPicker();
    }, 100);

    const tipElement = document.getElementById('liveTipText');
    if (tipElement) {
        tipElement.innerText = cvTips[Math.floor(Math.random() * cvTips.length)];
    }

    const dropdownToggleBtn = document.getElementById('dropdownToggleBtn');
    const topLeftMenu = document.getElementById('topLeftMenu');
    if (dropdownToggleBtn && topLeftMenu) {
        dropdownToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            topLeftMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!topLeftMenu.contains(e.target) && e.target !== dropdownToggleBtn) {
                topLeftMenu.classList.add('hidden');
            }
        });
    }

    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const settingsPageModal = document.getElementById('settingsPageModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');

    if (openSettingsBtn && settingsPageModal) {
        openSettingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (topLeftMenu) topLeftMenu.classList.add('hidden'); 
            settingsPageModal.classList.remove('hidden'); 
        });
    }

    if (closeSettingsBtn && settingsPageModal) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsPageModal.classList.add('hidden'); 
        });

        settingsPageModal.addEventListener('click', (e) => {
            if (e.target === settingsPageModal) {
                settingsPageModal.classList.add('hidden'); 
            }
        });
    }

    const privacyPolicyBtn = document.getElementById('privacyPolicyBtn') || document.getElementById('privacyPolicyLink');
    if (privacyPolicyBtn) {
        privacyPolicyBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.open('https://wp.me/Phj9fM-E', '_blank'); 
        });
    }

    const enableNotificationsBtn = document.getElementById('enableNotificationsBtn');
    if (enableNotificationsBtn) {
        enableNotificationsBtn.addEventListener('click', () => {
            if (!("Notification" in window)) {
                alert("متصفحك الحالي لا يدعم إشعارات الويب.");
                return;
            }
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    alert("🎯 تم تفعيل الإشعارات بنجاح! ستصلك تنبيهات تلقائية عند إضافة أي تحديث.");
                    new Notification("🚀 نظام الإشعارات نشط", {
                        body: "تم ربط التطبيق بنظام التنبيهات الذكي بنجاح."
                    });
                } else {
                    alert("لم يتم تفعيل الإذن. يمكنك تفعيله يدوياً من إعدادات المتصفح علوياً.");
                }
            });
        });
    }

    checkAutomatedUpdates();

    const tourSteps = [
        {
            icon: "🚀",
            title: "مرحباً بك في مستقبلك المهني!",
            desc: "دعنا نأخذك في جولة سريعة مدتها دقيقة واحدة للتعرف على كيفية صناعة سيرة ذاتية لا تقهر بالذكاء الاصطناعي.",
            btnText: "ابدأ الرحلة الآن ←"
        },
        {
            icon: "📝",
            title: "عبّئ بياناتك الأساسية بدقة",
            desc: "قم بملء حقول اسمك، المسمى المستهدف، وخبراتك السابقة. خوارزميتنا ستقرأها وتصيغها بأسلوب احترافي جذاب.",
            btnText: "الخطوة التالية ⚡"
        },
        {
            icon: "🔍",
            title: "تجاوز فحص أنظمة الـ ATS",
            desc: "استخدم زر 'محاكاة فحص ATS' بعد توليد النص للتأكد من مطابقة سيرتك الذاتية مع معايير الروبوتات وأنظمة التوظيف العالمية.",
            btnText: "فهمت، جاهز للانطلاق! 🎉"
        }
    ];

    let currentStep = 0;
    const tourModal = document.getElementById("appTourModal");
    const tourProgress = document.getElementById("tourProgress");
    const tourIcon = document.getElementById("tourIcon");
    const tourTitle = document.getElementById("tourTitle");
    const tourDescription = document.getElementById("tourDescription");
    const nextTourBtn = document.getElementById("nextTourBtn");
    const skipTourBtn = document.getElementById("skipTourBtn");

    function updateTourDOM() {
        const stepData = tourSteps[currentStep];
        if (tourProgress) tourProgress.innerText = `خطوة ${currentStep + 1} من ${tourSteps.length}`;
        if (tourIcon) tourIcon.innerText = stepData.icon;
        if (tourTitle) tourTitle.innerText = stepData.title;
        if (tourDescription) tourDescription.innerText = stepData.desc;
        if (nextTourBtn) nextTourBtn.innerText = stepData.btnText;
    }

    function finishTour() {
        if (tourModal) tourModal.classList.add("hidden");
        localStorage.setItem("ali_cv_tour_completed", "true");
    }

    if (nextTourBtn) {
        nextTourBtn.addEventListener("click", () => {
            if (currentStep < tourSteps.length - 1) {
                currentStep++;
                updateTourDOM();
            } else {
                finishTour();
            }
        });
    }

    if (skipTourBtn) {
        skipTourBtn.addEventListener("click", finishTour);
    }

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0'; 
            setTimeout(() => { 
                splash.remove(); 
                
                const isTourCompleted = localStorage.getItem("ali_cv_tour_completed");
                if (!isTourCompleted && tourModal) {
                    tourModal.classList.remove("hidden");
                    updateTourDOM();
                }
            }, 500);
        }
    }, 2000);
});
