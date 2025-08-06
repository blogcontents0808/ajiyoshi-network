// 安全なログ記録
function createSafeLogger() {
  // 個人情報をマスクする関数
  function maskSensitiveData(data) {
    return {
      name: data.name ? `${data.name[0]}***` : null,
      email: data.email ? `***@${data.email.split('@')[1]}` : null,
      subject: data.subject ? `${data.subject.slice(0, 10)}...` : null,
      messageLength: data.message ? data.message.length : 0,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    logRequest: (data) => {
      console.log('Contact request received:', maskSensitiveData(data));
    },
    logError: (error, context) => {
      console.error('Contact API error:', {
        error: error.message,
        context: context,
        timestamp: new Date().toISOString()
      });
    },
    logSuccess: (result) => {
      console.log('Contact processed:', {
        sheetSaved: result.sheet.success,
        emailSent: result.adminEmail.success,
        timestamp: new Date().toISOString()
      });
    }
  };
}

// 使用例
const logger = createSafeLogger();

// 従来の危険なログ記録を置き換え
// console.log('お問い合わせデータ:', data); // ← 危険
logger.logRequest(sanitizedData); // ← 安全