const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let currentClient = null;
let stopSignal = false;

app.post("/send", async (req, res) => {
  const { token, channelId, message, count, speed } = req.body;
  stopSignal = false;

  if (!token || !channelId || !message || !count || !speed) {
    return res.status(400).json({ message: "❌ すべての項目を入力してください。" });
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
  });

  try {
    await client.login(token);
    currentClient = client;
    console.log("✅ ボットログイン成功");

    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      return res.status(400).json({ message: "❌ チャンネルが見つかりません。" });
    }

    for (let i = 0; i < count; i++) {
      if (stopSignal) break;

      try {
        await channel.send(message);
        console.log(`✅ 送信成功 (${i + 1}/${count})`);
      } catch (err) {
        console.log("⚠️ メッセージ送信中にエラーが発生しました");
      }
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    client.destroy();
    return res.json({ message: `✅ 送信完了（${count}回）` });
  } catch (err) {
    console.log("❌ Botログインエラー", err);
    return res.status(500).json({ message: "❌ Botの起動または送信中にエラーが発生しました。" });
  }
});

app.post("/stop", (req, res) => {
  stopSignal = true;
  if (currentClient) {
    currentClient.destroy();
    currentClient = null;
  }
  res.json({ message: "🛑 停止しました" });
});

app.listen(PORT, () => console.log(`🌐 サーバー起動中: http://localhost:${PORT}`));
