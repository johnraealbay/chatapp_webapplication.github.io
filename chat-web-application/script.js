// Connect to WebSocket Server
const chatSocket = new WebSocket("ws://localhost:8080");
let isSocketConnected = false;

let user_name = localStorage.getItem("userName") || "";

// Message bubble template
let msgBubble = `
    <div class="message-item">
        <div><span class="text-muted sender-name"></span></div>
        <div class="message-content"></div>
    </div>
`;

// When socket opens
chatSocket.onopen = () => {
    isSocketConnected = true;
};

// Send message to socket server
function send_msg(JSONData) {
    if (!isSocketConnected) return;
    chatSocket.send(JSON.stringify(JSONData));
}

// Receive message from server
chatSocket.onmessage = (event) => {
    let msgData = JSON.parse(event.data);
    if (!msgData || !msgData.msg || !msgData.user) return;

    // Only show if message came from OTHER users
    if (msgData.user !== user_name) {
        let bubble = $(msgBubble).clone(true);

        bubble.addClass("received");
        bubble.find(".sender-name").text(msgData.user);

        let content = msgData.msg.replace(/\n/g, "<br>");
        bubble.find(".message-content").html(content);

        $("#message-items-container").append(bubble);
    }
};

// Close socket when window unloads
window.addEventListener("unload", () => {
    chatSocket.close();
});

// Handle socket errors
chatSocket.addEventListener("error", (event) => {
    console.log("WebSocket error:", event);
});

// Send message function
function triggerSend() {
    let msg = $("#msg-txt-field").val().trim();
    if (msg === "") return;

    let bubble = $(msgBubble).clone(true);
    bubble.addClass("sent");

    let content = msg.replace(/\n/g, "<br>");
    bubble.find(".message-content").html(content);

    $("#message-items-container").append(bubble);

    $("#msg-txt-field").val("").focus();

    send_msg({ user: user_name, msg: msg });
}

$(document).ready(function () {

    // Ask for username if not stored yet
    if (user_name === "") {
        let enter_user = prompt("Enter Your Name:");
        if (enter_user !== "") {
            user_name = enter_user;
            localStorage.setItem("userName", user_name);
        } else {
            alert("User Name must be provided!");
            location.reload();
        }
    }

    $("#userName").text(user_name);

    // Send button click
    $("#send-btn").on("click", triggerSend);

    // Press Enter to send
    $("#msg-txt-field").on("keypress", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            triggerSend();
        }
    });
});





