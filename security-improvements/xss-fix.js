// XSS攻撃対策: HTMLエスケープ関数
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// 安全なメールHTML生成
const mailOptions = {
  from: `"味美ネットワーク お問い合わせ" <${process.env.GMAIL_USER}>`,
  to: adminEmails.join(', '),
  subject: `【お問い合わせ】${escapeHtml(data.subject || '件名なし')}`,
  html: `
    <h2>新しいお問い合わせが届きました</h2>
    <p><strong>お名前:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>メールアドレス:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>件名:</strong> ${escapeHtml(data.subject || '件名なし')}</p>
    <p><strong>お問い合わせ内容:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
    <p><strong>受信日時:</strong> ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
  `,
};