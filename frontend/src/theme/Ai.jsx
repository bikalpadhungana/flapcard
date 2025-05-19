import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserNotFound from "../ui/userNotFound";
import flapLoading from "../../public/images/flap_loading.gif";
import Agent from "../pages/Agent";
import "../styles/Ai.css";

export default function Chat() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState("");
  const [userPresent, setUserPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [showChat, setShowChat] = useState(false);

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

          setUserId(resData.user._id || "");
          const selectedUrl = resData.user.selected_url;
          if (selectedUrl && selectedUrl !== "default_url") {
            setRedirecting(true);
            window.location.href = resData.user[selectedUrl];
            return;
          }

          setUserInfo(resData.user || {});
          setLoading(false);
          setUserPresent(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserPresent(false);
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (userInfo.username) {
      const firstName = userInfo.username.split(" ")[0];
      document.title = `${firstName}'s Flap`;
    }
  }, [userInfo]);

  const downloadVCard = (data) => {
    const element = document.createElement("a");
    const file = new Blob([data], { type: "text/vcard; charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${userInfo.username || "contact"}.vcf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCreateVCard = async () => {
    try {
      const response = await fetch(`https://backend.flaap.me/api/user-info/vcard/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
      const resData = await response.json();
      downloadVCard(resData);
    } catch (error) {
      console.error("Error creating vCard:", error);
    }
  };

  const handleCoverPhotoClick = () => {
    console.log("Cover photo clicked.");
  };

  if (redirecting) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <img src={flapLoading} alt="Loading" className="w-16 h-16" />
      </div>
    );
  }

  if (id === "example") {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="profile-card bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
          <div
            className="cover-photo h-40 bg-cover bg-center relative"
            style={{ backgroundImage: `url(/images/flap_logo.jpeg)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          </div>
          <div className="relative flex justify-center -mt-16">
            <img
              src="/images/user-data/5bbdfaffaa69f-1e3db851b878b2fbe59639f48c715c53.png"
              alt="User Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Flap Card</h2>
            <hr className="my-4 border-gray-300" />
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <i className="fas fa-phone text-blue-600"></i>
                <span>+977 9802365432</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <i className="fas fa-envelope text-blue-600"></i>
                <span>card@flap.com.np</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <i className="fas fa-building text-blue-600"></i>
                <span>Flap</span>
              </div>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="space-y-4">
              <div>
                <h5 className="text-lg font-medium text-gray-700">Message</h5>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  <a href="#" title="WhatsApp" className="social-icon"><i className="fab fa-whatsapp"></i></a>
                  <a href="#" title="Discord" className="social-icon"><i className="fab fa-discord"></i></a>
                  <a href="#" title="Snapchat" className="social-icon"><i className="fab fa-snapchat"></i></a>
                  <a href="#" title="Telegram" className="social-icon"><i className="fab fa-telegram"></i></a>
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-gray-700">Follow</h5>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  <a href="#" title="Facebook" className="social-icon"><i className="fab fa-facebook"></i></a>
                  <a href="#" title="Twitter" className="social-icon"><i className="fab fa-twitter"></i></a>
                  <a href="#" title="LinkedIn" className="social-icon"><i className="fab fa-linkedin"></i></a>
                  <a href="#" title="Instagram" className="social-icon"><i className="fab fa-instagram"></i></a>
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-gray-700">Reviews</h5>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <a href="#" title="Google Review" className="social-icon"><i className="fab fa-google"></i></a>
                  <a href="#" title="TripAdvisor" className="social-icon"><i className="fas fa-thumbs-up"></i></a>
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-gray-700">Others</h5>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <a href="#" title="Website" className="social-icon"><i className="fas fa-link"></i></a>
                  <a href="#" title="Address" className="social-icon"><i className="fas fa-map-marker-alt"></i></a>
                </div>
              </div>
            </div>
          </div>
          <footer className="bg-blue-600 text-white text-center py-4">
            <a href="https://flaap.me" target="_blank" rel="noopener noreferrer">@flap</a>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      {!userPresent ? (
        <UserNotFound />
      ) : loading ? (
        <div className="flex justify-center items-center h-screen">
          <img src={flapLoading} alt="Loading" className="w-16 h-16" />
        </div>
      ) : (
        <>
          {showChat && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowChat(false)}
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
                <Agent userinfo={userInfo} onClose={() => setShowChat(false)} />
              </div>
           
          )}
          <div className="profile-card bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="cover-photo h-40 bg-cover bg-center relative">
              {userInfo.user_cover_photo ? (
                userInfo.user_cover_photo.endsWith(".mp4") ? (
                  <video
                    src={userInfo.user_cover_photo}
                    onClick={handleCoverPhotoClick}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={userInfo.user_cover_photo}
                    alt="Cover"
                    onClick={handleCoverPhotoClick}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: userInfo.user_colour || "#1c73ba" }}
                ></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
            </div>
            <div className="relative flex justify-center -mt-16">
              <img
                src={userInfo.user_photo || "/images/default-user.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">{userInfo.username || "Unknown User"}</h2>
              {userInfo.jobtitle && <h3 className="text-lg text-gray-600 mt-1">{userInfo.jobtitle}</h3>}
              <div className="flex justify-center items-center h-full">
                 {userInfo.organization && (
                  <h4 className="text-md text-gray-500 mt-1">
                      {userInfo.organization}
                          </h4>
                             )}
                 </div>

             
              <div className="contact-info space-y-2 mt-4">
                {userInfo.phone_number_1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-phone" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
                    <a href={`tel:+${userInfo.phone_number_1.replace(/[-\s]/g, "")}`}>
                      {userInfo.phone_number_1}
                    </a>
                  </div>
                )}
                {userInfo.email && (
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-envelope" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
                    <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                  </div>
                )}
                {userInfo.website_url && (
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-globe" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
                    <a
                      href={
                        userInfo.website_url.trim().startsWith("http")
                          ? userInfo.website_url.trim()
                          : `http://${userInfo.website_url.trim()}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
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
              <div className="action-buttons flex flex-col items-center space-y-4 mt-6">
  <button
    onClick={handleCreateVCard}
    className="w-full max-w-xs px-4 py-2 rounded-lg text-white"
    style={{ backgroundColor: userInfo.user_colour || "#1c73ba" }}
  >
    Save Contact
  </button>
  <button
    onClick={() => setShowChat(true)}
    className="w-full max-w-xs px-4 py-2 rounded-lg text-white"
    style={{ backgroundColor: userInfo.user_colour || "#1c73ba" }}
  >
    Chat
  </button>
</div>


              {userInfo.description && <p className="text-gray-600 mt-2">{userInfo.description}</p>}

              <hr className="my-6 border-gray-300" />
              <div className="space-y-6">
                <div>
                  
                  {(userInfo.whatsapp || userInfo.telegram_url || userInfo.discord_url || userInfo.snapchat_url || userInfo.facebook_url || userInfo.twitter_url || userInfo.linkedin_url || userInfo.instagram_url || userInfo.googlereview_url || userInfo.tripadvisor_url || userInfo.link_url || userInfo.address_url) && (
  <div>
    <hr className="my-6 border-gray-300" />
    <div className="space-y-6">
      
      {/* Message Section */}
      {(userInfo.whatsapp || userInfo.telegram_url || userInfo.discord_url || userInfo.snapchat_url) && (
  <div>
    <h5 className="text-lg font-medium text-gray-700 text-center">Message</h5>
    <div className="flex flex-wrap justify-center gap-8 mt-2">
      {userInfo.whatsapp && (
        <a href={`https://wa.me/${userInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp">
          <i className="fab fa-whatsapp text-3xl" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
        </a>
      )}
      {userInfo.telegram_url && (
        <a href={userInfo.telegram_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="Telegram">
          <i className="fab fa-telegram text-3xl" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
        </a>
      )}
      {userInfo.discord_url && (
        <a href={userInfo.discord_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="Discord">
          <i className="fab fa-discord text-3xl" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
        </a>
      )}
      {userInfo.snapchat_url && (
        <a href={`https://www.snapchat.com/add/${userInfo.snapchat_url}`} target="_blank" rel="noopener noreferrer" className="social-icon" title="Snapchat">
          <i className="fab fa-snapchat text-3xl" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
        </a>
      )}
    </div>
  </div>
)}


      {/* Follow Section */}
      {(userInfo.facebook_url || userInfo.twitter_url || userInfo.linkedin_url || userInfo.instagram_url) && (
        <div>
          <h5 className="text-lg font-medium text-gray-700">Follow</h5>
          <div className="grid grid-cols-4 gap-8 mt-2 justify-items-center">
            {userInfo.facebook_url && (
              <a href={userInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                <i className="fab fa-facebook" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
              </a>
            )}
            {userInfo.twitter_url && (
              <a href={userInfo.twitter_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                <i className="fab fa-twitter" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
              </a>
            )}
            {userInfo.linkedin_url && (
              <a href={userInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                <i className="fab fa-linkedin" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
              </a>
            )}
            {userInfo.instagram_url && (
              <a href={userInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                <i className="fab fa-instagram" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {(userInfo.googlereview_url || userInfo.tripadvisor_url) && (
        <div>
          <h5 className="text-lg font-medium text-gray-700">Reviews</h5>
          <div className="grid grid-cols-2 gap-4 mt-2 justify-items-center">
            {userInfo.googlereview_url && (
              <a href={userInfo.googlereview_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="Google Review">
                <i className="fab fa-google" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
              </a>
            )}
            {userInfo.tripadvisor_url && (
              <a href={userInfo.tripadvisor_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="TripAdvisor">
                <i className="fas fa-thumbs-up" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Others Section */}
      {(userInfo.link_url || userInfo.address_url) && (
        <div>
          <h5 className="text-lg font-medium text-gray-700">Others</h5>
          <div className="grid grid-cols-2 gap-4 mt-2 justify-items-center">
            {userInfo.link_url && (
              <a href={userInfo.link_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="Link">
                <i className="fas fa-link" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
              </a>
            )}
            {userInfo.address_url && (
              <a href={userInfo.address_url} target="_blank" rel="noopener noreferrer" className="social-icon" title="Address">
                <i className="fas fa-map-marker-alt" style={{ color: userInfo.user_colour || "#1c73ba" }}></i>
              </a>
            )}
          </div>
        </div>
      )}

    </div>
  </div>
)}
                <div>
                  </div>
                </div>
              </div>
            </div>
            <footer
              className="text-white text-center py-4"
              style={{ backgroundColor: userInfo.user_colour || "#1c73ba" }}
            >
              <a href="https://flaap.me" target="_blank" rel="noopener noreferrer">
                flap
              </a>
            </footer>
          </div>
        </>
      )}
    </div>
  );
}