let stopRequested = false;

document.getElementById("sendBtn").addEventListener("click", async () => {
  stopRequested = false;
  log("送信開始リクエスト送信");

  const token = document.getElementById("token").value;
  const channelId = document.getElementById("channelId").value;
  const message = document.getElementById("message").value;
  const count = parseInt(document.getElementById("count").value);
  const speed = parseInt(document.getElementById("speed").value);

  const res = await fetch("/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, channelId, message, count, speed })
  });

  const result = await res.json();
  log(result.message);
});

document.getElementById("stopBtn").addEventListener("click", () => {
  stopRequested = true;
  log("停止リクエストを受け付けました");
});

function log(msg) {
  const logBox = document.getElementById("log");
  logBox.textContent += `\n${msg}`;
  logBox.scrollTop = logBox.scrollHeight;
}
