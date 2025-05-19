import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
// yo import is manual change it please!
import cover_photo from "/images/flap_logo.jpeg";
import UserNotFound from "../ui/userNotFound";

import flapLoading from "../../public/images/flap_loading.gif";

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
          <div>
            <UserNotFound />
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-screen">
            <img src={flapLoading} className="w-1/2"/>
          </div>
          ) : (
          <>
                
                  {exchangeContact && (
              <div className="profile-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                <div className="profile-popup bg-white p-6 rounded-lg shadow-lg relative">
                  <button onClick={() => setExchangeContact(false)} className="absolute top-2 right-2 text-xl">×</button>
                  <h2 className="text-2xl font-semibold mb-4">Exchange Contact Information</h2>
                  <form className="flex flex-col gap-4">
                    <label>
                      Name:
                      <input type="text" id="name" value={contactFormData.name} onChange={handleContactChange} className="border p-2 rounded-lg w-full" />
                    </label>
                    <label>
                      Email:
                      <input type="email" id="email" value={contactFormData.email} onChange={handleContactChange} className="border p-2 rounded-lg w-full" />
                    </label>
                    <label>
                      Contact Number:
                      <input type="text" id="contact_number" value={contactFormData.contact_number} onChange={handleContactChange} className="border p-2 rounded-lg w-full" />
                    </label>
                    <label className="flex flex-col items-center cursor-pointer">
                      <input type="file" onChange={e => {handleUploadPhoto(e.target.files[0])}} hidden accept="image/*" />
                      <div className="border p-2 rounded-lg w-full text-center">
                        {contactFormData.photo ? contactPhoto.name : "Upload Photo"}
                      </div>
                    </label>
                    <p className="text-center text-sm">
                      {contactPhotoUploadError ? (<span className="text-red-700">Error Uploading Image (must be less than 10MB)</span>) : (contactPhotoUploadPercentage > 0 && contactPhotoUploadPercentage < 100) ? (<span className="text-slate-700">{`Uploading ${contactPhotoUploadPercentage}%`}</span>) : (contactPhotoUploadPercentage === 100 && !contactPhotoUploadError) ? (<span className="text-green-700">Image Uploaded Successfully!</span>) : ""}
                    </p>
                    <button
                             type="button"
                          onClick={handleFormSubmit}
                          className="text-white rounded-lg uppercase p-3 hover:opacity-95"
                       style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}
                              >
                          Submit
                            </button>

                  </form>
                </div>
              </div>
            )}
            
            <section className="main">
  <div className="container">
    <div className="upper-container">
      {userInfo.user_cover_photo ? (
        <img src={userInfo.user_cover_photo} onClick={handleCoverPhotoClick} />
      ) : null}
    </div>
                <div className="img-sec">
                  <img src={userInfo.user_photo} alt="User Profile Picture" />
                </div>
                
                
               
                <div className="lower-container">
  
  <div className="card-body">
    <h2 className="name">{userInfo.username}</h2>
  </div>
  {userInfo.jobtitle && (
    <div className="card-body">
      <h3>{userInfo.jobtitle}</h3>
    </div>
  )}
  {userInfo.organization && (
    <div className="card-body">
      <h4>{userInfo.organization}</h4>
    </div>
  )}
  <div className="logo-sec">
  {userInfo.organization_logo && (
    <a href={`https://flaap.me/${userInfo.organization}`} target="_blank" rel="noopener noreferrer">
      <img src={userInfo.organization_logo} alt="Organization Logo" />
    </a>
  )}
