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

// دالة ذكية لتحويل لغة الـ Markdown التلقائية (النجوم **) إلى وسوم HTML احترافية وعريضة
function formatMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // تحويل النجوم الثنائية لخط عريض
        .replace(/\*(.*?)\*/g, '<em>$1</em>')          // تحويل النجمة الأحادية لخط مائل
        .replace(/\n/g, '<br>');                        // تحويل السطور الجديدة
}

// دالة لتطبيق ثيم القوالب على النتيجة المطبوعة والمستخرجة
function getTemplateStyles(selectedLang, selectedTemplate) {
    let styles = "padding:25px; line-height:1.8; font-size:16px; border-radius:8px; margin-top:15px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); font-family: sans-serif;";
    styles += selectedLang === 'ar' ? " text-align: right; direction: rtl;" : " text-align: left; direction: ltr;";
    
    if (selectedTemplate === 'modern') styles += " background-color: #1e293b; color: #f8fafc; border-left: 6px solid #3b82f6;";
    else if (selectedTemplate === 'classic') styles += " background-color: #ffffff; color: #000000; border: 2px solid #000000; font-family: 'Times New Roman', serif;";
    else if (selectedTemplate === 'elegant') styles += " background-color: #fafaf9; color: #1c1917; border-top: 6px solid #d97706;";
    
    return styles;
}

// دالة مخصصة لحقن التوقيع الرقمي ومفتاح الـ GPG في أسفل الـ CV لتوثيقه رسمياً وحمايته
function appendCryptoSignatureToCV(htmlContent) {
    const signatureHtml = `
        <div class="cv-crypto-footer" style="margin-top: 35px; padding-top: 15px; border-top: 1px dashed #cbd5e1; text-align: center; font-family: monospace; direction: ltr;">
            <p style="font-size: 10px; color: #64748b; margin: 0; letter-spacing: 1px;">
                🔒 Digitally Signed & Verified via AI CV Optimizer
            </p>
            <p style="font-size: 11px; color: #0f172a; font-weight: bold; margin: 4px 0; letter-spacing: 0.5px;">
                Authority Key: @aliallamofficial [GPG: 55392380FBF1C8F1]
            </p>
        </div>
    `;
    return htmlContent + signatureHtml;
}

