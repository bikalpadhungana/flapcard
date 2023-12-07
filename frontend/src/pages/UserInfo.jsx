import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserInfo() {
    const { id } = useParams();

    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {

        const fetchData = async () => {
            const response = await fetch(`https://backend-flap.esainnovation.com/api/user-info/${id}`);

            const resData = await response.json();

            setUserInfo(resData);
        };

        fetchData();
        
    }, [id]);
  
  const downloadVCard = (data) => {
    const element = document.createElement('a');
    const file = new Blob([data], { type: 'text/plain; charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${userInfo.username}.vcf`;
    document.body.appendChild(element);
    element.click();
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
    console.log(resData);
  }

  return (
      <div className="p-8 max-w-lg mx-auto border-2 border-navbar my-5 rounded-lg">
          <div className="flex flex-col gap-4">
            <img src={userInfo.user_photo} alt="Profile" className="rounded-full h-24 w-24 object-cover self-center mt-2" />
            <label className="text-sm px-2">Username</label>
              <input type="text" id="username" defaultValue={userInfo.username} className="border p-3 rounded-lg border-slate-300" readOnly />
            <label className="text-sm px-2">Email</label>
              <input type="text" defaultValue={userInfo.email} className="border p-3 rounded-lg border-slate-300" readOnly />
            <label className="text-sm px-2">Phone Number</label>
              <input type="number" defaultValue={userInfo.phone_number} className="border p-3 rounded-lg border-slate-300" readOnly />
             <label className="text-sm px-2">Organization</label> 
            <input type="text" defaultValue={userInfo.organization} className="border p-3 rounded-lg border-slate-300" readOnly />
            
            <button onClick={handleCreateVCard} className="mt-8 p-3 border-2 rounded-2xl bg-navbar font-medium text-lg">Save Contact</button>
        </div>
    </div>
  )
}
