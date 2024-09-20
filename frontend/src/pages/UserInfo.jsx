import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// yo import is manual change it please!
import cover_photo from "/images/flap_logo.jpeg";
import UserNotFound from "../ui/userNotFound";

export default function UserInfo() {
  const { id } = useParams();
  
  const [userInfo, setUserInfo] = useState({});
  const [userPresent, setUserPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [exchangeContact, setExchangeContact] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    photo: null
  });
  const [contactPhotoUploadPercentage, setContactPhotoUploadPercentage] = useState(0);
  const [contactPhotoUploadError, setContactPhotoUploadError] = useState(false);

  useEffect(() => {
    if (id !== "example") {
      const fetchData = async () => {
        const response = await fetch(`https://backend-flap.esainnovation.com/api/user-info/${id}`);
  
        const resData = await response.json();

        if (resData.success === false) {
          setUserPresent(false);
          return;
        }

        setUserInfo(resData.user);
        setLoading(false);
        setUserPresent(true);
      };
  
      fetchData();
    }
  }, [id]);
  
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
    const response = await fetch(`https://backend-flap.esainnovation.com/api/user-info/vcard/${id}`, {
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

  const handleContactPhotoChange = (e) => {
    setContactFormData({ ...contactFormData, photo: e.target.files[0] });
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
              <div className="card-link">
                <a href="#"><div className="item"><img src="/images/facebook.png" alt="fb-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/twitter_2.png" alt="twitter-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/linked-in.png" alt="linkedin-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/insta.png" alt="instagram-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/youtube.png" alt="youtube-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/tripreview.png" alt="tripreview-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/website.png" alt="website-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/googlereview.png" alt="google-logo" /></div></a>
              </div>
              <hr />
            </div>
          </div>
        </section>
        <footer>
          <div className="footer-container">
            <a target="_blank" rel="noreferrer" href="https://flap.esainnovation.com"><h5>@flap</h5></a>
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
          <div>Loading</div>
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
                      <input type="text" id="contactNumber" value={contactFormData.contactNumber} onChange={handleContactChange} className="border p-2 rounded-lg w-full" />
                    </label>
                    <label className="flex flex-col items-center cursor-pointer">
                      <input type="file" onChange={handleContactPhotoChange} hidden accept="image/*" />
                      <div className="border p-2 rounded-lg w-full text-center">
                        {contactFormData.photo ? contactFormData.photo.name : "Upload Photo"}
                      </div>
                    </label>
                    <p className="text-center text-sm">
                      {contactPhotoUploadError ? (<span className="text-red-700">Error Uploading Image (must be less than 10MB)</span>) : (contactPhotoUploadPercentage > 0 && contactPhotoUploadPercentage < 100) ? (<span className="text-slate-700">{`Uploading ${contactPhotoUploadPercentage}%`}</span>) : (contactPhotoUploadPercentage === 100 && !contactPhotoUploadError) ? (<span className="text-green-700">Image Uploaded Successfully!</span>) : ""}
                    </p>
                    <button type="button" onClick={() => alert('Contact information submitted')} className="bg-[#1c74ba] text-white rounded-lg uppercase p-3 hover:opacity-95">Submit</button>
                  </form>
                </div>
              </div>
            )}
            
            <section className="main">
              <div className="container">
                <div className="upper-container">
                  {userInfo.user_cover_photo ? (
                    <img src={userInfo.user_cover_photo} onClick={""} />
                  ) : null}
                </div>
                <div className="img-sec">
                  <img src={userInfo.user_photo} alt="User Profile Picture" />
                </div>
                <div className="lower-container">
                  <hr />
                  <div className="card-body">
                    <h2 className="name">{userInfo.username}</h2>
                  </div>
                  <hr />
                  <div className="card-info">
                    {userInfo.phone_number_1 && (
                      <div className="info">
                        <img src="/images/phone.png" alt="" height="30px" />
                        <span>+977 {userInfo.phone_number_1}</span>
                      </div>
                    )}
                    {userInfo.phone_number_2 && (
                      <div className="info">
                        <img src="/images/phone.png" alt="" height="30px" />
                        <span>+977 {userInfo.phone_number_2}</span>
                      </div>
                    )}
                    <div className="info">
                      <img src="/images/mail.png" alt="" height="30px" />
                      <span>{userInfo.email}</span>
                    </div>
                    {userInfo.organization && (
                      <div className="info">
                        <img src="/images/organization-logo.png" alt="" height="30px" />
                        <span>{userInfo.organization}</span>
                      </div>
                    )}
                    {userInfo.designation && (
                      <div className="info">
                        <img src="/images/customer.png" alt="" height="30px" />
                        <span>{userInfo.designation}</span>
                      </div>
                    )}
                  </div>
                  <hr />
                  <p className="user-desc">Hi, I'm {userInfo.username.split(" ")[0]}</p>
                  <hr />
                  <div className="card-link">
                    {userInfo.facebook_url && (
                      <a href={userInfo.facebook_url} target="_blank" rel="noreferrer">
                        <div className="item">
                          <img src="/images/facebook.png" alt="fb-logo" />
                        </div>
                      </a>
                    )}
                    {userInfo.twitter_url && (
                      <a href={userInfo.twitter_url} target="_blank" rel="noreferrer">
                        <div className="item">
                          <img src="/images/twitter_2.png" alt="twitter-logo" />
                        </div>
                      </a>
                    )}
                    {userInfo.linkedin_url && (
                      <a href={userInfo.linkedin_url} target="_blank" rel="noreferrer">
                        <div className="item">
                          <img src="/images/linked-in.png" alt="linkedin-logo" />
                        </div>
                      </a>
                    )}
                    {userInfo.instagram_url && (
                      <a href={userInfo.instagram_url} target="_blank" rel="noreferrer">
                        <div className="item">
                          <img src="/images/insta.png" alt="instagram-logo" />
                        </div>
                      </a>
                    )}
                    {userInfo.youtube_url && (
                      <a href={userInfo.youtube_url} target="_blank" rel="noreferrer">
                        <div className="item">
                          <img src="/images/youtube.png" alt="youtube-logo" />
                        </div>
                      </a>
                    )}
                    {userInfo.googlereview_url && (
                      <a href={userInfo.googlereview_url} target="_blank" rel="noreferrer">
                        <div className="item">
                          <img src="/images/googlereview.png" alt="google-logo" />
                        </div>
                      </a>
                    )}
                    {userInfo.tripreview_url && (
                      <a href={userInfo.tripreview_url} target="_blank" rel="noreferrer">
                        <div className="item">
                          <img src="/images/tripreview.png" alt="tripadvisor-logo" />
                        </div>
                      </a>
                    )}
                    {userInfo.website_url && (
                      <a href={userInfo.website_url} target="_blank" rel="noreferrer">
                        <div className="item">
                          <img src="/images/website.png" alt="website-logo" />
                        </div>
                      </a>
                    )}
                  </div>
                  <hr />
                  <div className="button-container flex flex-row">
                    <button onClick={handleCreateVCard} className="download">
                      <h5>Save Contact</h5>
                      <img src="/images/download-icon.png" alt="" />
                    </button>
                    <button onClick={() => { setExchangeContact(true) }} className="download">
                      <h5>Exchange Contact</h5>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <footer>
              <div className="footer-container">
                <a target="_blank" rel="noreferrer" href="https://flap.esainnovation.com">
                  <h5>@flap</h5>
                </a>
              </div>
            </footer>
          </>
        )}
      </>
    );
  }
}
