// گرفتن داده‌ها از localStorage (ارسال‌شده از صفحه اول)
const weight = parseFloat(localStorage.getItem('weight')) || 0;
const age = parseInt(localStorage.getItem('age')) || 0;
const dehydration = localStorage.getItem('dehydration') || "نامشخص";

if (!weight || !age) {
    alert("لطفاً اطلاعات وزن و سن را وارد کنید.");
    window.location.href = "index.html";
}

// تشخیص کودک یا بزرگسال
const isAdult = age > 16 || weight > 60;

// متغیرهای مشترک
let first_volume, fourth_volume, third_volume = 2;
let first_type, fourth_type, third_type = "PC";

// تعیین نوع سرم‌ها
if (["خونریزی", "سوختگی", "فضای سوم"].includes(dehydration)) {
    first_type = "رینگر لاکتات یا رینگر";
    fourth_type = "FFP + PC";
} else {
    first_type = "نرمال سالین";
    fourth_type = "FFP";
}

// تعیین حجم اولیه
if (isAdult) {
    first_volume = 2000;
} else {
    first_volume = 20 * weight;
}
fourth_volume = 10 * weight;

// وارد کردن مقادیر به HTML
document.getElementById("first_volume").innerText = first_volume;
document.getElementById("first_type").innerText = first_type;
document.getElementById("fourth_volume").innerText = fourth_volume;
document.getElementById("fourth_type").innerText = fourth_type;

if (isAdult) {
    document.getElementById("adult_block").style.display = "block";
    const adult_volume = age <= 55 ? 2.4 : (age <= 65 ? 2.1 : 1.7);
    document.getElementById("adult_volume").innerText = adult_volume.toFixed(1);
} else {
    document.getElementById("child_block").style.display = "block";

    let child_vol;
    if (weight <= 10) child_vol = 100 * weight;
    else if (weight <= 20) child_vol = ((weight - 10) * 50) + 1000;
    else child_vol = Math.min(((weight - 20) * 20) + 1500, 2400);

    const kcl_vol = Math.round(child_vol / 100);
    document.getElementById("child_vol").innerText = child_vol;
    document.getElementById("kcl_vol").innerText = kcl_vol;

    document.getElementById("nacl_select").addEventListener("change", function () {
        const type = this.value;
        let nacl_vol = 0;
        if (type === "NaCl 5%") nacl_vol = kcl_vol * 16;
        else if (type === "NaCl 20%") nacl_vol = kcl_vol * 5;
        else nacl_vol = 0;

        document.getElementById("nacl_vol").innerText = nacl_vol;
        document.getElementById("child_type").innerText = type === "Serum D/S" ? "D/S" : "D/W 5%";
        document.getElementById("nacl_type").innerText = type;
    });

    // مقدار اولیه برای انتخاب پیش‌فرض
    document.getElementById("nacl_select").dispatchEvent(new Event("change"));
}

// محاسبه مجموع سرم‌های تزریق‌شده
const checkboxes = document.querySelectorAll(".volume-check");
const resultEl = document.getElementById("total_volume");
checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
        let total = 0;
        checkboxes.forEach(c => {
            if (c.checked) total += parseInt(c.dataset.volume);
        });
        resultEl.innerText = total + " سی‌سی";
    });
});