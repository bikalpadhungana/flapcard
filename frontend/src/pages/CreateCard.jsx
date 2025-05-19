import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import Navbar from "../ui/Navbar";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaPalette, FaQrcode, FaIdCard, FaUpload } from 'react-icons/fa';

// ATM card dimensions (85.6mm x 53.98mm)
const cardDimensions = {
  width: '85.6mm',
  height: '53.98mm'
};

export default function CreateCard() {
  const [cardData, setCardData] = useState({
    username: '',
    email: '',
    phone: '',
    organization: '',
    color: '#1c73ba'
  });
  const [showFront, setShowFront] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    const generateQr = async () => {
      if (cardData.username) {
        const url = `www.flaap.me/${cardData.username.replace(/\s+/g, '').toLowerCase()}`;
        const qr = await QRCode.toDataURL(url, {
          width: 128,
          errorCorrectionLevel: 'H',
          margin: 1,
          color: {
            dark: cardData.color,
            light: '#ffffff'
          }
        });
        setQrCode(qr);
      }
    };
    generateQr();
  }, [cardData.username, cardData.color]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCardData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://backend.flaap.me/api/order/placeOrder", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...cardData,
          phone_number: cardData.phone,
          _id: Date.now().toString() // Generate temporary ID
        })
      });
      
      if (!response.ok) throw new Error('Order failed');
      alert('Card ordered successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Design Your Digital Business Card
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Card Preview */}
          <div className="flex-1 max-w-lg">
            <div className="relative" style={{ perspective: '1000px' }}>
              <div 
                className={`relative transition-transform duration-500 ${showFront ? 'rotate-y-0' : 'rotate-y-180'}`}
                style={{
                  transformStyle: 'preserve-3d',
                  width: cardDimensions.width,
                  height: cardDimensions.height
                }}
              >
                {/* Front Side */}
                <div className={`absolute w-full h-full ${showFront ? 'visible' : 'invisible'}`}>
                  <div 
                    className="rounded-lg shadow-xl p-4 h-full flex flex-col justify-between"
                    style={{ 
                      backgroundColor: cardData.color,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      {logoPreview && (
                        <img 
                          src={logoPreview} 
                          alt="Logo" 
                          className="w-12 h-12 object-contain rounded-sm"
                        />
                      )}
                      <span className="text-white text-sm font-light">
                        {/* Business Card */}
                      </span>
                    </div>
                    
                    <div className="text-white">
                      <h2 className="text-xl font-semibold mb-2">
                        {cardData.username || 'Flap Card'}
                      </h2>
                      <p className="text-sm font-medium opacity-90">
                        {cardData.organization || 'Flap Card Pvt Ltd'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-white text-xs">
                      <div>
                        <FaPhone className="inline mr-1" />
                        {cardData.phone || '+977 9802365432'}
                      </div>
                      <div>
                        <FaEnvelope className="inline mr-0.5" />
                        {cardData.email || 'card@flap.com.np'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div 
  className={`absolute w-full h-full rounded-lg overflow-hidden ${showFront ? 'invisible' : 'visible'}`}
  style={{
    backgroundColor: cardData.color,
    transform: 'rotateY(180deg)',
    backfaceVisibility: 'hidden',
  }}
>
                  <div className="h-full flex flex-col items-center justify-center p-4">
                    {qrCode && (
                      <img 
                        src={qrCode} 
                        alt="QR Code" 
                        className="w-24 h-24 mb-2 bg-white p-1 rounded-sm"
                      />
                    )}
                    <p className="text-white text-xs text-center">
                      {/* Scan to save contact information */}
                    </p>
                    <div className="mt-2 text-white text-xxs text-center opacity-75">
                      {cardData.organization || 'Your Organization'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFront(!showFront)}
              className="mt-4 mx-auto block px-4 py-2 text-sm bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {showFront ? 'View Back Side' : 'View Front Side'}
            </button>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Card Color</h3>
              <div className="grid grid-cols-7 gap-2">
                {['#1c73ba', '#01579b', '#00695c', '#bf360c', '#3e2723', '#1a237e', '#4a148c', '#212121'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setCardData(prev => ({ ...prev, color }))}
                    className={`h-8 rounded-md transition-transform ${cardData.color === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Upload Logo (Optional)
              </label>
              <label className="inline-block px-4 py-2 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                <FaUpload className="inline mr-2" />
                Choose File
                <input 
                  type="file" 
                  onChange={handleLogoUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Card Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <FaUser className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="username"
                      required
                      className="flex-1 outline-none"
                      placeholder="Flap Card"
                      value={cardData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      id="email"
                      required
                      className="flex-1 outline-none"
                      placeholder="card@flap.com.np"
                      value={cardData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <FaPhone className="text-gray-400 mr-2" />
                    <input
                      type="tel"
                      id="phone"
                      className="flex-1 outline-none"
                      placeholder="+977 9802365432"
                      value={cardData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Organization</label>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <FaBuilding className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="organization"
                      className="flex-1 outline-none"
                      placeholder="Flap Card Pvt Ltd"
                      value={cardData.organization}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Order Card Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}