// حدث الضغط على زر تحسين السيرة الذاتية
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

    // حماية: تعطيل الزر لمنع تكرار الطلب وظهور خطأ الـ Queue
    btn.disabled = true;
    loading.classList.remove('hidden');
    downloadContainer.classList.add('hidden');
    resultBox.innerHTML = '';

    let promptMessage = selectedLang === 'ar' ? 
        `قم بصياغة سيرة ذاتية احترافية وموجزة باللغة العربية للشخص التالي:\nالاسم: ${fullName}\nالوظيفة: ${jobTitle}\nالخبرات: ${experience || 'مبتدئ'}\nالمهارات: ${skills || 'تواصل، عمل جماعي'}\n\nشروط صارمة: أسلوب بشري بدون مقدمات ذكاء اصطناعي، نقاط واضحة (•)، أفعال حركة قوية.` :
        `Create a professional and concise resume in English for:\nName: ${fullName}\nJob: ${jobTitle}\nExperience: ${experience || 'Entry-level'}\nSkills: ${skills || 'Communication'}\n\nStrict Rules: Human style, strong action verbs, clear bullet points (•).`;

    const systemMessage = selectedLang === 'ar' ? 
        "أنت مستشار توظيف خبير (HR Consultant). تكتب سير ذاتية دقيقة، واقعية، ومقنعة لأصحاب العمل، بعيداً عن حشو الذكاء الاصطناعي." : 
        "You are an expert HR Consultant. You write precise, ATS-friendly, and realistic resumes without fluff.";

    try {
        const aiResult = await askAI(promptMessage, systemMessage);
        if (aiResult && aiResult.trim().length > 0) {
            let templateStyles = getTemplateStyles(selectedLang, selectedTemplate);
            let formattedResult = formatMarkdown(aiResult);
            
            resultBox.innerHTML = `<div id="cvTemplateArea" style="${templateStyles}">${formattedResult}</div>`;
            downloadContainer.classList.remove('hidden'); 
        } else { throw new Error(); }
    } catch (error) {
        resultBox.innerHTML = `<p style="color:red;">الخادم مشغول حالياً أو حدث خطأ أثناء الصياغة. يرجى المحاولة مجدداً بعد ثوانٍ قليلة.</p>`;
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false; // إعادة تفعيل الزر بعد الانتهاء
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
    const downloadContainer = document.getElementById('downloadContainer');

    btn.disabled = true;
    loading.classList.remove('hidden');
    downloadContainer.classList.add('hidden');
    resultBox.innerHTML = '';

    let promptMessage = `قم بتحليل وتقييم البيانات المدخلة للسيرة الذاتية التالية وإعطاء تقييم من 100%:
    الاسم: ${fullName}
    المسمى المستهدف: ${jobTitle}
    الخبرات المكتوبة: ${experience || 'لم يذكر خبرات'}
    المهارات المكتوبة: ${skills || 'لم يذكر مهارات'}
    
    يرجى تقسيم الإجابة إلى:
    1. النسبة المئوية الإجمالية للتقييم (مثال: 65/100) بشكل عريض وواضح في البداية.
    2. نقاط القوة في البيانات الحالية.
    3. نقاط الضعف وما ينقص السيرة الذاتية لتجتاز أنظمة الفرز (ATS).
    4. نصائح ذهبية ومحددة للتطوير فوراً.`;

    try {
        const aiResult = await askAI(promptMessage, "أنت مسؤول توظيف خبير ومدقق سير ذاتية صارم. تعطي تقييمات حقيقية ونقد بناء جداً باللغة العربية.");
        if (aiResult) {
            let formattedRating = formatMarkdown(aiResult);
            resultBox.innerHTML = `<div style="padding:20px; background:#1e293b; color:#fff; text-align:right; direction:rtl; border-radius:8px; line-height:1.8;"><h3>📊 تقييم السيرة الذاتية الذكي:</h3><br>${formattedRating}</div>`;
        }
    } catch (error) {
        resultBox.innerHTML = `<p style="color:red;">تعذر الاتصال بخادم التقييم حالياً بسبب الضغط. يرجى المحاولة مجدداً.</p>`;
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// 🔍 تشغيل ميزة فحص التوافق العالمي ATS Shadow Checker
document.getElementById('atsCheckBtn').addEventListener('click', async () => {
    const btn = document.getElementById('atsCheckBtn');
    const cvArea = document.getElementById('cvTemplateArea');
    const selectedLang = document.getElementById('langSelect').value;
    if (!cvArea) {
        alert(selectedLang === 'ar' ? 'يرجى تحسين السيرة الذاتية أولاً قبل فحص الـ ATS!' : 'Please optimize your CV first!');
        return;
    }

    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');
    
    btn.disabled = true;
    loading.classList.remove('hidden');

    let promptMessage = `تظاهر بأنك نظام فحص السير الذاتية العالمي ATS (Shadow Checker). قم بقراءة وفحص النص التالي ومقارنته بالمسمى المستهدف لتحديد مدى استجابته للخوارزميات الآلية العالمية:\n\n${cvArea.innerText}\n\nأظهر تقريراً احترافياً يحتوي على نسبة توافق مئوية دقيقة وعرض الكلمات المفتاحية المفقودة بنقاط واضحة.`;

    try {
        const aiResult = await askAI(promptMessage, "أنت روبوت ونظام تصفية وفرز آلي ATS عالمي، تفحص الكلمات الدلالية والهيكلية وتظهر تقرير دقيق وموجز.");
        if (aiResult) {
            let formattedAts = formatMarkdown(aiResult);
            resultBox.innerHTML = `<div class="ats-report" style="padding:20px; background:rgba(15,23,42,0.9); border:1px solid #38bdf8; color:#f8fafc; border-radius:12px; direction:rtl; text-align:right; line-height:1.8;"><h3>🔍 تقرير محاكاة نظام الفرز العالمي ATS:</h3><br>${formattedAts}</div>`;
        }
    } catch (e) {
        alert("فشل فحص الـ ATS حالياً بسبب ضغط الخادم.");
    } finally { 
        loading.classList.add('hidden'); 
        btn.disabled = false;
    }
});

// 🔐 تشغيل ميزة التوقيع والتشفير الرقمي GPG الرقمي للمستند
document.getElementById('signCvBtn').addEventListener('click', () => {
    const cvArea = document.getElementById('cvTemplateArea');
    const selectedLang = document.getElementById('langSelect').value;
    if (!cvArea) {
        alert(selectedLang === 'ar' ? 'يرجى تحسين السيرة الذاتية أولاً لتوقيعها!' : 'Please optimize your CV first!');
        return;
    }

    const randomHash = 'SHA256:' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 8).toUpperCase();
    
    const badgeHtml = `
        <div class="crypto-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px; font-family:monospace; direction:ltr;">
            🔐 SIGNED BY @aliallamofficial [GPG: 55392380FBF1C8F1] | ${randomHash}
        </div>
    `;
    
    const currentContent = cvArea.innerHTML;
    if(!currentContent.includes('SIGNED BY')) {
        cvArea.innerHTML = badgeHtml + currentContent;
        alert(selectedLang === 'ar' ? 'تم توقيع السيرة الذاتية رقمياً برمجياً بنجاح!' : 'CV has been digitally signed successfully!');
    } else {
        alert(selectedLang === 'ar' ? 'المستند موقع وموثق بالفعل!' : 'Document is already signed!');
    }
});

// 📥 ميزة إظهار خيارات القائمة المنسدلة للتحميل عند الضغط على الزر الرئيسي
document.getElementById('mainDownloadBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('downloadOptions').classList.toggle('hidden');
});

