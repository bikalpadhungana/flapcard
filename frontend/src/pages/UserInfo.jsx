import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// yo import is manual change it please!
import cover_photo from "/images/flap_logo.jpeg";

export default function UserInfo() {
  const { id } = useParams();
  
  const [userInfo, setUserInfo] = useState({});
  const [userPresent, setUserPresent] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (id !== "example") {
      const fetchData = async () => {
        const response = await fetch(`https://backend-flap.esainnovation.com/api/user-info/${id}`);
  
        const resData = await response.json();

        if (resData.success === false) {
          setUserPresent(false);
          return;
        }

        // check current user url
        // if (resData.selectedUrl === 'default_url') {
        setUserInfo(resData.user);
        setLoading(false);
        setUserPresent(true);
        // } else {
        //   if (resData.url) {
        //     window.location.replace(resData.url);
        //   }
        // }
  
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
                <h2 className="name">John Doe</h2>
                {/* <p className="caption">Currently Working in <a href="https://flap.esainnovation.com" target="_blank" rel="noreferrer">Flap</a></p> */}
              </div>
              <hr />
              <div className="card-info">
                <div className="info">
                  <img src="/images/phone.png" alt="" height="30px" />
                  <span>+977 9812345678</span>
                </div>
                <div className="info">
                  <img src="/images/mail.png" alt="" height="30px" />
                  <span>example@gmail.com</span>
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
                <a href="#"><div className="item"><img src="/images/twitter_2.png" alt="fb-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/linked-in.png" alt="fb-logo" /></div></a>
                <a href="#"><div className="item"><img src="/images/insta.png" alt="fb-logo" /></div></a>
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
    )
  } else {
    return (
      <div>
        {!userPresent ? (
          <div>
            User not found
          </div>
        ) : loading ? (<div>Loading</div>) : (
          <div>
            <section className="main">
              <div className="container">
                <div className="upper-container">
                  <img src={userInfo.user_cover_photo ? userInfo.user_cover_photo : cover_photo} alt="coverphoto" onClick={""}/>
                </div>
                <div className="img-sec">
                  <img src={ userInfo.user_photo } alt="User Profile Picture" />
                </div>
                <div className="lower-container">
                  <hr />
                  <div className="card-body">
                      <h2 className="name">{ userInfo.username }</h2>
                    {/* <p className="caption"><span>UI/UX dev</span>, <a href="https://flap.esainnovation.com" target="_blank" rel="noreferrer">Flap</a></p> */}
                  </div>
                  <hr />
                    <div className="card-info">
                      {userInfo.phone_number_1 && 
                        (
                        <div className="info">
                          <img src="/images/phone.png" alt="" height="30px" />
                          <span>+977 { userInfo.phone_number_1 }</span>
                        </div>
                      )} 
                      {userInfo.phone_number_2 && 
                        (
                        <div className="info">
                          <img src="/images/phone.png" alt="" height="30px" />
                          <span>+977 { userInfo.phone_number_2 }</span>
                        </div>
                      )}
                      <div className="info">
                        <img src="/images/mail.png" alt="" height="30px" />
                        <span>{ userInfo.email }</span>
                      </div>
                      {userInfo.organization && 
                        (
                        <div className="info">
                          <img src="/images/organization-logo.png" alt="" height="30px" />
                          <span>{ userInfo.organization }</span>
                        </div>
                      )}
                  </div>
                  <hr />
                  <p className="user-desc">Hi, I'm {userInfo.username.split(" ")[0]} </p>
                  <hr />
                    <div className="card-link">
                      {userInfo.facebook_url && (<a href={userInfo.facebook_url} target="_blank" rel="noreferrer"><div className="item"><img src="/images/facebook.png" alt="fb-logo" /></div></a>)}  
                      {userInfo.twitter_url && (<a href={userInfo.twitter_url} target="_blank" rel="noreferrer"><div className="item"><img src="/images/twitter_2.png" alt="twitter-logo" /></div></a>)}
                      {userInfo.linkedin_url && (<a href={userInfo.linkedin_url} target="_blank" rel="noreferrer"><div className="item"><img src="/images/linked-in.png" alt="linkedin-logo" /></div></a>)}
                      {userInfo.instagram_url && (<a href={userInfo.instagram_url} target="_blank" rel="noreferrer"><div className="item"><img src="/images/insta.png" alt="instagram-logo" /></div></a>)}
                      {userInfo.youtube_url && (<a href={userInfo.youtube_url} target="_blank" rel="noreferrer"><div className="item"><img src="/images/youtube.png" alt="youtube-logo" /></div></a>)}
                  </div>
                  <hr />
                  <button onClick={handleCreateVCard} className="download">
                    <h5>Save Contact</h5>
                    <img src="/images/download-icon.png" alt="" />
                  </button>
                </div>
              </div>
            </section>
            <footer>
              <div className="footer-container">
                <a target="_blank" rel="noreferrer" href="https://flap.esainnovation.com"><h5>@flap</h5></a>
              </div>
            </footer>
          </div>
        )} 
    </div>
    )
  }

}
