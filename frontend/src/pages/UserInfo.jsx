import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import UserNotFound from "../ui/userNotFound";
import flapLoading from "../../public/images/flap_loading.gif";
import "../styles/userinfo.css";

export default function UserInfo() {
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

  // Define valid themes
  const validThemes = [
    "Ai",
    "Artist",
    "Business",
    "Developer",
    "Entrepreneur", 
    "Healthcare",
    "Payments",
    "Students",
  ];

  useEffect(() => {
    if (id !== "example") {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://backend.flaap.me/api/user-info/${id}`);
          const resData = await response.json();

          if (resData.success === false) {
            setUserPresent(false);
            setLoading(false);
            return;
          }

          setUserId(resData.user._id);
          const userTheme = resData.user.theme; // Assuming theme is a field in the user data
          const urlUsername = resData.user.urlUsername || resData.user.username.toLowerCase().replace(/\s+/g, ''); // Fallback to username if urlUsername is not set

          // Check if the user has a valid theme
          if (userTheme && validThemes.includes(userTheme)) {
            setRedirecting(true);
            window.location.href = `/${userTheme.toLowerCase()}/${urlUsername}`;
            return;
          }

          // If no valid theme or theme is not set, proceed with rendering user info
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

  useEffect(() => {
    if (userInfo.username) {
      const firstName = userInfo.username.split(' ')[0];
      document.title = `${firstName}'s Flap`;
    }
  }, [userInfo]);

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
    }
  };

  const handleCoverPhotoClick = () => {
    console.log("Cover photo clicked.");
  };

  if (redirecting || loading) {
    return (
      <div className="loading-container">
        <img src={flapLoading} alt="Loading" className="loading-image" />
      </div>
    );
  }

  if (!userPresent) {
    return <UserNotFound />;
  }

  if (id === "example") {
    return (
      <div className="profile-page">
        <section className="profile-container">
          <div className="cover-photo">
            <img src="/images/flap_logo.jpeg" alt="Cover" />
          </div>
          <div className="profile-pic-container">
            <img src="/images/user-data/example.png" alt="Profile" className="profile-pic" />
          </div>
          <div className="user-details">
            <h2 className="user-name">Flap Card</h2>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+977 9802365432</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>card@flap.com.np</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-building"></i>
                <span>Flap</span>
              </div>
            </div>
            <p className="description">User Bio/Description</p>
          </div>
          <div className="social-links">
            <div className="section-title">Connect</div>
            <div className="links-grid">
              {['whatsapp', 'discord', 'snapchat', 'telegram'].map((platform) => (
                <a href="#" key={platform} className="social-icon" title={platform}>
                  <i className={`fab fa-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="social-links">
            <div className="section-title">Follow</div>
            <div className="links-grid">
              {['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'tiktok', 'threads'].map((platform) => (
                <a href="#" key={platform} className="social-icon" title={platform}>
                  <i className={`fab fa-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="social-links">
            <div className="section-title">Reviews</div>
            <div className="links-grid">
              <a href="#" className="social-icon" title="TripAdvisor">
                <i className="fas fa-thumbs-up"></i>
              </a>
              <a href="#" className="social-icon" title="Google Review">
                <i className="fab fa-google"></i>
              </a>
            </div>
          </div>
        </section>
        <footer className="profile-footer">
          <a href="https://flaap.me" target="_blank" rel="noreferrer" className="footer-link">
            @flap
          </a>
        </footer>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {exchangeContact && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setExchangeContact(false)} className="modal-close">
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-header">
              <i className="fas fa-address-card" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
              <h2 style={{ color: userInfo.user_colour || '#1c73ba' }}>Exchange Contact Info</h2>
            </div>
            <div className="modal-body">
              {[
                { field: 'name', icon: 'user', type: 'text' },
                { field: 'email', icon: 'envelope', type: 'email' },
                { field: 'contact_number', icon: 'phone', type: 'text' }
              ].map(({ field, icon, type }) => (
                <div className="form-group" key={field}>
                  <i className={`fas fa-${icon}`} style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                  <input
                    type={type}
                    id={field}
                    placeholder={field.replace('_', ' ').toUpperCase()}
                    value={contactFormData[field]}
                    onChange={handleContactChange}
                    className="form-input"
                  />
                </div>
              ))}
              <label className="form-group file-upload">
                <i className="fas fa-camera" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                <span>{contactFormData.photo ? contactPhoto.name : "Upload Photo"}</span>
                <input
                  type="file"
                  onChange={e => handleUploadPhoto(e.target.files[0])}
                  hidden
                  accept="image/*"
                />
              </label>
              <div className="upload-status">
                {contactPhotoUploadError && <span className="error">Error: Image too large (max 10MB)</span>}
                {contactPhotoUploadPercentage > 0 && contactPhotoUploadPercentage < 100 && (
                  <span>Uploading: {contactPhotoUploadPercentage}%</span>
                )}
                {contactPhotoUploadPercentage === 100 && !contactPhotoUploadError && (
                  <span className="success">Upload complete!</span>
                )}
              </div>
              <button
                onClick={handleFormSubmit}
                className="submit-btn"
                style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}
              >
                <i className="fas fa-paper-plane"></i> Send Contact
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="profile-container">
        <div className="cover-photo">
          {userInfo.user_cover_photo ? (
            userInfo.user_cover_photo.endsWith(".mp4") ? (
              <video
                src={userInfo.user_cover_photo}
                onClick={handleCoverPhotoClick}
                controls
                autoPlay
                loop
                muted
                className="cover-media"
              />
            ) : (
              <img
                src={userInfo.user_cover_photo}
                alt="Cover"
                onClick={handleCoverPhotoClick}
                className="cover-media"
              />
            )
          ) : (
            <div className="cover-placeholder"></div>
          )}
        </div>
        <div className="profile-pic-container">
          <img src={userInfo.user_photo} style={{ borderColor: userInfo.user_colour || '#1c73ba' }}alt="Profile" className="profile-pic" />
        </div>
        
        
        
        <div className="user-details">
          <h2 className="user-name">{userInfo.username}</h2>
          {userInfo.jobtitle && <h3 className="user-title">{userInfo.jobtitle}</h3>}
          <div className="org-info">
            {userInfo.organization && <span className="user-org">{userInfo.organization}</span>}
            <div className="organization-logo-container">
        {userInfo.organization_logo && (
              <a href={`https://flaap.me/${userInfo.organization.replace(/\s+/g, '')}`} target="_blank" rel="noreferrer">
                <img src={userInfo.organization_logo} alt="Organization Logo" style={{ borderColor: userInfo.user_colour || '#1c73ba' }}className="organization-logo" />
              </a>
            )}
        </div>
          </div>
          <div className="org-info">
            {userInfo.address && <span className="user-org">{userInfo.address}</span>}
            
          </div>
          <div className="contact-details">
            {userInfo.phone_number_1 && (
              <div className="contact-item">
                <i className="fas fa-phone" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                <a href={`tel:+${userInfo.phone_number_1.replace(/[-\s]/g, '')}`}>{userInfo.phone_number_1}</a>
              </div>
            )}
            {userInfo.phone_number_2 && (
              <div className="contact-item">
                <i className="fas fa-phone" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                <a href={`tel:${userInfo.phone_number_2}`}>{userInfo.phone_number_2}</a>
              </div>
            )}
            {userInfo.email && (
              <div className="contact-item">
                <i className="fas fa-envelope" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
              </div>
            )}
            {userInfo.website_url && (
              <div className="contact-item">
                <i className="fas fa-globe" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                <a
                  href={userInfo.website_url.trim().startsWith('http') ? userInfo.website_url.trim() : `http://${userInfo.website_url.trim()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {(() => {
                    try {
                      return new URL(userInfo.website_url.trim()).host;
                    } catch {
                      return userInfo.website_url.trim();
                    }
                  })()}
                </a>
              </div>
            )}
          </div>
          <div className="action-buttons">
            <button
              onClick={handleCreateVCard}
              className="action-btn"
              style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}
            >
              Save Contact
            </button>
            <button
              onClick={() => setExchangeContact(true)}
              className="action-btn"
              style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}
            >
              Exchange Contact
            </button>
          </div>
          <div>
          {userInfo.description && <p className="description">{userInfo.description}</p>}
          </div>
         
        </div>
        {userInfo.whatsapp || userInfo.snapchat_url || userInfo.discord_url || userInfo.telegram_url || userInfo.viber || userInfo.wechat_url || userInfo.line_url ? (
          <div className="social-links">
            <div className="section-title">Message</div>
            <div className="links-grid">
              {userInfo.whatsapp && (
                <a href={`https://wa.me/${userInfo.whatsapp}`} target="_blank" rel="noreferrer" className="social-icon" title="WhatsApp">
                  <i className="fab fa-whatsapp" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.snapchat_url && (
                <a href={`https://www.snapchat.com/add/${userInfo.snapchat_url}`} target="_blank" rel="noreferrer" className="social-icon" title="Snapchat">
                  <i className="fab fa-snapchat" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.discord_url && (
                <a href={userInfo.discord_url} target="_blank" rel="noreferrer" className="social-icon" title="Discord">
                  <i className="fab fa-discord" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.telegram_url && (
                <a href={userInfo.telegram_url} target="_blank" rel="noreferrer" className="social-icon" title="Telegram">
                  <i className="fab fa-telegram" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.viber && (
                <a href={`viber://chat?number=${userInfo.viber}`} target="_blank" rel="noreferrer" className="social-icon" title="Viber">
                  <i className="fab fa-viber" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.wechat_url && (
                <a href={`weixin://dl/chat?${userInfo.wechat_url}`} target="_blank" rel="noreferrer" className="social-icon" title="WeChat">
                  <i className="fab fa-weixin" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.line_url && (
                <a href={userInfo.line_url} target="_blank" rel="noreferrer" className="social-icon" title="Line">
                  <i className="fab fa-line" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
            </div>
          </div>
        ) : null}
        {userInfo.facebook_url || userInfo.twitter_url || userInfo.linkedin_url || userInfo.instagram_url || userInfo.youtube_url || userInfo.tiktok_url || userInfo.threads_url ? (
          <div className="social-links">
            <div className="section-title">Follow</div>
            <div className="links-grid">
              {userInfo.facebook_url && (
                <a href={userInfo.facebook_url} target="_blank" rel="noreferrer" className="social-icon" title="Facebook">
                  <i className="fab fa-facebook" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.twitter_url && (
                <a href={userInfo.twitter_url} target="_blank" rel="noreferrer" className="social-icon" title="Twitter">
                  <i className="fab fa-twitter" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.linkedin_url && (
                <a href={userInfo.linkedin_url} target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn">
                  <i className="fab fa-linkedin" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.instagram_url && (
                <a href={userInfo.instagram_url} target="_blank" rel="noreferrer" className="social-icon" title="Instagram">
                  <i className="fab fa-instagram" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.youtube_url && (
                <a href={userInfo.youtube_url} target="_blank" rel="noreferrer" className="social-icon" title="YouTube">
                  <i className="fab fa-youtube" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.tiktok_url && (
                <a href={userInfo.tiktok_url} target="_blank" rel="noreferrer" className="social-icon" title="TikTok">
                  <i className="fab fa-tiktok" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.threads_url && (
                <a href={userInfo.threads_url} target="_blank" rel="noreferrer" className="social-icon" title="Threads">
                  <i className="fas fa-comment-dots" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
            </div>
          </div>
        ) : null}
        {userInfo.googlereview_url || userInfo.tripadvisor_url || userInfo.customreview_url ? (
          <div className="social-links">
            <div className="section-title">Reviews</div>
            <div className="links-grid">
              {userInfo.googlereview_url && (
                <a href={userInfo.googlereview_url} target="_blank" rel="noreferrer" className="social-icon" title="Google Review">
                  <i className="fab fa-google" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.tripadvisor_url && (
                <a href={userInfo.tripadvisor_url} target="_blank" rel="noreferrer" className="social-icon" title="TripAdvisor">
                  <i className="fas fa-thumbs-up" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.customreview_url && (
  <a href={userInfo.customreview_url} target="_blank" rel="noreferrer" className="social-icon" title="Custom Review">
    <div className="review-stars">
      <i className="fas fa-star" style={{ color: userInfo.user_colour || '#1c73ba', fontSize: userInfo.star_size || '13px' }}></i>
      <i className="fas fa-star" style={{ color: userInfo.user_colour || '#1c73ba', fontSize: userInfo.star_size || '9px' }}></i>
      <i className="fas fa-star" style={{ color: userInfo.user_colour || '#1c73ba', fontSize: userInfo.star_size || '7px' }}></i>
      <i className="fas fa-star" style={{ color: userInfo.user_colour || '#1c73ba', fontSize: userInfo.star_size || '9px' }}></i>
      <i className="fas fa-star" style={{ color: userInfo.user_colour || '#1c73ba', fontSize: userInfo.star_size || '13px' }}></i>
    </div>
  </a>
)}
            </div>
          </div>
        ) : null}
        {userInfo.link_url || userInfo.address_url || userInfo.github_url ? (
          <div className="social-links">
            <div className="section-title">Others</div>
            <div className="links-grid">
              {userInfo.link_url && (
                <a href={userInfo.link_url} target="_blank" rel="noreferrer" className="social-icon" title="Link">
                  <i className="fas fa-link" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.address_url && (
                <a href={userInfo.address_url} target="_blank" rel="noreferrer" className="social-icon" title="Address">
                  <i className="fas fa-map-marker-alt" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
              {userInfo.github_url && (
                <a href={userInfo.github_url} target="_blank" rel="noreferrer" className="social-icon" title="Address">
                  <i className="fab fa-github" style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
                </a>
              )}
            </div>
          </div>
        ) : null}
      </section>
      <footer className="profile-footer" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
        <a href="https://flaap.me" target="_blank" rel="noreferrer" className="footer-link">
          flap
        </a>
      </footer>
    </div>
  );
}