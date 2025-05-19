import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import cover_photo from "/images/flap_logo.jpeg";
import UserNotFound from "../ui/userNotFound";
import flapLoading from "../../public/images/flap_loading.gif";
import "../styles/Payments.css";
import esewaLogo from "/images/esewa.png";
import khaltiLogo from "/images/khalti.png";
import imepayLogo from "/images/imepay.png";

export default function Payments() {
  const { id } = useParams();
  
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState('');
  const [userPresent, setUserPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [exchangeContact, setExchangeContact] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(null); // null, 'esewa', 'khalti', or 'imepay'
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    photo: "",
  });
  const [contactPhoto, setContactPhoto] = useState(null);
  const [contactPhotoUploadPercentage, setContactPhotoUploadPercentage] = useState(0);
  const [contactPhotoUploadError, setContactPhotoUploadError] = useState(false);

  useEffect(() => {
    if (id !== "example") {
      const fetchData = async () => {
        const response = await fetch(`https://backend.flaap.me/api/user-info/${id}`);
        const resData = await response.json();

        if (resData.success === false) {
          setUserPresent(false);
          return;
        }

        setUserId(resData.user._id);
        const selectedUrl = resData.user.selected_url;
        if (selectedUrl !== "default_url") {
          const navigateUrl = resData.user[selectedUrl];
          setRedirecting(true);
          window.location.href = navigateUrl;
          return;
        }

        setUserInfo(resData.user);
        setLoading(false);
        setUserPresent(true);
      };
      fetchData();
    }
  }, [id]);

  if (userInfo.username) {
    const firstName = userInfo.username.split(' ')[0];
    document.title = `${firstName}'s Flap`;
  }

  const downloadVCard = (data) => {
    const element = document.createElement('a');
    const file = new Blob([data], { type: 'text/vcard; charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${userInfo.username}.vcf`;
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCreateVCard = async () => {
    const response = await fetch(`https://backend.flaap.me/api/user-info/vcard/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    });

    const resData = await response.json();
    downloadVCard(resData);
  };

  const handleContactChange = (e) => {
    setContactFormData({ ...contactFormData, [e.target.id]: e.target.value });
  };

  const handleUploadPhoto = (file) => {
    setContactPhoto(file);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setContactPhotoUploadPercentage(Math.round(progress));
      },
      (error) => {
        setContactPhotoUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            setContactFormData({ ...contactFormData, photo: downloadUrl });
          });
      }
    );
  };

  const handleFormSubmit = async () => {
    const { name, email, contact_number } = contactFormData;
    if (!name || !email || !contact_number) {
      alert('Please fill in all required fields (Name, Email, Contact Number).');
      return;
    }

    const response = await fetch(`https://backend.flaap.me/api/user-info/exchangeContact/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactFormData),
    });

    const responseData = await response.json();

    if (responseData.message === "Contact exchanged successfully.") {
      alert('Contact information submitted');
    }
  };

  const handleCoverPhotoClick = () => {
    console.log("Cover photo clicked.");
  };

  if (redirecting) {
    return (
      <div className="loading-container">
        <img src={flapLoading} className="loading-image" alt="Loading" />
      </div>
    );
  }

  if (id === "example") {
    return (
      <div className="example-page">
        <section className="main-section">
          <div className="container">
            <div className="upper-container" style={userInfo.user_cover_photo ? {backgroundImage: userInfo.user_cover_photo} : {backgroundImage: cover_photo}}></div>
            <div className="img-section">
              <img src="/images/user-data/5bbdfaffaa69f-1e3db851b878b2fbe59639f48c715c53.png" alt="User Profile Picture" />
            </div>
            <div className="lower-container">
              <hr />
              <div className="card-body">
                <h2 className="name">Flap Card</h2>
              </div>
              <hr />
              <div className="card-info">
                <div className="info">
                  <img src="/images/phone.png" alt="" height="30px" />
                  <span>+977 9802365432</span>
                </div>
                <div className="info">
                  <img src="/images/mail.png" alt="" height="30px" />
                  <span>card@flap.com.np</span>
                </div>
                <div className="info">
                  <img src="/images/organization-logo.png" alt="" height="30px" />
                  <span>Flap</span>
                </div>
              </div>
              <hr />
              <p className="user-description">User Bio/ Description</p>
              <hr />
              <div className="general-links">
                <a href="#"><div className="item"><img src="/images/link.png" alt="link-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/address.png" alt="address-logo" /></div></a>
              </div>
              <div className="messaging-links">
                <a href="#"><div className="item"><img src="/images/whatsapp.png" alt="whatsapp-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/discord.png" alt="discord-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/snapchat.png" alt="snapchat-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/telegram.png" alt="telegram-logo" /></div></a>
              </div>
              <div className="socialmedia-links">
                <a href="#"><div className="item"><img src="/images/facebook.png" alt="fb-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/twitter_2.png" alt="twitter-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/linked-in.png" alt="linkedin-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/insta.png" alt="instagram-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/youtube.png" alt="youtube-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/tiktok.png" alt="tiktok-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/threads.png" alt="threads-logo" /></div></a>
              </div>
              <div className="review-links">
                <a href="#"><div className="item"><img src="/images/tripadvisor.png" alt="tripadvisor-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/googlereview.png" alt="google-logo" /></div></a>
              </div>
              <div className="other-links">
                <a href="#"><div className="item"><img src="/images/link.png" alt="link-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/address.png" alt="address-logo" /></div></a>
              </div>
            </div>
          </div>
        </section>
        <footer className="footer">
          <div className="footer-container">
            <a target="_blank" rel="noreferrer" href="https://flaap.me"><h5>@flap</h5></a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <>
      {!userPresent ? (
        <UserNotFound />
      ) : loading ? (
        <div className="loading-container">
          <img src={flapLoading} className="loading-image" alt="Loading" />
        </div>
      ) : (
        <>
          {exchangeContact && (
            <div className="profile-overlay">
              <div className="profile-popup">
                <button 
                  onClick={() => setExchangeContact(false)} 
                  className="close-button"
                >
                  <i className="fas fa-times"></i>
                </button>
                <div className="popup-content">
                  <div className="popup-header">
                    <i className="fas fa-address-card" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                    <h2 style={{ color: userInfo.user_colour || '#1c73ba' }}>
                      Exchange Contact Info
                    </h2>
                  </div>
                  <form className="contact-form">
                    {[
                      { field: 'name', icon: 'user' },
                      { field: 'email', icon: 'envelope' },
                      { field: 'contact_number', icon: 'phone' }
                    ].map(({ field, icon }) => (
                      <div className="form-group" key={field}>
                        <i className={`fas fa-${icon}`} style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        <input 
                          type={field === 'email' ? 'email' : 'text'}
                          id={field}
                          placeholder={field.replace('_', ' ').toUpperCase()}
                          value={contactFormData[field]} 
                          onChange={handleContactChange} 
                          className="form-input"
                        />
                      </div>
                    ))}
                    <label className="photo-upload">
                      <i className="fas fa-camera" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                      <div className="upload-button">
                        {contactFormData.photo ? (contactPhoto ? contactPhoto.name : "Photo Uploaded") : "Upload Photo"}
                        <input 
                          type="file" 
                          onChange={e => handleUploadPhoto(e.target.files[0])} 
                          hidden 
                          accept="image/*" 
                        />
                      </div>
                    </label>
                    <div className="status-message">
                      {contactPhotoUploadError && (
                        <span className="error-message">Error: Image too large (max 10MB)</span>
                      )}
                      {contactPhotoUploadPercentage > 0 && contactPhotoUploadPercentage < 100 && (
                        <span className="uploading-message">Uploading: {contactPhotoUploadPercentage}%</span>
                      )}
                      {contactPhotoUploadPercentage === 100 && !contactPhotoUploadError && (
                        <span className="success-message">Upload complete!</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="submit-button"
                      style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}
                    >
                      <i className="fas fa-paper-plane"></i>
                      Send Contact
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {showPaymentPopup && (
            <div className="profile-overlay">
              <div className="profile-popup">
                <button 
                  onClick={() => setShowPaymentPopup(null)} 
                  className="close-button"
                >
                  <i className="fas fa-times"></i>
                </button>
                <div className="popup-content">
                  <div className="popup-logo">
                    <img 
                      src={
                        showPaymentPopup === 'esewa' ? esewaLogo :
                        showPaymentPopup === 'khalti' ? khaltiLogo :
                        imepayLogo
                      } 
                      alt={`${showPaymentPopup} Logo`} 
                      className="popup-payment-logo"
                    />
                  </div>
                  <div className="popup-header">
                    <h2 style={{ color: userInfo.user_colour || '#1c73ba' }}>
                      {showPaymentPopup === 'esewa' ? 'eSewa Payment' : showPaymentPopup === 'khalti' ? 'Khalti Payment' : 'IME Pay Payment'}
                    </h2>
                  </div>
                  <div className="payment-info">
                    <p className="payment-id">
                      {showPaymentPopup === 'esewa' ? 'eSewa ID' : showPaymentPopup === 'khalti' ? 'Khalti ID' : 'IME Pay ID'}: {userInfo.phone_number_3 || userInfo.phone_number_3 || 'Not Available'}
                    </p>
                    <p className="payment-name">
                      Name: {userInfo.username}
                    </p>
                    <div className="qr-code-container">
                      <p>Scan the QR code below to make a payment:</p>
                      <div className="qr-code-wrapper">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                            showPaymentPopup === 'esewa' 
                              ? JSON.stringify({ "eSewa_id": userInfo.phone_number_3 || userInfo.phone_number_3, "name": userInfo.username })
                              : showPaymentPopup === 'khalti' 
                              ? JSON.stringify({ "Khalti_ID": userInfo.phone_number_3 || userInfo.phone_number_3, "name": userInfo.username })
                              : JSON.stringify({ "IMEPay_ID": userInfo.phone_number_3 || userInfo.phone_number_3, "name": userInfo.username })
                          )}`} 
                          alt="Payment QR Code" 
                          className="qr-code"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="business-container">
            <div className="business-cover">
              {userInfo.user_cover_photo && (
                userInfo.user_cover_photo.endsWith(".mp4") ? (
                  <video className="business-cover-media" autoPlay loop muted>
                    <source src={userInfo.user_cover_photo} type="video/mp4" />
                  </video>
                ) : (
                  <img 
                    className="business-cover-media" 
                    src={userInfo.user_cover_photo} 
                    alt="Business Cover" 
                  />
                )
              )}
              <div className="cover-gradient" />
            </div>

            <div className="business-profile-section">
              <div className="business-logo-container">
                <img 
                  src={userInfo.user_photo} 
                  alt="Business Logo" 
                  className="business-main-logo"
                />
                {userInfo.organization_logo && (
                  <img
                    src={userInfo.organization_logo}
                    alt="Organization"
                    className="business-organization-logo"
                  />
                )}
              </div>
              <h1>{userInfo.username}</h1>
              {userInfo.jobtitle && <p className="jobtitle">{userInfo.jobtitle}</p>}
              {userInfo.organization && <p className="organization">{userInfo.organization}</p>}
              {userInfo.address && <p className="address">{userInfo.address}</p>}
              {userInfo.dob && <p className="dob">{userInfo.dob}</p>}
            </div>

            <div className="messaging-section">
              {(userInfo.whatsapp || userInfo.snapchat_url || userInfo.discord_url || userInfo.telegram_url || userInfo.viber || userInfo.wechat_url || userInfo.line_url) && (
                <>
                  <div className="section-title"></div>
                  <div className="messaging-grid">
                    {userInfo.whatsapp && (
                      <a href={`https://wa.me/${userInfo.whatsapp}`} target="_blank" rel="noreferrer" title="WhatsApp">
                        <div className="item">
                          <i className="fab fa-whatsapp" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        </div>
                      </a>
                    )}
                    {userInfo.snapchat_url && (
                      <a href={`https://www.snapchat.com/add/${userInfo.snapchat_url}`} target="_blank" rel="noreferrer" title="Snapchat">
                        <div className="item">
                          <i className="fab fa-snapchat" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        </div>
                      </a>
                    )}
                    {userInfo.discord_url && (
                      <a href={userInfo.discord_url} target="_blank" rel="noreferrer" title="Discord">
                        <div className="item">
                          <i className="fab fa-discord" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        </div>
                      </a>
                    )}
                    {userInfo.wechat_url && (
                      <a href={`weixin://dl/chat?${userInfo.wechat_url}`} target="_blank" rel="noreferrer" title="WeChat">
                        <div className="item">
                          <i className="fab fa-weixin" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        </div>
                      </a>
                    )}
                    {userInfo.viber && (
                      <a href={`viber://chat?number=${userInfo.viber}`} target="_blank" rel="noreferrer" title="Viber">
                        <div className="item">
                          <i className="fab fa-viber" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        </div>
                      </a>
                    )}
                    {userInfo.telegram_url && (
                      <a href={userInfo.telegram_url} target="_blank" rel="noreferrer" title="Telegram">
                        <div className="item">
                          <i className="fab fa-telegram" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        </div>
                      </a>
                    )}
                    {userInfo.line_url && (
                      <a href={userInfo.line_url} target="_blank" rel="noreferrer" title="Line">
                        <div className="item">
                          <i className="fab fa-line" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        </div>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="business-info-section">
              <div className="business-contact-grid">
                {userInfo.phone_number_1 && (
                  <div className="business-contact-card">
                    <div className="contact-item">
                      <i className="fas fa-phone-alt" style={{ color: userInfo.user_colour || '#1c73ba' }} />
                      <div>
                        <p className="contact-label">Business Phone</p>
                        <a href={`tel:${userInfo.phone_number_1}`} className="contact-value">
                          {userInfo.phone_number_1}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {userInfo.phone_number_2 && (
                  <div className="business-contact-card">
                    <div className="contact-item">
                      <i className="fas fa-phone-alt" style={{ color: userInfo.user_colour || '#1c73ba' }} />
                      <div>
                        <p className="contact-label">Business Phone</p>
                        <a href={`tel:${userInfo.phone_number_2}`} className="contact-value">
                          {userInfo.phone_number_2}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {userInfo.email && (
                  <div className="business-contact-card">
                    <div className="contact-item">
                      <i className="fas fa-envelope" style={{ color: userInfo.user_colour || '#1c73ba' }} />
                      <div>
                        <p className="contact-label">Business Email</p>
                        <a href={`mailto:${userInfo.email}`} className="contact-value">
                          {userInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleCreateVCard}
                  className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2"
                  style={{ 
                    backgroundColor: userInfo.user_colour || '#1c73ba',
                    color: 'white'
                  }}
                >
                  <i className="fas fa-download" />
                  Save Contact
                </button>
                <button
                  onClick={() => setExchangeContact(true)}
                  className="px-8 py-3 rounded-xl font-semibold border-2 flex items-center gap-2"
                  style={{ 
                    borderColor: userInfo.user_colour || '#1c73ba',
                    color: userInfo.user_colour || '#1c73ba'
                  }}
                >
                  <i className="fas fa-exchange-alt" />
                  Exchange Contact
                </button>
              </div>
            </div>

            <div className="business-social-section">
              {(userInfo.facebook_url || userInfo.linkedin_url || userInfo.instagram_url || userInfo.twitter_url || userInfo.youtube_url || userInfo.tiktok_url) && (
                <>
                  <h3>Connect With Us</h3>
                  <div className="business-social-grid">
                    {userInfo.facebook_url && (
                      <a href={userInfo.facebook_url} className="business-social-icon" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-facebook-f" />
                      </a>
                    )}
                    {userInfo.linkedin_url && (
                      <a href={userInfo.linkedin_url} className="business-social-icon" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-linkedin-in" />
                      </a>
                    )}
                    {userInfo.instagram_url && (
                      <a href={userInfo.instagram_url} className="business-social-icon" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-instagram" />
                      </a>
                    )}
                    {userInfo.twitter_url && (
                      <a href={userInfo.twitter_url} className="business-social-icon" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-twitter" />
                      </a>
                    )}
                    {userInfo.youtube_url && (
                      <a href={userInfo.youtube_url} className="business-social-icon" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-youtube" />
                      </a>
                    )}
                    {userInfo.tiktok_url && (
                      <a href={userInfo.tiktok_url} className="business-social-icon" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-tiktok" />
                      </a>
                    )}
                  </div>
                </>
              )}

              <div className="payment-section">
                <h3>Make a Payment</h3>
                <div className="payment-buttons">
                  <button
                    onClick={() => setShowPaymentPopup('esewa')}
                    className="payment-button esewa-button"
                  >
                    <img src={esewaLogo} alt="eSewa Logo" className="payment-logo" />
                  </button>
                  <button
                    onClick={() => setShowPaymentPopup('khalti')}
                    className="payment-button khalti-button"
                  >
                    <img src={khaltiLogo} alt="Khalti Logo" className="payment-logo" />
                  </button>
                  <button
                    onClick={() => setShowPaymentPopup('imepay')}
                    className="payment-button imepay-button"
                  >
                    <img src={imepayLogo} alt="IME Pay Logo" className="payment-logo" />
                  </button>
                </div>
              </div>

              {(userInfo.tripadvisor_url || userInfo.customreview_url || userInfo.googlereview_url) && (
                <div className="reviews-section">
                  <div className="reviews-container">
                    <h3 className="reviews-title">
                      Customer Experiences
                      <span>Trusted by thousands of satisfied clients</span>
                    </h3>
                    <div className="reviews-grid">
                      {userInfo.googlereview_url && (
                        <a href={userInfo.googlereview_url} className="review-card" target="_blank" rel="noreferrer">
                          <div className="review-header">
                            <div className="review-icon-wrapper">
                              <svg className="review-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.016 3.585-.07 4.85c-.055 1.17-.249 1.805-.415 2.227-.224.562-.479.96-.896 1.382-.419.419-.824.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07-4.85s-.016-3.585-.07-4.85c-.055-1.17-.249-1.806-.415-2.227-.217-.562-.478-.96-.896-1.382-.42-.419-.824-.679-1.381-.896-.422-.164-1.057-.36-2.227-.413-1.266-.057-1.646-.07-4.85-.07zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162S8.595 18.162 12 18.162s6.162-2.76 6.162-6.162S15.405 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4-4-1.791 4-4 4z"/>
                              </svg>
                            </div>
                            <h4>Google Reviews</h4>
                          </div>
                          <p>"Share your experience with us on Google and help others discover our services!"</p>
                          <div className="review-action">
                            <span>Share Your Experience</span>
                            <i className="fas fa-edit" />
                          </div>
                        </a>
                      )}
                      {userInfo.customreview_url && (
                        <a href={userInfo.customreview_url} className="review-card custom-review" target="_blank" rel="noreferrer">
                          <div className="review-top-border" />
                          <div className="review-header">
                            <div className="review-icon-wrapper">
                              <i className="fas fa-comment-dots" />
                            </div>
                            <h4>Custom Review</h4>
                          </div>
                          <div className="review-content">
                            <i className="fa fa-quote-left" />
                            <p>"We'd love to hear your thoughts—leave a custom review and share your story with us!"</p>
                          </div>
                          <div className="review-footer">
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className="fas fa-star" />
                              ))}
                            </div>
                            <div className="review-action">
                              <span>View Testimonial</span>
                              <i className="fas fa-external-link-alt" />
                            </div>
                          </div>
                        </a>
                      )}
                      {userInfo.tripadvisor_url && (
                        <a href={userInfo.tripadvisor_url} className="review-card" target="_blank" rel="noreferrer">
                          <div className="review-header">
                            <div className="review-icon-wrapper">
                              <svg className="review-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                              </svg>
                            </div>
                            <h4>Tripadvisor</h4>
                          </div>
                          <p>"Let the world know about your journey by writing a review on Tripadvisor!"</p>
                          <div className="review-action">
                            <span>Reviews us</span>
                            <i className="fas fa-arrow-right" />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <hr style={{ borderColor: userInfo.user_colour || '#1c73ba' }} />
              <p className="description">{userInfo.description}</p>
              <hr style={{ borderColor: userInfo.user_colour || '#1c73ba' }} />
            </div>
          </div>

          <footer className="footer" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
            <div className="footer-container">
              <a target="_blank" rel="noreferrer" href="https://flaap.me">
                <h5>flap</h5>
              </a>
            </div>
          </footer>
        </>
      )}
    </>
  );
}