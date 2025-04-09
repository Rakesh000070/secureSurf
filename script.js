// Check for suspicious URL patterns
async function checkUrlStructure(url) {
    const phishingPatterns = [
        /https?:\/\/[^/]+@/,                  // e.g., https://user@domain.com
        /https?:\/\/\d{1,3}(?:\.\d{1,3}){3}/   // e.g., http://192.168.0.1
    ];
    return phishingPatterns.some(pattern => pattern.test(url));
}

// Check if HTTPS is missing
function checkHttps(url) {
    return !url.startsWith("https://");
}

// Simulate Google Search presence check (always true to prevent slowness)
async function isInGoogleSearch(url) {
    return true;
}

// Scan page content for phishing keywords
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

// Main phishing detection logic
async function detectPhishing(url) {
    const resultElement = document.getElementById("result");
    let warnings = [];

    if (await checkUrlStructure(url)) {
        warnings.push("❌ Suspicious URL structure detected.");
    }
    if (checkHttps(url)) {
        warnings.push("🔒 Website is not using HTTPS.");
    }
    if (!(await isInGoogleSearch(url))) {
        warnings.push("🔍 Website is not found in Google search.");
    }
    if (await checkPhishingKeywords(url)) {
        warnings.push("🔐 Phishing-related words detected on the page.");
    }

    if (warnings.length > 0) {
        resultElement.innerHTML = warnings.join("<br>") + "<br>⚠ This website may be a phishing site!";
        resultElement.classList.add("warning");
        resultElement.classList.remove("safe");
    } else {
        resultElement.innerHTML = "✅ This website seems safe!";
        resultElement.classList.add("safe");
        resultElement.classList.remove("warning");
    }
}

// Trigger phishing check
async function checkUrl() {
    const input = document.getElementById("urlInput");
    const loader = document.getElementById("loader");
    const result = document.getElementById("result");

    let url = input.value.trim();
    if (!url) {
        result.innerHTML = "❌ Please enter a valid URL.";
        return;
    }

    // Auto-add https:// if missing
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    loader.style.display = "flex"; // Show loader
    result.innerHTML = "";

    await detectPhishing(url);

    loader.style.display = "none"; // Hide loader
}

// Reset form
function refreshPage() {
    document.getElementById("urlInput").value = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("result").classList.remove("safe", "warning");
}

