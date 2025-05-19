const QRCode = require('qrcode');

const createUserQr = async (urlUsername) => {
   
    const qrData = `https://flaap.me/${urlUsername}`;

    const data = await QRCode.toString(qrData, {
        errorCorrectionLevel: 'H',
        type: 'svg'
    });

    return data;
}

module.exports = createUserQr;