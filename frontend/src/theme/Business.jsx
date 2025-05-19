import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import cover_photo from "/images/flap_logo.jpeg";
import UserNotFound from "../ui/userNotFound";
import flapLoading from "../../public/images/flap_loading.gif";
import "../styles/Business.css";

export default function Business() {
  
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
              <div className="review">
              
                <a href="#"><div className="item"><img src="/images/tripadvisor.png" alt="tripadvisor-logo" /></div></a>
                
                <a href="#"><div className="item"><img src="/images/googlereview.png" alt="google-logo" /></div></a>
                
              </div>
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
  } else {
    return (
    <>
      {!userPresent ? (
        <UserNotFound />
      ) : loading ? (
        <div className="flex justify-center items-center h-screen">
          <img src={flapLoading} className="w-1/2" alt="Loading" />
        </div>
      ) : (
        <>
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

          <div className="business-container">
            {/* Cover Section */}
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
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            </div>

            {/* Profile Section */}
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
              
              <h1 className="text-4xl font-bold mt-6 mb-2">{userInfo.username}</h1>
              {userInfo.jobtitle && (
                <p className="text-xl text-gray-600 mb-2">{userInfo.jobtitle}</p>
              )}
              {userInfo.organization && (
                <p className="text-lg text-gray-500">{userInfo.organization}</p>
              )}
              {userInfo.address && (
                <p className="text-lg text-gray-500">{userInfo.address}</p>
              )}
              
            </div>

<div className="messaging">
  {(userInfo.whatsapp || userInfo.snapchat_url || userInfo.discord_url || userInfo.telegram_url || userInfo.viber || userInfo.wechat_url || userInfo.line_url) && (
    <>
      <div className="section-title">
        
      </div>
      <div className="messaging-grid">
      {userInfo.whatsapp && (
          <a href={`https://wa.me/${userInfo.whatsapp}`} target="_blank" rel="noreferrer" title="WhatsApp">
            <div className="item">
              <i className="fab fa-whatsapp" style={{  color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.snapchat_url && (
  <a href={`https://www.snapchat.com/add/${userInfo.snapchat_url}`} target="_blank" rel="noreferrer" title="Snapchat">
    <div className="item">
      <i  className= "fab fa-snapchat" style={{  color: userInfo.user_colour || '#1c73ba' }}></i>
    </div>
  </a>
)}

        {userInfo.discord_url && (
          <a href={userInfo.discord_url} target="_blank" rel="noreferrer" title="Discord">
            <div className="item">
              <i className="fab fa-discord" style={{  color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
       {userInfo.wechat_url && (
  <a href={`weixin://dl/chat?${userInfo.wechat_url}`} target="_blank" rel="noreferrer" title="WeChat">
    <div className="item">
      <i className="fab fa-weixin" style={{  color: userInfo.user_colour || '#1c73ba' }}></i>
    </div>
  </a>
)}

           {userInfo.viber && (
  <a href={`viber://chat?number=${userInfo.viber}`} target="_blank" rel="noreferrer" title="Viber">
    <div className="item">
      <i className="fab fa-viber" style={{  color: userInfo.user_colour || '#1c73ba' }}></i>
    </div>
  </a>
)}


        {userInfo.telegram_url && (
          <a href={userInfo.telegram_url} target="_blank" rel="noreferrer" title="Telegram">
            <div className="item">
              <i className="fab fa-telegram" style={{  color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
         {userInfo.line_url && (
          <a href={userInfo.line_url} target="_blank" rel="noreferrer" title="Telegram">
            <div className="item">
              <i className="fab fa-line" style={{  color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
      </div>
    </>
  )}

</div>

            {/* Contact Section */}
            <div className="business-info-section">
              <div className="business-contact-grid">
                {userInfo.phone_number_1 && (
                  <div className="business-contact-card">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-phone-alt text-2xl" 
                         style={{ color: userInfo.user_colour || '#1c73ba' }} />
                      <div>
                        <p className="text-sm text-gray-500">Business Phone</p>
                        <a href={`tel:${userInfo.phone_number_1}`} 
                          className="text-lg font-medium">
                          {userInfo.phone_number_1}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {userInfo.phone_number_2 && (
                  <div className="business-contact-card">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-phone-alt text-2xl" 
                         style={{ color: userInfo.user_colour || '#1c73ba' }} />
                      <div>
                        <p className="text-sm text-gray-500">Business Phone</p>
                        <a href={`tel:${userInfo.phone_number_2}`} 
                          className="text-lg font-medium">
                          {userInfo.phone_number_2}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {userInfo.email && (
                  <div className="business-contact-card">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-envelope text-2xl"
                        style={{ color: userInfo.user_colour || '#1c73ba' }} />
                      <div>
                        <p className="text-sm text-gray-500">Business Email</p>
                        <a href={`mailto:${userInfo.email}`} 
                          className="text-lg font-medium">
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

            {/* Social Proof Section */}
            <div className="business-social-section">
              {(userInfo.facebook_url || userInfo.linkedin_url || userInfo.instagram_url || userInfo.twitter_url || userInfo.youtube_url || userInfo.tiktok_url) && (
                <>
                  <h3 className="text-2xl font-bold text-center mb-8">Connect With Us</h3>
                  <div className="business-social-grid">
                    {userInfo.facebook_url && (
                      <a href={userInfo.facebook_url} className="business-social-icon"
                        style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-facebook-f text-white text-2xl" />
                      </a>
                    )}
                    {userInfo.linkedin_url && (
                      <a href={userInfo.linkedin_url} className="business-social-icon"
                        style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-linkedin-in text-white text-2xl" />
                      </a>
                    )}
                    {userInfo.instagram_url && (
                      <a href={userInfo.instagram_url} className="business-social-icon"
                        style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-instagram text-white text-2xl" />
                      </a>
                    )}
                    {userInfo.twitter_url && (
                      <a href={userInfo.twitter_url} className="business-social-icon"
                        style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-twitter text-white text-2xl" />
                      </a>
                    )}
                    {userInfo.youtube_url && (
                      <a href={userInfo.youtube_url} className="business-social-icon"
                        style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-youtube text-white text-2xl" />
                      </a>
                    )}
                    {userInfo.tiktok_url && (
                      <a href={userInfo.tiktok_url} className="business-social-icon"
                        style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                        <i className="fab fa-tiktok text-white text-2xl" />
                      </a>
                    )}

                    {/* Add other social links similarly */}
                  </div>
                </>
              )}
{/* Reviews Section */}
{(userInfo.tripadvisor_url || userInfo.customreview_url || userInfo.googlereview_url) && (
  <div className="reviews-section px-4 py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
        Customer Experiences
        <span className="block mt-2 text-lg font-normal text-gray-500">Trusted by thousands of satisfied clients</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
{/* Google Reviews Card */}
{userInfo.googlereview_url && (
          <a
            href={userInfo.googlereview_url}
            className="review-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.016 3.585-.07 4.85c-.055 1.17-.249 1.805-.415 2.227-.224.562-.479.96-.896 1.382-.419.419-.824.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07-4.85s-.016-3.585-.07-4.85c-.055-1.17-.249-1.806-.415-2.227-.217-.562-.478-.96-.896-1.382-.42-.419-.824-.679-1.381-.896-.422-.164-1.057-.36-2.227-.413-1.266-.057-1.646-.07-4.85-.07zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162S8.595 18.162 12 18.162s6.162-2.76 6.162-6.162S15.405 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4z"/>
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Google Reviews</h4>
            </div>
            <p className="text-gray-600 mb-6">"Share your experience with us on Google and help others discover our services!"</p>
            <div className="flex items-center text-blue-600 font-medium">
              <span>Share Your Experience</span>
              <i className="fas fa-edit ml-2 transition-transform group-hover:rotate-12"/>
            </div>
          </a>
        )}
       {/* Testimonial Card */}
{userInfo.customreview_url && (
  <a
    href={userInfo.customreview_url}
    className="review-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden"
    target="_blank"
    rel="noreferrer"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"/>
    <div className="flex items-center mb-6">
      <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
        <i className="fas fa-comment-dots text-2xl text-amber-600"/>
      </div>
      <h4 className="text-2xl font-bold text-gray-900">Custom Review </h4>
    </div>
    <div className="relative mb-6">
      <i className="absolute top-0 left-0 text-gray-200 text-3xl fa fa-quote-left"/>
      <p className="text-gray-600 pl-8 italic">
      "We'd love to hear your thoughts—leave a custom review and share your story with us!"
      </p>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex space-x-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <i key={i} className="fas fa-star"/>
        ))}
      </div>
      <div className="flex items-center text-amber-600 font-medium">
        <span>View Testimonial</span>
        <i className="fas fa-external-link-alt ml-2 text-sm transition-transform group-hover:translate-x-1"/>
      </div>
    </div>
  </a>
)}

        

        {/* Tripadvisor Card */}
        {userInfo.tripadvisor_url && (
          <a
            href={userInfo.tripadvisor_url}
            className="review-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Tripadvisor</h4>
            </div>
            <p className="text-gray-600 mb-6">"Let the world know about your journey by writing a review on Tripadvisor!"</p>
            <div className="flex items-center text-green-600 font-medium">
              <span> Reviews us</span>
              <i className="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"/>
            </div>
          </a>
        )}
      </div>
    </div>
  </div>
)}


<hr style={{ borderColor: userInfo.user_colour || '#1c73ba' }} />

                   <p className="text-center description">{userInfo.description}</p>

                  <hr style={{ borderColor: userInfo.user_colour || '#1c73ba' }} />
              
            </div>
          </div>

          <footer className="footer-container" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
            <a target="_blank" rel="noreferrer" href="https://flaap.me">
              <h5>flap</h5>
            </a>
          </footer>
        </>
      )}
    </>
  );
}
}