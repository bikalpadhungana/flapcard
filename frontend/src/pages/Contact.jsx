import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../ui/Navbar";

function Contact() {
  const { id: userId } = useParams();
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const exampleUsers = [
    {
      'S.N': 1,
      user_id: 1,
      name: "Flap Card",
      contact_number: "9802365432",
      email: "card@flap.com.np",
      photo: "https://firebasestorage.googleapis.com/v0/b/flap-7766c.appspot.com/o/1729596695054bd7b082a-fdbc-471c-95d4-81a8ba7091b5.PNG?alt=media&token=f363689f-8eeb-45e4-98ce-2d5cd24d9afd"
    }
  ];

  const fetchUserInfo = async () => {
    if (!userId || userId === "example") {
      setUserInfo({ user_colour: "#1c73ba" });
      return;
    }

    try {
      const response = await fetch(`https://backend.flaap.me/api/user-info/${userId}`);
      const resData = await response.json();

      if (resData.success === false) {
        console.error("User not found");
        setUserInfo({ user_colour: "#1c73ba" });
        return;
      }

      setUserInfo(resData.user);
      const selectedUrl = resData.user.selected_url;
      if (selectedUrl !== "default_url") {
        window.location.href = resData.user[selectedUrl];
        return;
      }
    } catch (err) {
      console.error("Error fetching user info:", err.message);
      setUserInfo({ user_colour: "#1c73ba" });
    }
  };

  const fetchUsersData = async () => {
    if (!userId) {
      console.error("User ID is undefined or invalid");
      setUsersData(exampleUsers);
      setFilteredUsers(exampleUsers);
      setLoading(false);
      return;
    }

    console.log('Fetching data for User ID:', userId);
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://backend.flaap.me/api/user-info/get/exchangeContact/${userId}`;
      const contactResponse = await fetch(apiUrl);
      if (!contactResponse.ok) {
        throw new Error(`HTTP error! Status: ${contactResponse.status}`);
      }

      const contactData = await contactResponse.json();
      // Merge user_colour from userInfo into contactData
      const updatedContactData = contactData.map(user => ({
        ...user,
        user_colour: userInfo.user_colour || "#1c73ba"
      }));
      setUsersData(updatedContactData);
      setFilteredUsers(updatedContactData);
    } catch (err) {
      console.error("Error fetching users data:", err.message);
      setError(`Failed to fetch user data: ${err.message}`);
      setUsersData(exampleUsers);
      setFilteredUsers(exampleUsers);
    } finally {
      setLoading(false);
    }
  };

  const saveAsVCard = () => {
    if (selectedUser) {
      const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${selectedUser.name || 'Name not available'}
TEL:${selectedUser.contact_number || 'Contact number not available'}
EMAIL:${selectedUser.email || 'Email not available'}
END:VCARD`;

      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedUser.name || 'contact'}.vcf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserInfo();
      await fetchUsersData();
    };
    fetchData();
  }, [userId]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = usersData.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.contact_number.toLowerCase().includes(term)
    );

    setFilteredUsers(filtered.length > 0 ? filtered : exampleUsers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search contacts by name, email, or phone"
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c73ba] transition-all duration-300"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#1c73ba]"></div>
          </div>
        ) : (
          /* Contact Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user['S.N']}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={`${user.name}'s profile`}
                      className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 text-center" style={{ backgroundColor: userInfo.user_colour || '#1c73ba' }}>
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Selected User */}
        {selectedUser && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="bg-white rounded-3xl p-8 max-w-lg w-full relative transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setSelectedUser(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center">
                {selectedUser.photo ? (
                  <img
                    src={selectedUser.photo}
                    alt={`${selectedUser.name}'s profile`}
                    className="w-28 h-28 rounded-full mx-auto border-4 border-blue-100 shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-blue-100 shadow-md">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <h3 className="text-2xl font-bold mt-4 text-gray-800">{selectedUser.name || 'Name not available'}</h3>
                <div className="mt-4 space-y-3">
                  <p>
                    <a
                      href={`tel:${selectedUser.contact_number}`}
                      className="text-black-600 hover:text-[#1b73ba] flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {selectedUser.contact_number || 'Contact number not available'}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="text-black-600 hover:text-[#1b73ba] flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedUser.email || 'Email not available'}
                    </a>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={saveAsVCard}
                  className="mt-6 w-full bg-gradient-to-r text-white py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                  style={{ background: `linear-gradient(to right, ${userInfo.user_colour || '#1c73ba'}` }}
                >
                  Save Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;