import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import cover_photo from "/images/flap_logo.jpeg";
import UserNotFound from "../ui/userNotFound";
import flapLoading from "../../public/images/flap_loading.gif";
import "../styles/Student.css";

export default function Student() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState('');
  const [userPresent, setUserPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [exchangeContact, setExchangeContact] = useState(false);
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
        try {
          const response = await fetch(`https://backend.flaap.me/api/user-info/${id}`);
          const resData = await response.json();

          if (resData.success === false) {
            setUserPresent(false);
            return;
          }

          setUserId(resData.user._id);
          const selectedUrl = resData.user.selected_url;
          if (selectedUrl !== "default_url") {
            setRedirecting(true);
            window.location.href = resData.user[selectedUrl];
            return;
          }

          setUserInfo(resData.user);
          setLoading(false);
          setUserPresent(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserPresent(false);
          setLoading(false);
        }
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
      setExchangeContact(false);
      setContactFormData({ name: "", email: "", contact_number: "", photo: "" });
      setContactPhoto(null);
      setContactPhotoUploadPercentage(0);
      setContactPhotoUploadError(false);
    }
  };

  const handleCoverPhotoClick = () => {
    console.log("Cover photo clicked.");
  };

  if (redirecting) {
    return (
      <div className="loading-screen">
        <img src={flapLoading} alt="Loading" className="loading-image" />
      </div>
    );
  }

  if (id === "example") {
    return (
      <div className="student-profile">
        <section className="main-section">
          <div className="container">
            <div className="cover-container" style={userInfo.user_cover_photo ? {backgroundImage: `url(${userInfo.user_cover_photo})`} : {backgroundImage: `url(${cover_photo})`}}>
            </div>
            <div className="avatar-section">
              <img src="/images/user-data/5bbdfaffaa69f-1e3db851b878b2fbe59639f48c715c53.png" alt="User Profile Picture" className="profile-avatar" />
            </div>
            <div className="profile-details">
              <hr className="divider" />
              <div className="card-body">
                <h2 className="profile-name">Flap Card</h2>
              </div>
              <hr className="divider" />
              <div className="contact-list">
                <div className="contact-item">
                  <img src="/images/phone.png" alt="Phone Icon" className="contact-icon" />
                  <span>+977 9802365432</span>
                </div>
                <div className="contact-item">
                  <img src="/images/mail.png" alt="Email Icon" className="contact-icon" />
                  <span>card@flap.com.np</span>
                </div>
                <div className="contact-item">
                  <img src="/images/organization-logo.png" alt="Org Icon" className="contact-icon" />
                  <span>Flap</span>
                </div>
              </div>
              <hr className="divider" />
              <p className="bio-content">User Bio/ Description</p>
              <hr className="divider" />
              <div className="social-grid">
                <a href="#"><div className="social-link"><img src="/images/link.png" alt="link-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/address.png" alt="address-logo" className="social-icon" /></div></a>
              </div>
              <div className="social-grid">
                <a href="#"><div className="social-link"><img src="/images/whatsapp.png" alt="whatsapp-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/discord.png" alt="discord-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/snapchat.png" alt="snapchat-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/telegram.png" alt="telegram-logo" className="social-icon" /></div></a>
              </div>
              <div className="social-grid">
                <a href="#"><div className="social-link"><img src="/images/facebook.png" alt="fb-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/twitter_2.png" alt="twitter-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/linked-in.png" alt="linkedin-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/insta.png" alt="instagram-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/youtube.png" alt="youtube-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/tiktok.png" alt="tiktok-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/threads.png" alt="threads-logo" className="social-icon" /></div></a>
              </div>
              <div className="social-grid">
                <a href="#"><div className="social-link"><img src="/images/link.png" alt="link-logo" className="social-icon" /></div></a>
                <a href="#"><div className="social-link"><img src="/images/address.png" alt="address-logo" className="social-icon" /></div></a>
              </div>
            </div>
          </div>
        </section>
        <footer className="profile-footer">
          <div className="footer-container">
            <a target="_blank" rel="noreferrer" href="https://flaap.me"><p>@flap</p></a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="student-profile">
      {!userPresent ? (
        <UserNotFound />
      ) : loading ? (
        <div className="loading-screen">
          <img src={flapLoading} alt="Loading" className="loading-image" />
        </div>
      ) : (
        <>
          {/* Cover Section */}
          <div className="cover-container" onClick={handleCoverPhotoClick}>
            {userInfo.user_cover_photo?.endsWith(".mp4") ? (
              <video autoPlay loop muted className="cover-media">
                <source src={userInfo.user_cover_photo} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={userInfo.user_cover_photo || cover_photo} 
                alt="Cover" 
                className="cover-media"
              />
            )}
            <div className="cover-gradient" />
          </div>

          {/* Profile Header */}
          <div className="profile-header">
            <div className="avatar-container">
              <img 
                src={userInfo.user_photo || cover_photo} 
                alt="Profile" 
                className="profile-avatar"
                style={{ borderColor: userInfo.user_colour || '#1c73ba' }}
              />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{userInfo.username}</h1>
              {userInfo.jobtitle && <p className="profile-title">{userInfo.jobtitle}</p>}
              {userInfo.organization && (
                <p className="profile-organization">{userInfo.organization}</p>
              )}
              {userInfo.address && <p className="profile-address">{userInfo.address}</p>}
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <div className="contact-card">
              <h2 className="section-title">Contact Information</h2>
              <div className="contact-list">
                {userInfo.phone_number_1 && (
                  <div className="contact-item">
                    <i  style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                    <a href={`tel:${userInfo.phone_number_1}`} className="contact-link">{userInfo.phone_number_1}</a>
                  </div>
                )}
                {userInfo.phone_number_2 && (
                  <div className="contact-item">
                    <i  style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                    <a href={`tel:${userInfo.phone_number_2}`} className="contact-link">{userInfo.phone_number_2}</a>
                  </div>
                )}
                {userInfo.email && (
                  <div className="contact-item">
                    <i  style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                    <a href={`mailto:${userInfo.email}`} className="contact-link">{userInfo.email}</a>
                  </div>
                )}
                {userInfo.website_url && (
                  <div className="contact-item">
                    <i  style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                    <a href={userInfo.website_url} target="_blank" rel="noreferrer" className="contact-link">{userInfo.website_url} </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Education Section (if available) */}
          {userInfo.education && (
            <div className="education-section">
              <div className="education-card">
                <h2 className="section-title">Education</h2>
                <div className="education-list">
                  <p className="education-item">{userInfo.education}</p>
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="social-section">
            <div className="social-card">
              <h2 className="section-title">Connect With Me</h2>
              <div className="social-grid">
                {userInfo.whatsapp && (
                  <a href={`https://wa.me/${userInfo.whatsapp}`} target="_blank" rel="noreferrer" className="social-link">
                    <i className="fab fa-whatsapp social-icon" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                  </a>
                )}
                {userInfo.linkedin_url && (
                  <a href={userInfo.linkedin_url} target="_blank" rel="noreferrer" className="social-link">
                    <i className="fab fa-linkedin social-icon" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                  </a>
                )}
                {userInfo.instagram_url && (
                  <a href={userInfo.instagram_url} target="_blank" rel="noreferrer" className="social-link">
                    <i className="fab fa-instagram social-icon" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                  </a>
                )}
                {userInfo.github_url && (
                  <a href={userInfo.github_url} target="_blank" rel="noreferrer" className="social-link">
                    <i className="fab fa-github social-icon" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                  </a>
                )}
                {userInfo.twitter_url && (
                  <a href={userInfo.twitter_url} target="_blank" rel="noreferrer" className="social-link">
                    <i className="fab fa-twitter social-icon" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                  </a>
                )}
                {<userInfo className="facebook_url"></userInfo> && (
                  <a href={userInfo.facebook_url} target="_blank" rel="noreferrer" className="social-link">
                    <i className="fab fa-facebook social-icon" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {userInfo.description && (
            <div className="bio-section">
              <div className="bio-card">
                <h2 className="section-title">About Me</h2>
                <p className="bio-content">{userInfo.description}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={handleCreateVCard}
              className="action-button"
              style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}
            >
              <i className="fas fa-download button-icon"></i> Save Contact
            </button>
            <button
              onClick={() => setExchangeContact(true)}
              className="action-button secondary-button"
              style={{ borderColor: userInfo.user_colour || '#1c73ba', color: userInfo.user_colour || '#1c73ba' }}
            >
              <i className="fas fa-exchange-alt button-icon"></i> Exchange Contact
            </button>
          </div>

          {/* Exchange Contact Modal */}
          {exchangeContact && (
            <div className="modal-overlay">
              <div className="contact-modal">
                <button 
                  onClick={() => setExchangeContact(false)} 
                  className="modal-close-button"
                >
                  <i className="fas fa-times"></i>
                </button>
                <div className="modal-content">
                  <div className="modal-header">
                    <i className="fas fa-address-card modal-icon" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                    <h2 className="modal-title" style={{ color: userInfo.user_colour || '#1c73ba' }}>
                      Exchange Contact Info
                    </h2>
                  </div>
                  <form className="contact-form">
                    {[
                      { field: 'name', icon: 'user', placeholder: 'Name' },
                      { field: 'email', icon: 'envelope', placeholder: 'Email' },
                      { field: 'contact_number', icon: 'phone', placeholder: 'Contact Number' }
                    ].map(({ field, icon, placeholder }) => (
                      <div className="form-group" key={field}>
                        <i className={`fas fa-${icon} form-icon`} style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                        <input 
                          type={field === 'email' ? 'email' : 'text'}
                          id={field}
                          placeholder={placeholder}
                          value={contactFormData[field]} 
                          onChange={handleContactChange} 
                          className="form-input"
                        />
                      </div>
                    ))}
                    <label className="photo-upload">
                      <i className="fas fa-camera form-icon" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
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
                      <i className="fas fa-paper-plane button-icon"></i>
                      Send Contact
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          <footer className="profile-footer" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
            <div className="footer-container">
              <a target="_blank" rel="noreferrer" href="https://flaap.me">
                <p>Flap</p>
              </a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}