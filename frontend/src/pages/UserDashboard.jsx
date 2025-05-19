import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import cover_photo from "/images/flap_logo.jpeg";
import flap_page_logo from "/images/flap_page_logo.png"; // Fallback logo
import UserNotFound from "../ui/userNotFound";
import QRCode from "qrcode";
import Navbar from "../ui/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import "../styles/Userdashboard.css";

export default function UsersDashboard() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [userPresent, setUserPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isQrShrunk, setIsQrShrunk] = useState(false);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://backend.flaap.me/api/user-info/${id}`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        const resData = await response.json();
        if (resData.success === false) {
          setUserPresent(false);
          return;
        }
        console.log("Backend response:", resData);
        setUserInfo(resData.user);
        console.log("organization_logo:", resData.user068organization_logo);
        setLoading(false);
        setUserPresent(true);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setUserPresent(false);
        setLoading(false);
      }
    };
  
    if (id && id !== "example") {
      fetchData();
    }
  }, [id]);

  const sanitizeFullName = (username) => {
    return username
      ? username
          .replace(/[^a-zA-Z\s'-]/g, "")
          .replace(/\s+/g, "")
          .trim()
          .replace(/(\S)(?=\S)/g, (match) => match.charAt(0))
      : "";
  };

  const createUserQr = async (username) => {
    const sanitizedUsername = sanitizeFullName(username);
    const qrData = `https://flaap.me/${sanitizedUsername}`;
    await generateQRWithLogo(qrData);
  };

  const generateQRCode = async (userData) => {
    const fullName = sanitizeFullName(userData.username || "No Name");
    const email = userData.email || "No Email";
    const phone = userData.phone_number_1
      ? `+977${userData.phone_number_1.replace(/[^0-9]/g, '')}`
      : "No Phone";
    const organization = userData.organization || "No Company";
    const title = userData.jobtitle || "No Title";

    const vCardData = `
BEGIN:VCARD
VERSION:4.0
N:${fullName.split(" ").slice(1).join(";")};${fullName.split(" ")[0]};;;
FN:${fullName}
EMAIL;TYPE=work:${email}
TEL;TYPE=cell:${phone}
ORG:${organization}
TITLE:${title}
END:VCARD`;

    await generateQRWithLogo(vCardData.trim());
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Required for external URLs
      img.src = src;
      img.onload = () => {
        console.log(`Image loaded successfully: ${src}`);
        resolve(img);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        reject(new Error(`Failed to load image: ${src}`));
      };
    });
  };

  const generateQRWithLogo = async (data) => {
  const canvas = qrCanvasRef.current;
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  try {
    const qrSize = isQrShrunk ? 100 : 300;
    canvas.width = qrSize;
    canvas.height = qrSize;

    await QRCode.toCanvas(canvas, data, {
      errorCorrectionLevel: "H",
      width: qrSize,
      margin: 1,
    });
    console.log("QR code rendered on canvas");

    const logoSrc = userInfo.organization_logo
      ? userInfo.organization_logo.startsWith("http")
        ? userInfo.organization_logo
        : `https://backend.flaap.me${userInfo.organization_logo}`
      : flap_page_logo;
    console.log("Attempting to load logo:", logoSrc);

    try {
      const logo = await loadImage(logoSrc);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get 2D canvas context");
        return;
      }

      const logoSize = qrSize * 0.2;
      const logoX = (qrSize - logoSize) / 2;
      const logoY = (qrSize - logoSize) / 2;

      ctx.fillStyle = "white";
      ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      console.log("Logo drawn on QR code");
    } catch (error) {
      console.error("Error overlaying logo:", error.message);
      if (logoSrc !== flap_page_logo) {
        console.log("Falling back to flap_page_logo.png");
        try {
          const logo = await loadImage(flap_page_logo);
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.error("Failed to get 2D canvas context for fallback");
            return;
          }

          const logoSize = qrSize * 0.2;
          const logoX = (qrSize - logoSize) / 2;
          const logoY = (qrSize - logoSize) / 2;

          ctx.fillStyle = "white";
          ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
          console.log("Fallback logo drawn on QR code");
        } catch (fallbackError) {
          console.error("Error overlaying fallback logo:", fallbackError.message);
          console.log("No logo displayed due to repeated failures");
        }
      }
    }
  } catch (error) {
    console.error("Error generating QR code:", error.message);
  }
};

  useEffect(() => {
    if (userInfo.username) {
      console.log("User info:", userInfo);
      console.log("Organization logo URL:", userInfo.organization_logo || "Using flap_page_logo.png");
      if (isOnline) {
        createUserQr(userInfo.username);
      } else {
        generateQRCode(userInfo);
      }
    }
  }, [userInfo, isOnline, isQrShrunk]);

  const handleQRTypeToggle = () => {
    setIsOnline((prev) => !prev);
  };

  const handleShare = async () => {
    const sanitizedUsername = encodeURIComponent(userInfo.username || "").replace(/%20/g, "");
    const shareUrl = `https://flaap.me/${sanitizedUsername}`;
    const shareData = {
      title: `${userInfo.username || "User"}'s Profile`,
      text: `Check out ${userInfo.username || "this user"}'s profile on Flap!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Profile shared successfully");
      } catch (error) {
        console.error("Error sharing profile:", error.message);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Profile URL copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error.message);
        alert("Failed to copy URL. Please try again.");
      }
    }
  };

  const handleShareNFC = async () => {
    const nfcData = `
BEGIN:VCARD
VERSION:4.0
N:${sanitizeFullName(userInfo.username || "No Name").split(" ").slice(1).join(";")};${sanitizeFullName(userInfo.username || "No Name").split(" ")[0]};;;
FN:${sanitizeFullName(userInfo.username || "No Name")}
EMAIL;TYPE=work:${userInfo.email || "No Email"}
TEL;TYPE=cell:${userInfo.phone_number_1 ? `+977${userInfo.phone_number_1.replace(/[^0-9]/g, '')}` : "No Phone"}
ORG:${userInfo.organization || "No Company"}
TITLE:${userInfo.jobtitle || "No Title"}
PHOTO;TYPE=JPEG;VALUE=URI:${userInfo.user_photo || ""}
END:VCARD`;

    try {
      if ("NDEFWriter" in window) {
        const ndef = new window.NDEFWriter();
        await ndef.write({
          records: [{ recordType: "text", data: nfcData.trim() }],
        });
        alert("Contact information sent via NFC!");
      } else {
        alert("NFC not supported on this device. You can share this QR Code instead.");
        console.log("NFC data:", nfcData);
      }
    } catch (error) {
      console.error("Error writing NFC tag:", error.message);
      alert("Error sharing via NFC.");
    }
  };

  if (id === "example") {
    return (
      <div className="dashboard-wrapper">
        <Navbar />
        <section className="main-section">
          <div className="container">
            <div
              className="cover-container"
              style={{ backgroundImage: `url(${userInfo.user_cover_photo || cover_photo})` }}
            ></div>
            <div className="profile-header">
              <div className="avatar-section">
                <img
                  src="/images/user-data/5bbdfaffaa69f-1e3db851b878b2fbe59639f48c715c53.png"
                  alt="User Profile Picture"
                  className="profile-avatar"
                />
              </div>
              <hr className="divider" />
              <div className="user-info">
                <h2 className="profile-name">Flap Card</h2>
              </div>
              <hr className="divider" />
              <div className="contact-info">
                <div className="info-item">
                  <img src="/images/phone.png" alt="Phone Icon" className="info-icon" />
                  <span>+977 9802365432</span>
                </div>
                <div className="info-item">
                  <img src="/images/mail.png" alt="Email Icon" className="info-icon" />
                  <span>card@flap.com.np</span>
                </div>
                <div className="info-item">
                  <img src="/images/organization-logo.png" alt="Org Icon" className="info-icon" />
                  <span>Flap</span>
                </div>
              </div>
              <hr className="divider" />
              <p className="user-description">Description</p>
            </div>
          </div>
        </section>
        <footer className="dashboard-footer">
          <div className="footer-container">
            <a target="_blank" rel="noreferrer" href="https://flaap.me">
              <p>@flap</p>
            </a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      {!userPresent ? (
        <UserNotFound />
      ) : loading ? (
        <div className="loading-screen">
          <p>Loading...</p>
        </div>
      ) : (
        <section className="main-section">
          <div className="container">
            <p style={{ textAlign: "center", fontSize: "16px", marginTop: "10px" }}>
              Tap the QR code to {isQrShrunk ? "enlarge" : "shrink"}
            </p>
            <div className="qr-section">
              <div className={`qr-code-container ${isQrShrunk ? "shrunk" : ""}`}>
                <canvas ref={qrCanvasRef} onClick={() => setIsQrShrunk(!isQrShrunk)} />
              </div>
              <div className="qr-toggle">
                <span className="toggle-label">Mode: {isOnline ? "Online" : "Offline"}</span>
                <div
                  className={`toggle-switch ${isOnline ? "checked" : ""}`}
                  onClick={handleQRTypeToggle}
                >
                  <span className="toggle-knob"></span>
                </div>
              </div>
            </div>

            <div className="cover-container">
              {userInfo.user_cover_photo?.endsWith(".mp4") ? (
                <video autoPlay loop muted className="cover-media">
                  <source src={userInfo.user_cover_photo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div
                  className="cover-image"
                  style={{
                    backgroundImage: `url(${userInfo.user_cover_photo || cover_photo})`,
                  }}
                ></div>
              )}
              <div className="cover-gradient" />
            </div>

            <div className="profile-header">
              <div className="avatar-section">
                <img
                  src={userInfo.user_photo || cover_photo}
                  alt="User Profile Picture"
                  className="profile-avatar"
                  style={{ border: `3px solid ${userInfo.user_colour || "#1c73ba"}` }}
                />
              </div>
              <div className="logo-section">
  <a
    href={`https://flaap.me/${userInfo.organization?.replace(/\s+/g, "") || ""}`}
    target="_blank"
    rel="noreferrer"
  >
    <img
      src={
        userInfo.organization_logo
          ? (userInfo.organization_logo.startsWith("http")
              ? userInfo.organization_logo
              : `https://backend.flaap.me${userInfo.organization_logo}`)
          : flap_page_logo
      }
      alt="Organization Logo"
      onError={(e) => {
        e.target.src = flap_page_logo;
      }}
      style={{
        borderColor: userInfo.user_colour || "#1c73ba",
        width: "33.33%",
        height: "auto",
      }}
      className="organization-logo"
    />
  </a>
</div>

              <div className="user-info">
                <div className="user-header">
                  <h2 className="profile-name">{userInfo.username || "User"}</h2>
                  <button
                    onClick={handleShare}
                    title="Share Profile"
                    className="share-button"
                  >
                    <FontAwesomeIcon
                      icon={faShare}
                      style={{ color: userInfo.user_colour || "#1c73ba" }}
                    />
                  </button>
                </div>
                {userInfo.jobtitle && <p className="profile-title">{userInfo.jobtitle}</p>}
                {userInfo.organization && (
                  <p className="profile-organization">{userInfo.organization}</p>
                )}
                {userInfo.address && <p className="profile-organization">{userInfo.address}</p>}
              </div>
            </div>

            <div className="info-card">
              <div className="contact-info">
                {userInfo.phone_number_1 && (
                  <div className="info-item">
                    <i
                      className="fas fa-phone info-icon"
                      style={{ color: userInfo.user_colour || "#1c73ba" }}
                    ></i>
                    <a
                      href={`tel:+${userInfo.phone_number_1.replace(/[-\s]/g, "")}`}
                      className="info-link"
                    >
                      {userInfo.phone_number_1}
                    </a>
                  </div>
                )}
                {userInfo.phone_number_2 && (
                  <div className="info-item">
                    <i
                      className="fas fa-phone info-icon"
                      style={{ color: userInfo.user_colour || "#1c73ba" }}
                    ></i>
                    <a href={`tel:${userInfo.phone_number_2}`} className="info-link">
                      {userInfo.phone_number_2}
                    </a>
                  </div>
                )}
                {userInfo.email && (
                  <div className="info-item">
                    <i
                      className="fas fa-envelope info-icon"
                      style={{ color: userInfo.user_colour || "#1c73ba" }}
                    ></i>
                    <a href={`mailto:${userInfo.email}`} className="info-link">
                      {userInfo.email}
                    </a>
                  </div>
                )}
                {userInfo.website_url && (
                  <div className="info-item">
                    <i
                      className="fas fa-globe info-icon"
                      style={{ color: userInfo.user_colour || "#1c73ba" }}
                    ></i>
                    <a
                      href={
                        userInfo.website_url.trim().startsWith("http")
                          ? userInfo.website_url.trim()
                          : `http://${userInfo.website_url.trim()}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="info-link"
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
              {userInfo.description && (
                <p className="user-description">{userInfo.description}</p>
              )}
            </div>

            {(userInfo.whatsapp ||
              userInfo.snapchat_url ||
              userInfo.discord_url ||
              userInfo.telegram_url) && (
              <div className="info-card">
                <h5 className="section-title">Messaging</h5>
                <div className="social-grid">
                  {userInfo.whatsapp && (
                    <a
                      href={`https://wa.me/${userInfo.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="WhatsApp"
                    >
                      <i
                        className="fab fa-whatsapp"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.snapchat_url && (
                    <a
                      href={userInfo.snapchat_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Snapchat"
                    >
                      <i
                        className="fab fa-snapchat"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.discord_url && (
                    <a
                      href={userInfo.discord_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Discord"
                    >
                      <i
                        className="fab fa-discord"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.telegram_url && (
                    <a
                      href={userInfo.telegram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Telegram"
                    >
                      <i
                        className="fab fa-telegram"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                </div>
              </div>
            )}

            {(userInfo.facebook_url ||
              userInfo.twitter_url ||
              userInfo.linkedin_url ||
              userInfo.instagram_url ||
              userInfo.youtube_url ||
              userInfo.tiktok_url ||
              userInfo.threads_url) && (
              <div className="info-card">
                <h5 className="section-title">Social Media</h5>
                <div className="social-grid">
                  {userInfo.facebook_url && (
                    <a
                      href={userInfo.facebook_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Facebook"
                    >
                      <i
                        className="fab fa-facebook"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.twitter_url && (
                    <a
                      href={userInfo.twitter_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Twitter"
                    >
                      <i
                        className="fab fa-twitter"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.linkedin_url && (
                    <a
                      href={userInfo.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="LinkedIn"
                    >
                      <i
                        className="fab fa-linkedin"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.instagram_url && (
                    <a
                      href={userInfo.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Instagram"
                    >
                      <i
                        className="fab fa-instagram"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.youtube_url && (
                    <a
                      href={userInfo.youtube_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="YouTube"
                    >
                      <i
                        className="fab fa-youtube"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.tiktok_url && (
                    <a
                      href={userInfo.tiktok_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="TikTok"
                    >
                      <i
                        className="fab fa-tiktok"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.threads_url && (
                    <a
                      href={userInfo.threads_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Threads"
                    >
                      <i
                        className="fas fa-comment-dots"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                </div>
              </div>
            )}

            {(userInfo.googlereview_url ||
              userInfo.tripadvisor_url ||
              userInfo.customreview_url) && (
              <div className="info-card">
                <h5 className="section-title">Reviews</h5>
                <div className="social-grid">
                  {userInfo.googlereview_url && (
                    <a
                      href={userInfo.googlereview_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Google Review"
                    >
                      <i
                        className="fab fa-google"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.tripadvisor_url && (
                    <a
                      href={userInfo.tripadvisor_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="TripAdvisor"
                    >
                      <i
                        className="fas fa-thumbs-up"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.customreview_url && (
                    <a
                      href={userInfo.customreview_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Custom Review"
                    >
                      <i
                        className="fas fa-star"
                        style={{
                          color: userInfo.user_colour || "#1c73ba",
                          fontSize: userInfo.star_size || "13px",
                        }}
                      ></i>
                      <i
                        className="fas fa-star"
                        style={{
                          color: userInfo.user_colour || "#1c73ba",
                          fontSize: userInfo.star_size || "9px",
                        }}
                      ></i>
                      <i
                        className="fas fa-star"
                        style={{
                          color: userInfo.user_colour || "#1c73ba",
                          fontSize: userInfo.star_size || "7px",
                        }}
                      ></i>
                      <i
                        className="fas fa-star"
                        style={{
                          color: userInfo.user_colour || "#1c73ba",
                          fontSize: userInfo.star_size || "9px",
                        }}
                      ></i>
                      <i
                        className="fas fa-star"
                        style={{
                          color: userInfo.user_colour || "#1c73ba",
                          fontSize: userInfo.star_size || "13px",
                        }}
                      ></i>
                    </a>
                  )}
                </div>
              </div>
            )}

            {(userInfo.link_url || userInfo.address_url || userInfo.github_url) && (
              <div className="info-card">
                <h5 className="section-title">General</h5>
                <div className="social-grid">
                  {userInfo.link_url && (
                    <a
                      href={userInfo.link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Link"
                    >
                      <i
                        className="fas fa-link"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.address_url && (
                    <a
                      href={userInfo.address_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="Address"
                    >
                      <i
                        className="fas fa-map-marker-alt"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                  {userInfo.github_url && (
                    <a
                      href={userInfo.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                      title="GitHub"
                    >
                      <i
                        className="fab fa-github"
                        style={{ color: userInfo.user_colour || "#1c73ba" }}
                      ></i>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      <footer className="dashboard-footer">
        <div className="footer-container">
          <a target="_blank" rel="noreferrer" href="https://flaap.me">
            <p>flap</p>
          </a>
        </div>
      </footer>
    </div>
  );
}
