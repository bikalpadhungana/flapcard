const QRCode = require('qrcode');

const createUserQr = async (userName) => {

    const qrData = `https://flap.esainnovation.com/user-info/${userName}`;

    const data = await QRCode.toString(qrData, {
        errorCorrectionLevel: 'H',
        type: 'svg'
    });

    return data;
}

module.exports = createUserQr;