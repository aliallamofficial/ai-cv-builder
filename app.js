document.getElementById('optimizeBtn').addEventListener('click', async () => {
    const fullName = document.getElementById('fullName').value.trim();
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const skills = document.getElementById('skills').value.trim();

    if (!fullName || !jobTitle) {
        alert('رجاءً أدخل الاسم والمسمى الوظيفي على الأقل!');
        return;
    }

    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('resultBox');

    loading.classList.remove('hidden');
    resultBox.innerHTML = '';

    const promptMessage = `أنت خبير محترف في الموارد البشرية (HR). قم بصياغة سيرة ذاتية احترافية وجذابة باللغة العربية بناءً على البيانات التالية:
    الاسم: ${fullName}
    المسمى الوظيفي المستهدف: ${jobTitle}
    الخبرات: ${experience}
    المهارات: ${skills}
    
    نسق الإجابة بنقاط واضحة وبأسلوب احترافي مشوق ومناسب للشركات.`;

    try {
        // نعود للاستدعاء عبر السيرفر لتخطي حظر المتصفح
        const response = await fetch('/.netlify/functions/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ promptMessage })
        });

        const data = await response.json();

        if (response.ok && data.choices && data.choices[0].message) {
            const aiResult = data.choices[0].message.content;
            resultBox.innerHTML = `<div style="white-space: pre-line; color: #fff; line-height: 1.6; text-align: right;">${aiResult}</div>`;
        } else {
            const errorText = data.error || 'حدث خطأ غير معروف.';
            resultBox.innerHTML = `<p style="color: #ff4a4a; font-weight: bold;">${errorText}</p>`;
        }

    } catch (error) {
        resultBox.innerHTML = `<p style="color: #ff4a4a; font-weight: bold;">فشل الاتصال بالخادم الداخلي: ${error.message}</p>`;
    } finally {
        loading.classList.add('hidden');
    }
});
