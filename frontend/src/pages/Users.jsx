import { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch('https://backend.flaap.me/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await response.json();
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAllUsers();
  }, []);

  // Handle user search
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle user selection
  const handleSelectUser = async (userId) => {
    try {
      const response = await fetch(`https://backend.flaap.me/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setSelectedUser(data.user);
      setEditData(data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Handle field update
  const handleUpdateField = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`https://backend.flaap.me/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user._id === selectedUser._id ? {...user, ...editData} : user
        ));
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-panel">
      <h1>User Management</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="user-list">
        {filteredUsers.map(user => (
          <div key={user._id} className="user-card" onClick={() => handleSelectUser(user._id)}>
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <p>User ID: {user._id}</p>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="user-edit-modal">
          <h2>Edit User: {selectedUser.username}</h2>
          
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={editData.username || ''}
              onChange={(e) => handleUpdateField('username', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={editData.email || ''}
              onChange={(e) => handleUpdateField('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone Numbers:</label>
            <input
              type="text"
              value={editData.phone_number_1 || ''}
              onChange={(e) => handleUpdateField('phone_number_1', e.target.value)}
            />
            <input
              type="text"
              value={editData.phone_number_2 || ''}
              onChange={(e) => handleUpdateField('phone_number_2', e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => setSelectedUser(null)}>Cancel</button>
            <button onClick={() => downloadVCard(selectedUser)}>
              Download vCard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;