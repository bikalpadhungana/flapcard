import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserInfo() {
    const { id } = useParams();

    const [userInfo, setUserInfo] = useState("");

    useEffect(() => {

        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/api/user-info/${id}`);

            const resData = await response.json();

            setUserInfo(JSON.stringify(resData));
        };

        fetchData();
        
    }, [id]);
  return (
    <div>{userInfo}</div>
  )
}