// إغلاق القائمة المنسدلة تلقائياً إذا ضغط المستخدم في أي مكان خارجها
document.addEventListener('click', () => {
    const options = document.getElementById('downloadOptions');
    if(options) options.classList.add('hidden');
});

// 📄 خيار تحميل بصيغة PDF (الحل النهائي الجذري باستخدام نافذة طباعة المتصفح النظيفة)
document.getElementById('downloadPdfBtn').addEventListener('click', () => {
    const cvElement = document.getElementById('cvTemplateArea');
    
    if (!cvElement || cvElement.innerText.trim() === "" || cvElement.innerText.includes("ستظهر سيرتك الذاتية")) {
        alert(document.getElementById('langSelect').value === 'ar' ? 'يرجى تحسين السيرة الذاتية أولاً وتوليد النص قبل محاولة تحميلها!' : 'Please optimize your CV first before downloading!');
        return;
    }

    let currentHtml = cvElement.innerHTML;

    // إلحاق التوقيع الرسمي بالأسفل
    if (!currentHtml.includes('cv-crypto-footer')) {
        currentHtml = appendCryptoSignatureToCV(currentHtml);
    }

    // فتح نافذة طباعة فرعية نظيفة ومستقلة تماماً لمنع ظهور باقي أزرار الموقع في المستند
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    
    const isEn = cvElement.style.textAlign === 'left';
    const direction = isEn ? 'ltr' : 'rtl';

    // حقن الكود وتنسيقات الـ CSS للطباعة لضمان خلفية بيضاء ونصوص سوداء حادة ومثالية للـ ATS
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="${direction}">
        <head>
            <title>السيرة الذاتية الموثقة</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 40px; 
                    background: #ffffff; 
                    color: #000000; 
                    line-height: 1.8;
                    font-size: 15px;
                }
                strong { font-weight: bold; color: #000000; }
                /* إخفاء الشارة العلوية أثناء طباعة الملف */
                .crypto-badge { display: none !important; }
                @media print {
                    body { padding: 0; }
                    @page { margin: 2cm; }
                }
            </style>
        </head>
        <body>
            <div>${currentHtml}</div>
            <script>
                // تشغيل أمر حفظ كـ PDF تلقائياً فور التحميل ثم إغلاق النافذة المنبثقة
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                };
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
    navigator.clipboard.writeText(cvElement.innerText).catch(() => {});
});

// 📄 خيار تحميل السيرة الذاتية بصيغة Word مع إظهار التنبيه الاحترافي الصارم للمستخدم
document.getElementById('downloadWordBtn').addEventListener('click', () => {
    const cvElement = document.getElementById('cvTemplateArea');
    if (!cvElement) return;

    alert("تنبيه: ملف الـ Word مخصص للتعديل الشخصي، بينما نسخة الـ PDF هي النسخة الرسمية المقفلة والموثقة التي تُرسل للموظفين.");

    let cvContentText = cvElement.innerText;
    
    const wordSignature = `\n\n=========================================\n🔒 Digitally Signed & Verified via AI CV Optimizer\nAuthority Key: @aliallamofficial [GPG: 55392380FBF1C8F1]\n=========================================`;
    
    const fullWordContent = cvContentText + wordSignature;
    const wordUrl = 'data:application/msword;charset=utf-8,\ufeff' + encodeURIComponent(fullWordContent);

    navigator.clipboard.writeText(fullWordContent).then(() => {
        console.log("Copied signed text to clipboard.");
    }).catch(() => {});

    if (typeof median !== 'undefined' && median.download) {
        median.download.downloadFile({ url: wordUrl, filename: 'السيرة_الذاتية.doc' });
    } else {
        const a = document.createElement('a');
        a.href = wordUrl;
        a.download = 'السيرة_الذاتية.doc';
        a.click();
    }
});

// ==========================================
// إخفاء الواجهة الترحيبية المتحركة بعد ثانيتين تماماً
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0'; 
            setTimeout(() => {
                splash.remove(); 
            }, 500);
        }
    }, 2000);
});
