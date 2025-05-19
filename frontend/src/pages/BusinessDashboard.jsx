import { useAuthContext } from "../hooks/use.auth.context";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import cover_photo from "/images/flap_logo.jpeg";
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import Navbar from "../ui/Navbar";

export default function Profile() {
  const { loading, error, dispatch, user } = useAuthContext();
  const userPhotoRef = useRef(null);
  const coverPhotoRef = useRef(null);
  const orgLogoRef = useRef(null);

  const [profilePicture, setProfilePicture] = useState(undefined);
  const [coverPhoto, setCoverPhoto] = useState(undefined);
  const [orgLogo, setOrgLogo] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [coverPhotoPercentage, setCoverPhotoPercentage] = useState(0);
  const [orgLogoPercentage, setOrgLogoPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [coverPhotoUploadError, setCoverPhotoUploadError] = useState(false);
  const [orgLogoUploadError, setOrgLogoUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    messaging: false,
    social: false,
    review: false,
    others: false,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const access_token = JSON.parse(localStorage.getItem('access_token'));
  const [selectedTheme, setSelectedTheme] = useState(user.theme || "");

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

  let isPhone1Valid = useRef(true);
  let isPhone2Valid = useRef(true);
  let phoneNumberEffectCall = useRef(0);

  const urlMap = {
    default_url: "Default",
    facebook_url: "Facebook",
    instagram_url: "Instagram",
    twitter_url: "Twitter",
    linkedin_url: "Linkedin",
    youtube_url: "Youtube",
    googlereview_url: "Google Review",
    tripadvisor_url: "Tripadvisor",
    website_url: "Website",
    tiktok_url: "Tiktok",
    snapchat_url: "Snapchat",
    threads_url: "Threads",
    viber: "Viber",
    whatsapp: "Whatsapp",
    wechat_url: "Wechat",
    discord_url: "Discord",
    telegram_url: "Telegram",
    link_url: "Link",
    address_url: "Address",
  };

  const urlMap2 = {
    Default: "default_url",
    Facebook: "facebook_url",
    Instagram: "instagram_url",
    Twitter: "twitter_url",
    Linkedin: "linkedin_url",
    Youtube: "youtube_url",
    "Google Review": "googlereview_url",
    Tripadvisor: "tripadvisor_url",
    Website: "website_url",
    Tiktok: "tiktok_url",
    Snapchat: "snapchat_url",
    Threads: "threads_url",
    Viber: "viber",
    Whatsapp: "whatsapp",
    Wechat: "wechat_url",
    Discord: "discord_url",
    Telegram: "telegram_url",
    Link: "link_url",
    Address: "address_url",
  };

  const platformIcons = {
    Default: "fas fa-home",
    Facebook: "fab fa-facebook",
    Instagram: "fab fa-instagram",
    Twitter: "fab fa-twitter",
    Linkedin: "fab fa-linkedin",
    Youtube: "fab fa-youtube",
    "Google Review": "fab fa-google",
    Tripadvisor: "fas fa-star",
    Website: "fas fa-globe",
    Tiktok: "fab fa-tiktok",
    Snapchat: "fab fa-snapchat",
    Threads: "fas fa-comment-dots",
    Viber: "fab fa-viber",
    Whatsapp: "fab fa-whatsapp",
    Wechat: "fab fa-weixin",
    Discord: "fab fa-discord",
    Telegram: "fab fa-telegram",
    Link: "fas fa-link",
    Address: "fas fa-map-marker-alt",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
    setActiveTab(section);
  };

  useEffect(() => {
    setSelectedTheme(user.theme || "");
    setFormData((prevData) => ({ ...prevData, theme: user.theme || "" }));
  }, [user.theme]);

  useEffect(() => {
    phoneNumberEffectCall.current++;
    if (phoneNumberEffectCall.current <= 2) {
      if (user.phone_number_1 && formData.phone_number_1 === "") {
        setFormData((prevData) => ({
          ...prevData,
          phone_number_1: prevData.phone_number_1 ? prevData.phone_number_1 : user.phone_number_1.toString(),
        }));
      }
      if (user.phone_number_2 && formData.phone_number_2 === "") {
        setFormData((prevData) => ({
          ...prevData,
          phone_number_2: prevData.phone_number_2 ? prevData.phone_number_2 : user.phone_number_2.toString(),
        }));
      }
      setSelectedUrl(urlMap[user.selected_url]);
    }
  }, [user.phone_number_1, user.phone_number_2, user.selected_url, formData.phone_number_1, formData.phone_number_2]);

  useEffect(() => {
    if (profilePicture) {
      handleUploadFile(profilePicture, "profilePicture");
    }
    if (coverPhoto) {
      handleUploadFile(coverPhoto, "coverPhoto");
    }
    if (orgLogo) {
      handleUploadFile(orgLogo, "orgLogo");
    }
    const phone_1 = document.querySelector("#phone_number_1");
    const phone_2 = document.querySelector("#phone_number_2");

    const iti1 = window.intlTelInput(phone_1, {
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
      autoPlaceholder: "aggressive",
      formatAsYouType: true,
      nationalMode: true,
      separateDialCode: true,
      strictMode: true,
      initialCountry: "auto",
      geoIpLookup: function (success, failure) {
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
          .then((data) => success(data.country_code))
          .catch(() => failure());
      },
    });

    const iti2 = window.intlTelInput(phone_2, {
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
      autoPlaceholder: "aggressive",
      formatAsYouType: true,
      nationalMode: true,
      separateDialCode: true,
      strictMode: true,
      initialCountry: "auto",
      geoIpLookup: function (success, failure) {
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
          .then((data) => success(data.country_code))
          .catch(() => failure());
      },
    });

    phone_1.addEventListener("countrychange", function () {
      setFormData((prevData) => ({
        ...prevData,
        phone_number_1: iti1.getNumber(intlTelInput.utils.numberFormat.NATIONAL),
      }));
    });

    phone_1.addEventListener("input", function () {
      isPhone1Valid.current = iti1.isValidNumber();
      setFormData((prevData) => ({
        ...prevData,
        phone_number_1: iti1.getNumber(intlTelInput.utils.numberFormat.NATIONAL),
      }));
    });

    phone_2.addEventListener("countrychange", function () {
      setFormData((prevData) => ({
        ...prevData,
        phone_number_2: iti2.getNumber(intlTelInput.utils.numberFormat.NATIONAL),
      }));
    });

    phone_2.addEventListener("input", function () {
      isPhone2Valid.current = iti2.isValidNumber();
      setFormData((prevData) => ({
        ...prevData,
        phone_number_2: iti2.getNumber(intlTelInput.utils.numberFormat.NATIONAL),
      }));
    });

    return () => {
      phone_1.removeEventListener("countrychange", () => {});
      phone_1.removeEventListener("input", () => {});
      phone_2.removeEventListener("countrychange", () => {});
      phone_2.removeEventListener("input", () => {});
    };
  }, [profilePicture, coverPhoto, orgLogo]);

  const handleUploadFile = (file, type) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (type === "profilePicture") {
          setFilePercentage(Math.round(progress));
        } else if (type === "coverPhoto") {
          setCoverPhotoPercentage(Math.round(progress));
        } else if (type === "orgLogo") {
          setOrgLogoPercentage(Math.round(progress));
        }
      },
      (error) => {
        if (type === "profilePicture") {
          setFileUploadError(true);
        } else if (type === "coverPhoto") {
          setCoverPhotoUploadError(true);
        } else if (type === "orgLogo") {
          setOrgLogoUploadError(true);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          if (type === "profilePicture") {
            setFormData({ ...formData, user_photo: downloadUrl });
          } else if (type === "coverPhoto") {
            setFormData({ ...formData, user_cover_photo: downloadUrl });
          } else if (type === "orgLogo") {
            setFormData({ ...formData, organization_logo: downloadUrl });
          }
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!access_token) {
        console.error("Missing access token");
        return dispatch({ type: "UPDATE_USER_FAILURE", payload: "Missing Authorization Token" });
      }

      const payload = { ...formData, theme: selectedTheme };

      const response = await fetch(`https://backend.flaap.me/api/user/update/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          console.error("Access denied: Invalid or expired token");
        }
        throw new Error(resData.message || "Update Failed");
      }

      if (resData.newToken) {
        localStorage.setItem("access_token", JSON.stringify(resData.newToken));
      }

      setSelectedTheme(resData.restUserInfo.theme || selectedTheme);
      dispatch({ type: "UPDATE_USER_SUCCESS", payload: resData.restUserInfo });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating user:", error.message);
      dispatch({ type: "UPDATE_USER_FAILURE", payload: error.message });
    }
  };

  const handleUrlChange = async (value) => {
    const valueToUrlForm = urlMap2[value];
    if (!user[valueToUrlForm]) {
      return;
    }
    setSelectedUrl(value);
    setFormData((prevData) => ({
      ...prevData,
      selected_url: urlMap2[value],
    }));
    setIsDropdownOpen(false);
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    setFormData((prevData) => ({
      ...prevData,
      theme,
    }));
    setIsThemeDropdownOpen(false);
  };

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "messaging", label: "Messaging" },
    { id: "social", label: "Social Media" },
    { id: "review", label: "Review" },
    { id: "others", label: "Others" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Cover Photo Section */}
      <div className="relative h-48 sm:h-64 bg-gray-200">
        <input
          onChange={(e) => setCoverPhoto(e.target.files[0])}
          type="file"
          ref={coverPhotoRef}
          hidden
          accept="image/*,video/*"
        />
        {(formData.user_cover_photo || user.user_cover_photo || cover_photo) ? (
          (formData.user_cover_photo || user.user_cover_photo || cover_photo).endsWith(".mp4") ? (
            <video
              src={formData.user_cover_photo || user.user_cover_photo || cover_photo}
              onClick={() => coverPhotoRef.current.click()}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              onClick={() => coverPhotoRef.current.click()}
              src={formData.user_cover_photo || user.user_cover_photo || cover_photo}
              alt="Cover Photo"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">No Cover Photo</div>
        )}
        <div className="absolute inset-0 bg-black/30 flex flex-col sm:flex-row items-end sm:items-center justify-between p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <div>
              <input
                onChange={(e) => setProfilePicture(e.target.files[0])}
                type="file"
                ref={userPhotoRef}
                hidden
                accept="image/*"
              />
              <img
                onClick={() => userPhotoRef.current.click()}
                src={formData.user_photo || user.user_photo || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{user.username || "User Name"}</h2>
              <p className="text-xs sm:text-sm text-gray-200">{user.jobtitle || "Job Title"} at {user.organization || "Organization"}</p>
            </div>
          </div>
          <div>
            <input
              onChange={(e) => setOrgLogo(e.target.files[0])}
              type="file"
              ref={orgLogoRef}
              hidden
              accept="image/*"
            />
            <img
              onClick={() => orgLogoRef.current.click()}
              src={formData.organization_logo || user.organization_logo || "https://via.placeholder.com/100"}
              alt="Organization Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => coverPhotoRef.current.click()}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow hover:bg-white text-sm"
        >
          Change Cover
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Sidebar (Mobile: Below Cover, Desktop: Sticky) */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Upload Feedback */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2"></h3>
                {fileUploadError ? (
                  <p className="text-red-500 text-xs sm:text-sm">Error (File must be less than 10MB)</p>
                ) : filePercentage > 0 && filePercentage < 100 ? (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${filePercentage}%` }}
                    ></div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{filePercentage}%</p>
                  </div>
                ) : filePercentage === 100 && !fileUploadError ? (
                  <p className="text-green-500 text-xs sm:text-sm flex items-center">
                    <i className="fas fa-check-circle mr-1"></i> Uploaded
                  </p>
                ) : null}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2"></h3>
                {coverPhotoUploadError ? (
                  <p className="text-red-500 text-xs sm:text-sm">Error (File must be less than 10MB)</p>
                ) : coverPhotoPercentage > 0 && coverPhotoPercentage < 100 ? (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${coverPhotoPercentage}%` }}
                    ></div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{coverPhotoPercentage}%</p>
                  </div>
                ) : coverPhotoPercentage === 100 && !coverPhotoUploadError ? (
                  <p className="text-green-500 text-xs sm:text-sm flex items-center">
                    <i className="fas fa-check-circle mr-1"></i> Uploaded
                  </p>
                ) : null}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2"></h3>
                {orgLogoUploadError ? (
                  <p className="text-red-500 text-xs sm:text-sm">Error (File must be less than 10MB)</p>
                ) : orgLogoPercentage > 0 && orgLogoPercentage < 100 ? (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${orgLogoPercentage}%` }}
                    ></div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{orgLogoPercentage}%</p>
                  </div>
                ) : orgLogoPercentage === 100 && !orgLogoUploadError ? (
                  <p className="text-green-500 text-xs sm:text-sm flex items-center">
                    <i className="fas fa-check-circle mr-1"></i> Uploaded
                  </p>
                ) : null}
              </div>
              {/* Mode and Theme Selection (Side by Side) */}
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                {/* Select Mode */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Select Mode</h3>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-all"
                    >
                      <span className="flex items-center">
                        <i className={`${platformIcons[selectedUrl] || "fas fa-home"} mr-2`} style={{ color: user.user_colour || "#1c73ba" }}></i>
                        {selectedUrl || "Select a platform"}
                      </span>
                      <svg
                        className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {Object.keys(urlMap2).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleUrlChange(key)}
                            disabled={!user[urlMap2[key]]}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium transition-all ${
                              !user[urlMap2[key]]
                                ? "text-gray-400 cursor-not-allowed"
                                : selectedUrl === key
                                ? `bg-[${user.user_colour || "#1c73ba"}] text-white`
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <i className={`${platformIcons[key]} mr-2`} style={{ color: user.user_colour || "#1c73ba" }}></i>
                            <span>{key}</span>
                            {user[urlMap2[key]] && (
                              <span className="ml-auto text-xs truncate max-w-[150px] text-gray-500">
                                {user[urlMap2[key]]}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Select Theme */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Select Theme</h3>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-all"
                    >
                      <span className="flex items-center">
                        <i className="fas fa-paint-brush mr-2" style={{ color: user.user_colour || "#1c73ba" }}></i>
                        {selectedTheme || "Select a theme"}
                      </span>
                      <svg
                        className={`w-4 h-4 transform transition-transform ${isThemeDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isThemeDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {validThemes.map((theme) => (
                          <button
                            key={theme}
                            type="button"
                            onClick={() => handleThemeChange(theme)}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium transition-all ${
                              selectedTheme === theme
                                ? `bg-[${user.user_colour || "#1c73ba"}] text-white`
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <i className="fas fa-paint-brush mr-2" style={{ color: user.user_colour || "#1c73ba" }}></i>
                            <span>{theme}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Tabs (Desktop Only) */}
              <div className="hidden md:block border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-1 text-center text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? `border-[${user.user_colour || '#1c73ba'}] text-[${user.user_colour || '#1c73ba'}]`
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      aria-current={activeTab === tab.id ? 'page' : undefined}
                      role="tab"
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Form Content */}
              <div className="mt-4 sm:mt-6">
                {/* Personal Details */}
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection("personal")}
                    className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm font-semibold"
                    aria-expanded={expandedSections.personal}
                    aria-controls="personal-section"
                    role="button"
                  >
                    <span>Personal Details</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${expandedSections.personal ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.personal && (
                    <div id="personal-section" className="p-3 grid grid-cols-1 gap-3">
                      <div className="relative">
                        <i
                          className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.username}
                          placeholder="Username"
                          id="username"
                          name="username"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="email"
                          defaultValue={user.email}
                          placeholder="Email"
                          id="email"
                          name="email"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="tel"
                          defaultValue={user.phone_number_1}
                          placeholder="Phone Number 1"
                          id="phone_number_1"
                          name="phone_number_1"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="tel"
                          defaultValue={user.phone_number_2}
                          placeholder="Phone Number 2"
                          id="phone_number_2"
                          name="phone_number_2"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-calendar-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="date"
                          defaultValue={user.dob}
                          placeholder="Date of Birth"
                          id="dob"
                          name="dob"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-location-arrow absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.address}
                          placeholder="Address"
                          id="address"
                          name="address"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.organization}
                          placeholder="Organization"
                          id="organization"
                          name="organization"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.jobtitle}
                          placeholder="Job Title"
                          id="jobtitle"
                          name="jobtitle"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-venus-mars absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.gender}
                          placeholder="Gender"
                          id="gender"
                          name="gender"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-info absolute left-3 top-3 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.description}
                          placeholder="Description"
                          id="description"
                          name="description"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      
                    </div>
                  )}
                </div>

                {/* Messaging */}
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection("messaging")}
                    className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm font-semibold"
                    aria-expanded={expandedSections.messaging}
                    aria-controls="messaging-section"
                    role="button"
                  >
                    <span>Messaging</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${expandedSections.messaging ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.messaging && (
                    <div id="messaging-section" className="p-3 grid grid-cols-1 gap-3">
                      <div className="relative">
                        <i
                          className="fab fa-whatsapp absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.whatsapp}
                          placeholder="WhatsApp"
                          id="whatsapp"
                          name="whatsapp"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-snapchat absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.snapchat_url}
                          placeholder="Snapchat"
                          id="snapchat_url"
                          name="snapchat_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-discord absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.discord_url}
                          placeholder="Discord"
                          id="discord_url"
                          name="discord_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-weixin absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.wechat_url}
                          placeholder="WeChat"
                          id="wechat_url"
                          name="wechat_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-viber absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.viber}
                          placeholder="Viber"
                          id="viber"
                          name="viber"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-telegram absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.telegram_url}
                          placeholder="Telegram"
                          id="telegram_url"
                          name="telegram_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.line_url}
                          placeholder="Line"
                          id="line_url"
                          name="line_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection("social")}
                    className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm font-semibold"
                    aria-expanded={expandedSections.social}
                    aria-controls="social-section"
                    role="button"
                  >
                    <span>Social Media</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${expandedSections.social ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.social && (
                    <div id="social-section" className="p-3 grid grid-cols-1 gap-3">
                      <div className="relative">
                        <i
                          className="fab fa-facebook absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.facebook_url}
                          placeholder="Facebook"
                          id="facebook_url"
                          name="facebook_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-instagram absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.instagram_url}
                          placeholder="Instagram"
                          id="instagram_url"
                          name="instagram_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-twitter absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.twitter_url}
                          placeholder="Twitter"
                          id="twitter_url"
                          name="twitter_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-linkedin absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.linkedin_url}
                          placeholder="LinkedIn"
                          id="linkedin_url"
                          name="linkedin_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-youtube absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.youtube_url}
                          placeholder="YouTube"
                          id="youtube_url"
                          name="youtube_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-tiktok absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.tiktok_url}
                          placeholder="TikTok"
                          id="tiktok_url"
                          name="tiktok_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-comment-dots absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.threads_url}
                          placeholder="Threads"
                          id="threads_url"
                          name="threads_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Review */}
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection("review")}
                    className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm font-semibold"
                    aria-expanded={expandedSections.review}
                    aria-controls="review-section"
                    role="button"
                  >
                    <span>Review</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${expandedSections.review ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.review && (
                    <div id="review-section" className="p-3 grid grid-cols-1 gap-3">
                      <div className="relative">
                        <i
                          className="fab fa-google absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.googlereview_url}
                          placeholder="Google Review"
                          id="googlereview_url"
                          name="googlereview_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-star absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.tripadvisor_url}
                          placeholder="Tripadvisor"
                          id="tripadvisor_url"
                          name="tripadvisor_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-book absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.customreview_url}
                          placeholder="Custom Review"
                          id="customreview_url"
                          name="customreview_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Others */}
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection("others")}
                    className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm font-semibold"
                    aria-expanded={expandedSections.others}
                    aria-controls="others-section"
                    role="button"
                  >
                    <span>Others</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${expandedSections.others ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.others && (
                    <div id="others-section" className="p-3 grid grid-cols-1 gap-3">
                      <div className="relative">
                        <i
                          className="fas fa-globe absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.website_url}
                          placeholder="Website"
                          id="website_url"
                          name="website_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-github absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.github_url}
                          placeholder="GitHub"
                          id="github_url"
                          name="github_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.link_url}
                          placeholder="Link"
                          id="link_url"
                          name="link_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-reddit absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.reddit_url}
                          placeholder="Reddit"
                          id="reddit_url"
                          name="reddit_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-pinterest absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.pinterest_url}
                          placeholder="Pinterest"
                          id="pinterest_url"
                          name="pinterest_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-map-marker-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.address_url}
                          placeholder="Maps"
                          id="address_url"
                          name="address_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-credit-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="tel"
                          defaultValue={user.phone_number_3}
                          placeholder="Payments"
                          id="phone_number_3"
                          name="phone_number_3"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop: Tabbed Content */}
                <div className="hidden md:block">
                  {activeTab === "personal" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <i
                          className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.username}
                          placeholder="Username"
                          id="username"
                          name="username"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="email"
                          defaultValue={user.email}
                          placeholder="Email"
                          id="email"
                          name="email"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="tel"
                          defaultValue={user.phone_number_1}
                          placeholder="Phone Number 1"
                          id="phone_number_1"
                          name="phone_number_1"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="tel"
                          defaultValue={user.phone_number_2}
                          placeholder="Phone Number 2"
                          id="phone_number_2"
                          name="phone_number_2"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-calendar-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="date"
                          defaultValue={user.dob}
                          placeholder="Date of Birth"
                          id="dob"
                          name="dob"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-location-arrow absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.address}
                          placeholder="Address"
                          id="address"
                          name="address"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.organization}
                          placeholder="Organization"
                          id="organization"
                          name="organization"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.jobtitle}
                          placeholder="Job Title"
                          id="jobtitle"
                          name="jobtitle"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-venus-mars absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.gender}
                          placeholder="Gender"
                          id="gender"
                          name="gender"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative md:col-span-2">
                        <i
                          className="fas fa-info absolute left-3 top-3 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.description}
                          placeholder="Description"
                          id="description"
                          name="description"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "messaging" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <i
                          className="fab fa-whatsapp absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.whatsapp}
                          placeholder="WhatsApp"
                          id="whatsapp"
                          name="whatsapp"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-snapchat absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.snapchat_url}
                          placeholder="Snapchat"
                          id="snapchat_url"
                          name="snapchat_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-discord absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.discord_url}
                          placeholder="Discord"
                          id="discord_url"
                          name="discord_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-weixin absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.wechat_url}
                          placeholder="WeChat"
                          id="wechat_url"
                          name="wechat_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-viber absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.viber}
                          placeholder="Viber"
                          id="viber"
                          name="viber"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-telegram absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.telegram_url}
                          placeholder="Telegram"
                          id="telegram_url"
                          name="telegram_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.line_url}
                          placeholder="Line"
                          id="line_url"
                          name="line_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "social" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <i
                          className="fab fa-facebook absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.facebook_url}
                          placeholder="Facebook"
                          id="facebook_url"
                          name="facebook_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-instagram absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.instagram_url}
                          placeholder="Instagram"
                          id="instagram_url"
                          name="instagram_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-twitter absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.twitter_url}
                          placeholder="Twitter"
                          id="twitter_url"
                          name="twitter_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-linkedin absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.linkedin_url}
                          placeholder="LinkedIn"
                          id="linkedin_url"
                          name="linkedin_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-youtube absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.youtube_url}
                          placeholder="YouTube"
                          id="youtube_url"
                          name="youtube_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-tiktok absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.tiktok_url}
                          placeholder="TikTok"
                          id="tiktok_url"
                          name="tiktok_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-comment-dots absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.threads_url}
                          placeholder="Threads"
                          id="threads_url"
                          name="threads_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "review" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <i
                          className="fab fa-google absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.googlereview_url}
                          placeholder="Google Review"
                          id="googlereview_url"
                          name="googlereview_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-star absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.tripadvisor_url}
                          placeholder="Tripadvisor"
                          id="tripadvisor_url"
                          name="tripadvisor_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-book absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.customreview_url}
                          placeholder="Custom Review"
                          id="customreview_url"
                          name="customreview_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "others" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <i
                          className="fas fa-globe absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.website_url}
                          placeholder="Website"
                          id="website_url"
                          name="website_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-github absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.github_url}
                          placeholder="GitHub"
                          id="github_url"
                          name="github_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.link_url}
                          placeholder="Link"
                          id="link_url"
                          name="link_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-reddit absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.reddit_url}
                          placeholder="Reddit"
                          id="reddit_url"
                          name="reddit_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fab fa-pinterest absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.pinterest_url}
                          placeholder="Pinterest"
                          id="pinterest_url"
                          name="pinterest_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-map-marker-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="text"
                          defaultValue={user.address_url}
                          placeholder="Maps"
                          id="address_url"
                          name="address_url"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fas fa-credit-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          style={{ color: user.user_colour || "#1c73ba" }}
                        ></i>
                        <input
                          type="tel"
                          defaultValue={user.phone_number_3}
                          placeholder="Payments"
                          id="phone_number_3"
                          name="phone_number_3"
                          className="pl-10 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-4 rounded-lg text-white font-semibold transition-all text-sm sm:text-base"
                style={{
                  backgroundColor: user.user_colour || "#1c73ba",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = user.user_colour || "#1c73ba";
                  e.target.style.border = `1px solid ${user.user_colour || "#1c73ba"}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = user.user_colour || "#1c73ba";
                  e.target.style.color = "white";
                  e.target.style.border = "none";
                }}
                role="button"
              >
                {loading ? "Loading..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg animate-fade-in text-xs sm:text-sm">
          {error}
        </div>
      )}
      {updateSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg animate-fade-in text-xs sm:text-sm">
          Profile Updated Successfully!
        </div>
      )}
    </div>
  );
}