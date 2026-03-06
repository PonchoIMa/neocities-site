const toggle = document.getElementById('theme-toggle');
const body = document.body;

toggle.addEventListener('click', () => {
    // Check current theme
    const isLight = body.getAttribute('data-theme') === 'light';

    if (isLight) {
        // Switch to Dark
        body.removeAttribute('data-theme');
        toggle.textContent = '[ Switch to Light Mode ]';
    } else {
        // Switch to Light
        body.setAttribute('data-theme', 'light');
        toggle.textContent = '[ Switch to Dark Mode ]';
    }
});

async function fetchMastodon() {
    const instance = "mastodon.social";
    const handle = "ponchoima";
    const feedContainer = document.getElementById('mastodon-feed');

    try {
        // Step 1: Lookup the Account ID based on handle
        const lookupUrl = `https://${instance}/api/v1/accounts/lookup?acct=${handle}`;
        const accountResponse = await fetch(lookupUrl);
        const accountData = await accountResponse.json();
        const userId = accountData.id;

        // Step 2: Fetch the latest status using that ID
        const statusUrl = `https://${instance}/api/v1/accounts/${userId}/statuses?limit=1&exclude_reblogs=true`;
        const statusResponse = await fetch(statusUrl);
        const toots = await statusResponse.json();
        
        if (toots.length > 0) {
            const latest = toots[0];
            // Remove HTML tags from the content
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = latest.content;
            const cleanText = tempDiv.textContent || tempDiv.innerText || "";
            
            const date = new Date(latest.created_at).toLocaleDateString();

            feedContainer.innerHTML = `
                <span class="bold">@${handle} [${date}]:</span> 
                "${cleanText}" 
                <br><a href="${latest.url}" target="_blank" style="font-size: 0.7rem;">[ VIEW_ON_FEDIVERSE ]</a>
            `;
        }
    } catch (err) {
        console.error(err);
        feedContainer.innerHTML = "SYSTEM_ERROR: Connection to Fediverse timed out.";
    }
}

fetchMastodon();