</div>


                  
<div className="card-info">
  {userInfo.phone_number_1 && (
    <div className="info" style={{ display: 'flex', alignItems: 'center' }}>
      <i className="fas fa-phone" style={{ fontSize: '27px', marginRight: '10px', color: userInfo.user_colour ||'#1c73ba' }}></i>
      <a href={`tel:+${userInfo.phone_number_1.replace(/[-\s]/g, '')}`} style={{ textDecoration: 'none', color: 'inherit', marginLeft: '0px' }}>
         {userInfo.phone_number_1}
      </a>
    </div>
  )}

  {userInfo.phone_number_2 && (
    <div className="info" style={{ display: 'flex', alignItems: 'center' }}>
      <i className="fas fa-phone" style={{ fontSize: '27px', marginRight: '10px', color: userInfo.user_colour ||'#1c73ba' }}></i>
      <a href={`tel:${userInfo.phone_number_2}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {userInfo.phone_number_2}
      </a>
    </div>
  )}
  {userInfo.email && (
    <div className="info" style={{ display: 'flex', alignItems: 'center' }}>
      <i className="fas fa-envelope" style={{ fontSize: '27px', marginRight: '10px', color: userInfo.user_colour ||'#1c73ba' }}></i>
      <a href={`mailto:${userInfo.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {userInfo.email}
      </a>
    </div>
  )}
  {userInfo.website_url && (
    <div className="info" style={{ display: 'flex', alignItems: 'center' }}>
      <i className="fas fa-globe" style={{ fontSize: '27px', marginRight: '10px', color: userInfo.user_colour ||'#1c73ba'}}></i>
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

               <div className="button-container flex flex-row">
                 <button
                  onClick={handleCreateVCard}
               className="download"
               style={{ backgroundColor: userInfo.user_colour || '#1c73ba', color: 'white' }}
                         >
                   <h5>Save Contact</h5>
                        </button>
                              <button
                                onClick={() => { setExchangeContact(true) }}
                        className="download"
                        style={{ backgroundColor: userInfo.user_colour || '#1c73ba', color: 'white' }}
                            >
                            <h5>Exchange Contact</h5>
                               </button>
                    </div>

                    
                  </div>
                  <hr style={{ borderColor: userInfo.user_colour || '#1c73ba' }} />

                   <p className="text-center description">{userInfo.description}</p>

                  <hr style={{ borderColor: userInfo.user_colour || '#1c73ba' }} />

                  
                   
                  <div className="messaging">
  {(userInfo.whatsapp || userInfo.snapchat_url || userInfo.discord_url || userInfo.telegram_url || userInfo.viber || userInfo.wechat_url) && (
    <>
      <div className="section-title">
        <h5>Message</h5>
      </div>
      <div className="messaging-grid">
      {userInfo.whatsapp && (
          <a href={`https://wa.me/${userInfo.whatsapp}`} target="_blank" rel="noreferrer" title="WhatsApp">
            <div className="item">
              <i className="fab fa-whatsapp" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.snapchat_url && (
  <a href={`https://www.snapchat.com/add/${userInfo.snapchat_url}`} target="_blank" rel="noreferrer" title="Snapchat">
    <div className="item">
      <i className="fab fa-snapchat" style={{ fontSize: '30px', color: userInfo.user_colour || '#1c73ba' }}></i>
    </div>
  </a>
)}

        {userInfo.discord_url && (
          <a href={userInfo.discord_url} target="_blank" rel="noreferrer" title="Discord">
            <div className="item">
              <i className="fab fa-discord" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
       {userInfo.wechat_url && (
  <a href={`weixin://dl/chat?${userInfo.wechat_url}`} target="_blank" rel="noreferrer" title="WeChat">
    <div className="item">
      <i className="fab fa-weixin" style={{ fontSize: '30px', color: userInfo.user_colour || '#1c73ba' }}></i>
    </div>
  </a>
)}

           {userInfo.viber && (
  <a href={`viber://chat?number=${userInfo.viber}`} target="_blank" rel="noreferrer" title="Viber">
    <div className="item">
      <i className="fab fa-viber" style={{ fontSize: '30px', color: userInfo.user_colour || '#1c73ba' }}></i>
    </div>
  </a>
)}


        {userInfo.telegram_url && (
          <a href={userInfo.telegram_url} target="_blank" rel="noreferrer" title="Telegram">
            <div className="item">
              <i className="fab fa-telegram" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
      </div>
    </>
  )}
</div>


<div className="socialmedia">
  {(userInfo.facebook_url || userInfo.twitter_url || userInfo.linkedin_url || userInfo.instagram_url || userInfo.youtube_url || userInfo.tiktok_url || userInfo.threads_url) && (
    <>
      <div className="section-title">
        <h5>Follow</h5>
      </div>
      <div className="socialmedia-grid">
        {userInfo.facebook_url && (
          <a href={userInfo.facebook_url} target="_blank" rel="noreferrer">
            <div className="item" title="Facebook">
              <i className="fab fa-facebook" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        
        {userInfo.linkedin_url && (
          <a href={userInfo.linkedin_url} target="_blank" rel="noreferrer">
            <div className="item" title="LinkedIn">
              <i className="fab fa-linkedin" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.instagram_url && (
          <a href={userInfo.instagram_url} target="_blank" rel="noreferrer">
            <div className="item" title="Instagram">
              <i className="fab fa-instagram" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.twitter_url && (
          <a href={userInfo.twitter_url} target="_blank" rel="noreferrer">
            <div className="item" title="Twitter">
              <i className="fab fa-twitter" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.youtube_url && (
          <a href={userInfo.youtube_url} target="_blank" rel="noreferrer">
            <div className="item" title="YouTube">
              <i className="fab fa-youtube" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.tiktok_url && (
          <a href={userInfo.tiktok_url} target="_blank" rel="noreferrer">
            <div className="item" title="TikTok">
              <i className="fab fa-tiktok" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.threads_url && (
          <a href={userInfo.threads_url} target="_blank" rel="noreferrer">
            <div className="item" title="Threads">
              <i className="fas fa-comment-dots" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
      </div>
    </>
  )}
</div>




           
<div className="review">
  {(userInfo.googlereview_url || userInfo.tripadvisor_url || userInfo.customreview_url) && (
    <>
      <div className="section-title">
        <h5>Reviews</h5>
      </div>
      <div className="review-grid">
        {userInfo.googlereview_url && (
          <a href={userInfo.googlereview_url} target="_blank" rel="noreferrer">
            <div className="item" title="Google Review">
              <i className="fab fa-google" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.tripadvisor_url && (
          <a href={userInfo.tripadvisor_url} target="_blank" rel="noreferrer">
            <div className="item" title="TripAdvisor">
              <i className="fas fa-thumbs-up" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.customreview_url && (
  <a href={userInfo.customreview_url} target="_blank" rel="noreferrer">
    <div className="item" title="Custom Review">
      <i className="fas fa-star" style={{ fontSize: '12px', color: userInfo.user_colour || '#1c73ba' }}></i>
      <i className="fas fa-star" style={{ fontSize: '18px', color: userInfo.user_colour || '#1c73ba' }}></i>
      <i className="fas fa-star" style={{ fontSize: '24px', color: userInfo.user_colour || '#1c73ba' }}></i>
      <i className="fas fa-star" style={{ fontSize: '18px', color: userInfo.user_colour || '#1c73ba' }}></i>
      <i className="fas fa-star" style={{ fontSize: '12px', color: userInfo.user_colour || '#1c73ba' }}></i>
    </div>
  </a>
)}

      </div>
    </>
  )}
</div>


<div className="general">
  {(userInfo.link_url || userInfo.address_url) && (
    <>
      <div className="section-title">
        <h5>Others</h5>
      </div>
      <div className="general-grid">
        {userInfo.link_url && (
          <a href={userInfo.link_url} target="_blank" rel="noreferrer" title="Link">
            <div className="item">
              <i className="fas fa-link" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
        {userInfo.address_url && (
          <a href={userInfo.address_url} target="_blank" rel="noreferrer" title="Address">
            <div className="item">
              <i className="fas fa-map-marker-alt" style={{ fontSize: '30px', color: userInfo.user_colour ||'#1c73ba' }}></i>
            </div>
          </a>
        )}
      </div>
    </>
  )}
</div>



</div>
                  

                  
                   </div>

            </section>
            <footer> <div className="footer-container" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }} >
               <a target="_blank" rel="noreferrer" 
               href="https://flaap.me"> <h5>flap</h5> </a> </div> </footer>
          </>
        )}
      </>
    );
  }
}