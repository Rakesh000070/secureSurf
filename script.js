// Suspicious URL pattern detection
async function checkUrlStructure(url) {
    const phishingPatterns = [
        /https?:\/\/[^/]+@/,                     // user@domain pattern
        /https?:\/\/\d{1,3}(?:\.\d{1,3}){3}/      // IP address as domain
    ];
    return phishingPatterns.some(pattern => pattern.test(url));
}

// HTTPS check
function checkHttps(url) {
    return !url.startsWith("https://");
}

// Simulated Google Search check (placeholder)
async function isInGoogleSearch(url) {
    return true;
}

// Scan page for phishing keywords
async function checkPhishingKeywords(url) {
    try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) return false;

        const text = await response.text();
        const phishingWords = ["password", "verify", "confirm", "account locked"];
        return phishingWords.some(word => text.toLowerCase().includes(word));
    } catch (error) {
        return false;
    }
}

// Core phishing detection logic
async function detectPhishing(url) {
    const resultElement = document.getElementById("result");
    let warnings = [];

    if (await checkUrlStructure(url)) {
        warnings.push("❌ Suspicious URL structure detected.");
    }
    if (checkHttps(url)) {
        warnings.push("🔒 This site does not use HTTPS.");
    }
    if (!(await isInGoogleSearch(url))) {
        warnings.push("🔍 Website not found in Google search.");
    }
    if (await checkPhishingKeywords(url)) {
        warnings.push("⚠ Phishing-related content detected.");
    }

    // Update result box
    if (warnings.length > 0) {
        resultElement.innerHTML = `${warnings.join("<br>")}<br><strong>⚠ Be cautious: This might be a phishing site.</strong>`;
        resultElement.classList.add("warning");
        resultElement.classList.remove("safe");
    } else {
        resultElement.innerHTML = "✅ This website appears safe!";
        resultElement.classList.add("safe");
        resultElement.classList.remove("warning");
    }
}

// Handle URL check on button click
async function checkUrl() {
    const input = document.getElementById("urlInput");
    const loader = document.getElementById("loader");
    const result = document.getElementById("result");

    let url = input.value.trim();
    if (!url) {
        result.innerHTML = "❌ Please enter a valid URL.";
        result.classList.remove("safe", "warning");
        return;
    }

    // Auto-prepend protocol if missing
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    // Show loader
    loader.style.display = "flex";
    result.innerHTML = "";

    await detectPhishing(url);

    // Hide loader
    loader.style.display = "none";
}

// Reset form
function refreshPage() {
    document.getElementById("urlInput").value = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("result").classList.remove("safe", "warning");
}
