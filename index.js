import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ Bot PRO online!'));

const autoReplies = {
    'halo': 'Halo bro! 👋 Ketik *menu* ya.',
    'menu': '📋 MENU:\n1. harga\n2. jam buka\n3. alamat\n4. admin',
    'harga': 'Cek katalog ya bro, atau ketik *admin*.',
    'jam buka': 'Buka 09.00-21.00 WIB bro.',
    'admin': 'Siap, admin segera balas ya 🙏'
};

async function tanyaAI(tanya) {
    try {
        // Pakai AI gratis tanpa API key
        const r = await fetch(`https://text.pollinations.ai/${encodeURIComponent(tanya)}?model=openai&system=You%20are%20a%20friendly%20WhatsApp%20CS%20from%20Indonesia.%20Jawab%20santai%20singkat.`);
        const text = await r.text();
        return text;
    } catch { return "Ketik *admin* ya bro, sistem lagi sibuk."; }
}

client.on('message', async msg => {
    if (msg.from.includes('@g.us')) return;
    const jam = new Date().getHours();
    const chat = msg.body.toLowerCase();

    if ((jam >= 21 || jam < 9) &&!chat.includes('admin')) {
        await msg.reply('Udah tutup 21.00-09.00 WIB bro 🌙 Besok dibalas ya. Urgent ketik *admin*.');
        return;
    }
    for (const k in autoReplies) if (chat.includes(k)) { await msg.reply(autoReplies[k]); return; }
    await msg.reply(await tanyaAI(msg.body));
});

client.initialize();
