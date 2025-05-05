document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const toggleBtn = document.getElementById("ai-chat-toggle");
    const chatbox = document.getElementById("ai-chatbox");
    const closeBtn = document.getElementById("ai-close");
    const sendBtn = document.getElementById("ai-send-btn");
    const input = document.getElementById("ai-msg-input");
    const messages = document.getElementById("ai-chat-messages");

    let hasOpened = false; // ✅ only trigger welcome once

    toggleBtn.addEventListener("click", () => {
        chatbox.style.display = "flex";

        if (!hasOpened) {
            appendBubble(
                "gemini",
                "👋 Hello! I'm your FoodMate assistant. Ask me anything about recipes, meal plans, or ingredients!"
            );
            hasOpened = true;
        }
    });

    closeBtn.addEventListener("click", () => {
        chatbox.style.display = "none";
    });

    const appendBubble = (sender, text) => {
        const div = document.createElement("div");
        div.className = `ai-bubble ${sender}`;
        div.innerText = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    };

    sendBtn.addEventListener("click", () => {
        const msg = input.value.trim();
        if (!msg) return;
        appendBubble("user", msg);
        socket.emit("ai-message", msg);
        input.value = "";
    });

    socket.on("ai-reply", (text) => {
        appendBubble("gemini", text);
    });
});
