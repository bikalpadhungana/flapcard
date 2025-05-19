import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import cover_photo from "/images/flap_logo.jpeg";
import UserNotFound from "../ui/userNotFound";
import flapLoading from "../../public/images/flap_loading.gif";

// Add this CSS to your stylesheet
import "../styles/Artist.css"; // Create this file with the CSS below

export default function Artist() {
  
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
      const firstName = userInfo.username.split(' ')[0]; // Get the first name
      document.title = `${firstName}'s Flap `; // Set the title
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
  }
  
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
  }

  const handleContactChange = (e) => {
    setContactFormData({ ...contactFormData, [e.target.id]: e.target.value });
  }

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
  }

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
    }

  }
  const handleCoverPhotoClick = () => {
    console.log("Cover photo clicked.");
  };
  if (redirecting) {
        return (
            <div className="flex justify-center items-center h-screen">
                <img src={flapLoading} className="w-1/2"/>
            </div>
        )
    }



    
  if (id === "example") {
    return (
      <div>
        <section className="main">
          <div className="container">
            <div className="upper-container" style={userInfo.user_cover_photo ? {backgroundImage: userInfo.user_cover_photo} : {backgroundImage: cover_photo}}>
            </div>
            <div className="img-sec">
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
              <p className="user-desc">User Bio/ Description</p>
              <hr />

              <div className="general">
                <a href="#"><div className="item"><img src="/images/link.png" alt="link-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/address.png" alt="address-logo" /></div></a>
              </div>
              <div className="messaging">
             
                
              <a href="#"><div className="item"><img src="/images/whatsapp.png" alt="whatsapp-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/discord.png" alt="discord-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/snapchat.png" alt="snapchat-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/telegram.png" alt="telegram-logo" /></div></a>
                
                
              </div>
              <div className="socialmedia">
                
              <a href="#"><div className="item"><img src="/images/facebook.png" alt="fb-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/twitter_2.png" alt="twitter-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/linked-in.png" alt="linkedin-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/insta.png" alt="instagram-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/youtube.png" alt="youtube-logo" /></div></a>
                
                <a href="#"><div className="item"><img src="/images/tiktok.png" alt="tiktok-logo" /></div></a>
                
                
                <a href="#"><div className="item"><img src="/images/threads.png" alt="threads-logo" /></div></a>
                
            
            
                               

              </div>
              {/* <div className="review">
              
                <a href="#"><div className="item"><img src="/images/tripadvisor.png" alt="tripadvisor-logo" /></div></a>
                
                <a href="#"><div className="item"><img src="/images/googlereview.png" alt="google-logo" /></div></a>
                
              </div> */}
              <div className="others">
                <a href="#"><div className="item"><img src="/images/link.png" alt="link-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/address.png" alt="address-logo" /></div></a>
              </div>
             
            </div>
          </div>
        </section>
        <footer>
          <div className="footer-container">
            <a target="_blank" rel="noreferrer" href="https://flaap.me"><h5>@flap</h5></a>
          </div>
        </footer>
      </div>
    );
  } else {  return (
    <>
      {!userPresent ? (
        <div>
          <UserNotFound />
        </div>
      ) : loading ? (
        <div className="loading-screen">
          <img src={flapLoading} alt="Loading" />
        </div>
      ) : (
        <>
          {/* Modern Profile Container */}
          
          <div className="modern-profile">
            {/* Cover Section */}
            <div className="cover-container">
              {userInfo.user_cover_photo ? (
                userInfo.user_cover_photo.endsWith(".mp4") ? (
                  <video className="cover-media" autoPlay loop muted>
                    <source src={userInfo.user_cover_photo} type="video/mp4" />
                  </video>
                ) : (
                  <img className="cover-media" src={userInfo.user_cover_photo} alt="Cover" />
                )
              ) : (
                <div className="cover-default"></div>
              )}
              <div className="cover-overlay"></div>
            </div>

  

            {/* Profile Content */}
            <div className="profile-content">
              {/* Profile Header */}
              <div className="profile-header">
                <img
                  src={userInfo.user_photo}
                  alt="Profile"
                  className="profile-avatar"
                />
                <h1 className="profile-name">{userInfo.username}</h1>
                {userInfo.jobtitle && (
                  <p className="profile-title">{userInfo.jobtitle}</p>
                )}
                {userInfo.organization && (
                  <p className="profile-organization">
                    {userInfo.organization}
                  </p>
                )}
              </div>

            

              {/* Contact Information */}
              <div className="contact-grid">
                {userInfo.phone_number_1 && (
                  <div className="contact-item">
                    <i className="fas fa-phone contact-icon"></i>
                    <a href={`tel:${userInfo.phone_number_1}`}>
                      {userInfo.phone_number_1}
                    </a>
                  </div>
                )}
                {userInfo.phone_number_2 && (
                  <div className="contact-item">
                    <i className="fas fa-phone contact-icon"></i>
                    <a href={`tel:${userInfo.phone_number_2}`}>
                      {userInfo.phone_number_2}
                    </a>
                  </div>
                )}
                {userInfo.email && (
                  <div className="contact-item">
                    <i className="fas fa-envelope contact-icon"></i>
                    <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                  </div>
                )}
                 {userInfo.website_url && (
                  <div className="contact-item">
                    <i className="fas fa-globe contact-icon"></i>
                    <a
                     href={userInfo.website_url.trim().startsWith('http') ? userInfo.website_url.trim() : `http://${userInfo.website_url.trim()}`} 
                     target="_blank" 
                      rel="noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
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
                
                {/* Add other contact fields similarly */}
              </div>

              

              {/* Social Links */}
              <div className="social-section">
                <h3 className="messaging-section-title">Connect With Me</h3>
                <div className="social-grid">
                  {userInfo.facebook_url && (
                    <a href={userInfo.facebook_url} className="social-link facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {userInfo.linkedin_url && (
                    <a href={userInfo.linkedin_url} className="social-link linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {userInfo.instagram_url && (
                    <a href={userInfo.instagram_url} className="social-link instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {userInfo.twitter_url && (
                    <a href={userInfo.twitter_url} className="social-link twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {userInfo.youtube_url && (
                    <a href={userInfo.youtube_url} className="social-link youtube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  )}
                  </div>

                
{/* Messaging Section */}
{(userInfo.whatsapp || userInfo.snapchat_url || userInfo.discord_url || userInfo.telegram_url || userInfo.viber || userInfo.wechat_url || userInfo.line_url) && (
  <div className="messaging-section mt-8">
    <h3 className="messaging-section-title">Message Me</h3>
    <div className="messaging-grid">
      {userInfo.whatsapp && (
        <a
          href={`https://wa.me/${userInfo.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="messaging-link whatsapp"
        >
          <i className="fab fa-whatsapp messaging-icon" style={{ color: '#25D366' }}></i>
        </a>
      )}

      {userInfo.snapchat_url && (
        <a
          href={`https://www.snapchat.com/add/${userInfo.snapchat_url}`}
          target="_blank"
          rel="noreferrer"
          className="messaging-link snapchat"
        >
          <i className="fab fa-snapchat messaging-icon" style={{ color: '#fffc00' }}></i>
        </a>
      )}

      {userInfo.discord_url && (
        <a
          href={userInfo.discord_url}
          target="_blank"
          rel="noreferrer"
          className="messaging-link discord"
        >
          <i className="fab fa-discord messaging-icon" style={{ color: '#5865F2' }}></i>
        </a>
      )}

      {userInfo.telegram_url && (
        <a
          href={userInfo.telegram_url}
          target="_blank"
          rel="noreferrer"
          className="messaging-link telegram"
        >
          <i className="fab fa-telegram messaging-icon" style={{ color: '#0088CC' }}></i>
        </a>
      )}

      {userInfo.viber && (
        <a
          href={`viber://chat?number=${userInfo.viber}`}
          target="_blank"
          rel="noreferrer"
          className="messaging-link viber"
        >
          <i className="fab fa-viber messaging-icon" style={{ color: '#7360F2' }}></i>
        </a>
      )}

      {userInfo.wechat_url && (
        <a
          href={`weixin://dl/chat?${userInfo.wechat_url}`}
          target="_blank"
          rel="noreferrer"
          className="messaging-link wechat"
        >
          <i className="fab fa-weixin messaging-icon" style={{ color: '#1AAD19' }}></i>
        </a>
      )}
      {userInfo.line_url && (
        <a
          href={`weixin://dl/chat?${userInfo.line_url}`}
          target="_blank"
          rel="noreferrer"
          className="messaging-link wechat"
        >
          <i className="fab fa-line messaging-icon" style={{ color: '#1AAD19' }}></i>
        </a>
      )}
    </div>
  </div>
)}

              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  onClick={handleCreateVCard}
                  className="primary-button"
                >
                  <i className="fas fa-download"></i>
                  Save Contact
                </button>
                <button
                  onClick={() => setExchangeContact(true)}
                  className="secondary-button"
                >
                  <i className="fas fa-exchange-alt"></i>
                  Exchange Contact
                </button>
              </div>
            </div>
          </div>

          {/* Exchange Contact Modal */}
          {exchangeContact && (
  <div className="profile-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="profile-popup bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-xl relative"
      
    >
      <button 
        onClick={() => setExchangeContact(false)} 
        className="absolute top-4 right-4 text-gray-600 hover:text-white-800 transition-colors"
      >
        <i className="fas fa-times text-2xl"></i>
      </button>
      
      <div className="flex flex-col items-center h-full">
        <div className="text-center mb-6">
          <i className="fas fa-address-card text-4xl mb-3" 
            style={{ color: userInfo.user_colour || '#1c73ba' }}></i>
          <h2 
  className="text-xl font-semibold" 
  style={{ color: userInfo.user_colour || '#1c73ba' }}
>
  Exchange Contact Info
</h2>
        </div>

        <form className="w-full flex flex-col gap-4 flex-grow justify-center">
          {[
            { field: 'name', icon: 'user' },
            { field: 'email', icon: 'envelope' },
            { field: 'contact_number', icon: 'phone' }
          ].map(({ field, icon }) => (
            <div className="flex items-center gap-3" key={field}>
              <i 
                className={`fas fa-${icon} text-xl`}
                style={{ 
                  color: userInfo.user_colour || '#1c73ba',
                  minWidth: '32px'
                }}
              ></i>
              <input 
                type={field === 'email' ? 'email' : 'text'}
                id={field}
                placeholder={field.replace('_', ' ').toUpperCase()}
                value={contactFormData[field]} 
                onChange={handleContactChange} 
                className="border border-gray-300 p-2.5 rounded-xl w-full text-base focus:ring-2 focus:ring-indigo-200" 
                style={{ borderRadius: '12px' }}
              />
            </div>
          ))}

          <label className="flex items-center gap-3 cursor-pointer mt-4">
            <i 
              className="fas fa-camera text-xl"
              style={{ color: userInfo.user_colour || '#1c73ba', minWidth: '32px' }}
            ></i>
            <div className="border border-gray-300 p-2.5 rounded-xl w-full text-center bg-gray-50 hover:bg-gray-100 transition-colors"
              style={{ borderRadius: '12px' }}>
              {contactFormData.photo ? contactPhoto.name : "Upload Photo"}
              <input 
                type="file" 
                onChange={e => handleUploadPhoto(e.target.files[0])} 
                hidden 
                accept="image/*" 
              />
            </div>
          </label>

          {/* Status messages */}
          <div className="text-sm text-center h-6 mt-2">
            {contactPhotoUploadError && (
              <span className="text-red-600">Error: Image too large (max 10MB)</span>
            )}
            {contactPhotoUploadPercentage > 0 && contactPhotoUploadPercentage < 100 && (
              <span className="text-gray-600">Uploading: {contactPhotoUploadPercentage}%</span>
            )}
            {contactPhotoUploadPercentage === 100 && !contactPhotoUploadError && (
              <span className="text-green-600">Upload complete!</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleFormSubmit}
            className="text-base font-semibold text-white py-3 rounded-xl hover:opacity-90 transition-opacity mt-4"
            style={{ 
              backgroundColor: userInfo.user_colour || '#1c73ba',
              borderRadius: '12px'
            }}
          >
            <i className="fas fa-paper-plane mr-3"></i>
            Send Contact
          </button>
        
        </form>

      </div>
    </div>
  </div>
)}


          <footer className="modern-footer">
            <a href="https://flaap.me" target="_blank" rel="noreferrer">
              flap
            </a>
          </footer>
        </>
      )}
    </>
  );
}
}