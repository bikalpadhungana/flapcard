import { useAuthContext } from "../hooks/use.auth.context";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import cover_photo from "/images/flap_logo.jpeg";

// components
import Navbar from "../ui/Navbar";

export default function Profile() {
  
  const { loading, error, dispatch, user } = useAuthContext();
  const userPhotoRef = useRef(null);
  const coverPhotoRef = useRef(null);
  
  const [profilePicture, setProfilePicture] = useState(undefined);
  const [coverPhoto, setCoverPhoto] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [coverPhotoPercentage, setCoverPhotoPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [coverPhotoUploadError, setCoverPhotoUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const access_token = JSON.parse(localStorage.getItem('access_token'));
  const refresh_token = JSON.parse(localStorage.getItem('refresh_token'));

  useEffect(() => {
    if (profilePicture) {
      handleUploadFile(profilePicture, "profilePicture");
    }
    if (coverPhoto) {
      handleUploadFile(coverPhoto, "coverPhoto");
    }
  }, [profilePicture, coverPhoto]);

  const handleUploadFile = (file, type) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (type === "profilePicture") {
          setFilePercentage(Math.round(progress));
        } else if (type === "coverPhoto") {
          setCoverPhotoPercentage(Math.round(progress));
        }
      },
      (error) => {
        if (type === "profilePicture") {
          setFileUploadError(true);
        } else if (type === "coverPhoto") {
          setCoverPhotoUploadError(true);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            if (type === "profilePicture") {
              setFormData({ ...formData, user_photo: downloadUrl });
            } else if (type === "coverPhoto") {
              setFormData({ ...formData, user_cover_photo: downloadUrl });
            }
          });
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdateSuccess(false);
      dispatch({ type: 'UPDATE_USER_START' });

      if ((formData.phone_number_1 && formData.phone_number_1.length != 10) || (formData.phone_number_2 && formData.phone_number_2.length != 10)) {
        return dispatch({ type: 'UPDATE_USER_FAILURE', payload: 'Phone number must be 10 digits' });
      }

      if (access_token && refresh_token) {

        const response = await fetch(`https://backend-flap.esainnovation.com/api/user/update/${user._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}&${refresh_token}`
          },
          body: JSON.stringify(formData)
        });
  
        const resData = await response.json();
  
        if (resData.success === false) {
          dispatch({ type: 'UPDATE_USER_FAILURE', payload: resData.message });
          return;
        }
  
        if (resData.newToken) {
          localStorage.setItem('access_token', JSON.stringify(resData.newToken));
        }
  
        dispatch({ type: 'UPDATE_USER_SUCCESS', payload: resData.restUserInfo });
        localStorage.setItem('user', JSON.stringify(resData.restUserInfo));
  
        setUpdateSuccess(true);

      } else {
        dispatch({ type: 'UPDATE_USER_FAILURE', payload: 'Forbidden' });
      }

    } catch (error) {
      dispatch({ type: 'UPDATE_USER_FAILURE', payload: error.message });
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch({ type: 'DELETE_USER_START' });

      if (access_token && refresh_token) {

        const response = await fetch(`https://backend-flap.esainnovation.com/api/user/delete/${user._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${access_token}&${refresh_token}`
          }
        });
  
        const resData = await response.json();
  
        if (resData.success === false) {
          dispatch({ type: 'DELETE_USER_FAILURE', payload: resData.message });
          return;
        }
  
        dispatch({ type: 'DELETE_USER_SUCCESS' });
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

      } else {
        dispatch({ type: 'DELETE_USER_FAILURE', payload: 'Forbidden' });
      }

    } catch (error) {
      dispatch({ type: 'DELETE_USER_FAILURE', payload: error.message });
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch({ type: 'SIGN_OUT_START' });

      const signOutData = {
        _id: user._id
      };

      const response = await fetch('https://backend-flap.esainnovation.com/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signOutData)
      });

      const resData = await response.json();

      if (resData.success === false) {
        dispatch({ type: 'SIGN_OUT_FAILURE', payload: resData.message });
        return;
      }

      dispatch({ type: 'SIGN_OUT_SUCCESS' });
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

    } catch (error) {
      dispatch({ type: 'SIGN_OUT_FAILURE', payload: error.message });
    }
  }

  return (
    <div>
      <Navbar />
      <div className="p-3 max-w-lg mx-auto shadow-lg">
        <h1 className='text-3xl font-semibold text-center mt-2 mb-4'>Edit Profile</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input onChange={(e) => setCoverPhoto(e.target.files[0])} type="file" ref={coverPhotoRef} hidden accept="image/*"  />
          <input onChange={(e) => setProfilePicture(e.target.files[0])} type="file" ref={userPhotoRef} hidden accept="image/*" />
          {/* yesma click garda call function */}
          <img onClick={() => { coverPhotoRef.current.click() }} src={formData.user_cover_photo ? formData.user_cover_photo : (user.user_cover_photo ? user.user_cover_photo : cover_photo)} alt="coverphoto" className="hover:cursor-pointer"></img>
          <span className="Change_cover text-center color text-slate-400 cursor-pointer" onClick={() => { coverPhotoRef.current.click() }}>Change cover photo</span>
          <p className="text-center text-sm">
            {coverPhotoUploadError ? (<span className="text-red-700">Error Uploading Image (must be less than 10MB)</span>) : (coverPhotoPercentage > 0 && coverPhotoPercentage < 100) ? (<span className="text-slate-700">{`Uploading ${coverPhotoPercentage}%`}</span>) : (coverPhotoPercentage === 100 && !coverPhotoUploadError) ? (<span className="text-green-700">Image Uploaded Successfully!</span>) : ""}
          </p>
          <hr />
          <img onClick={() => { userPhotoRef.current.click() }} src={formData.user_photo ? formData.user_photo : user.user_photo} alt="Profile" className="rounded-full h-24 w-24 object-cover self-center hover:cursor-pointer" />
          {/* yo click garda same function call as above */}
          <span className="Change_profile text-center color text-slate-400 cursor-pointer" onClick={() => { userPhotoRef.current.click() } }>Change your Profile picture</span> 
          <p className="text-center text-sm">
            {fileUploadError ? (<span className="text-red-700">Error Uploading Image (must be less than 10MB)</span>) : (filePercentage > 0 && filePercentage < 100) ? (<span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>) : (filePercentage === 100 && !fileUploadError) ? (<span className="text-green-700">Image Uploaded Successfully!</span>) : ""}
          </p>
          <hr />
          <input type="text" defaultValue={user.username} placeholder="username" id="username" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="text" defaultValue={user.email} placeholder="email" id="email" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="number" defaultValue={user.phone_number_1} placeholder="phone number" id="phone_number_1" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="number" defaultValue={user.phone_number_2} placeholder="phone number" id="phone_number_2" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="text" defaultValue={user.organization} placeholder="organization" id="organization" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="text" defaultValue={user.facebook_url} placeholder="facebook" id="facebook_url" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="text" defaultValue={user.instagram_url} placeholder="instagram" id="instagram_url" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="text" defaultValue={user.twitter_url} placeholder="twitter" id="twitter_url" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="text" defaultValue={user.linkedin_url} placeholder="linkedin" id="linkedin_url" className="border p-3 rounded-lg" onChange={handleChange} />
          <input type="text" defaultValue={user.youtube_url} placeholder="youtube" id="youtube_url" className="border p-3 rounded-lg" onChange={handleChange} />
          <button disabled={loading} className="bg-[#143385] text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80">{loading ? "Loading..." : "Update"}</button>
        </form>

        <div className="flex justify-between mt-5">
          {/* <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span> */}
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer mx-auto">Sign out</span>
        </div>

        {error && (<p className="text-red-700 mt-5">{error}</p>)}
        <p className="text-green-700 mt-5">{updateSuccess ? "Updated Successfully" : ""}</p>
      </div>
    </div>
  )
}
