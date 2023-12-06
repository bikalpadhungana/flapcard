import { useAuthContext } from "../hooks/use.auth.context";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  
  const { loading, error, dispatch, user } = useAuthContext();
  const fileRef = useRef(null);
  
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const access_token = JSON.parse(sessionStorage.getItem('access_token'));
  const refresh_token = JSON.parse(sessionStorage.getItem('refresh_token'));

  useEffect(() => {
    if (file) {
      handleUploadFile(file);
    }
  }, [file]);

  const handleUploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            setFormData({ ...formData, user_photo: downloadUrl });
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

      if (formData.phone_number && formData.phone_number.length != 10) {
        return dispatch({ type: 'UPDATE_USER_FAILURE', payload: 'Phone number must be 10 digits' });
      }

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
        sessionStorage.setItem('access_token', JSON.stringify(resData.newToken));
      }

      dispatch({ type: 'UPDATE_USER_SUCCESS', payload: resData.restUserInfo });
      sessionStorage.setItem('user', JSON.stringify(resData.restUserInfo));

      setUpdateSuccess(true);
    } catch (error) {
      dispatch({ type: 'UPDATE_USER_FAILURE', payload: error.message });
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch({ type: 'DELETE_USER_START' });

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
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');

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
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');

    } catch (error) {
      dispatch({ type: 'SIGN_OUT_FAILURE', payload: error.message });
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center mt-2 mb-4'>Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img src={formData.user_photo ? formData.user_photo : user.user_photo} onClick={() => { fileRef.current.click() }} alt="Profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="text-center text-sm">
          {fileUploadError ? (<span className="text-red-700">Error Uploading Image (must be less than 2MB)</span>) : (filePercentage > 0 && filePercentage < 100) ? (<span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>) : (filePercentage === 100 && !fileUploadError) ? (<span className="text-green-700">Image Uploaded Successfully!</span>) : ""}
        </p>
        <input type="text" defaultValue={user.username} placeholder="username" id="username" className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="text" defaultValue={user.email} placeholder="email" id="email" className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="number" defaultValue={user.phone_number} placeholder="phone number" id="phone_number" className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="text" defaultValue={user.organization} placeholder="organization" id="organization" className="border p-3 rounded-lg" onChange={handleChange} />
        <button disabled={loading} className="bg-navbar text-black rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80">{loading ? "Loading..." : "Update"}</button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      {error && (<p className="text-red-700 mt-5">{error}</p>)}
      <p className="text-green-700 mt-5">{updateSuccess ? "Updated Successfully" : ""}</p>
    </div>
  )
}
