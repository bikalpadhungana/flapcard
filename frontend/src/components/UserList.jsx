import { useEffect, useState } from 'react';
import { FiAlertCircle, FiRefreshCw, FiUser } from 'react-icons/fi';
import axios from 'axios';

const UserList = ({ currentUserId, onUserSelect, searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(
          `${apiUrl}/api/user-info/${encodeURIComponent(searchTerm)}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.data.success === false) {
          setUsers([]);
          return;
        }

        setUsers([response.data.user] || []);
        setHasMore(false);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentConversations = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${apiUrl}/api/message?page=${page}`, {
          headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const enrichedUsers = Array.isArray(response.data.users) ? response.data.users : [];
        setUsers(prev => page === 1 ? enrichedUsers : [...prev, ...enrichedUsers]);
        setHasMore(response.data.pagination?.hasMore || false);
      } catch (err) {
        setError('Failed to load recent conversations');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchTerm.length > 0) {
        fetchUsers();
      } else {
        fetchRecentConversations();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, page, currentUserId, accessToken]);

  const handleRetry = () => {
    setError('');
    setPage(1);
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  console.log('Users state:', users);

  return (
    <div className="user-list" onScroll={handleScroll}>
      {error && (
        <div className="error-banner">
          <FiAlertCircle />
          <span>{error}</span>
          <button onClick={handleRetry} className="retry-button">
            <FiRefreshCw />
          </button>
        </div>
      )}
      
      {loading && page === 1 ? (
        <div className="skeleton-loader">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      ) : !users || users.length === 0 ? (
        <div className="no-results">
          <FiUser />
          <p>No {searchTerm ? 'matching' : 'recent'} users found</p>
        </div>
      ) : (
        users
          .filter(user => user.unique_id !== currentUserId)
          .map((user) => (
            <button 
              key={user.unique_id} 
              className="user-card"
              onClick={() => onUserSelect(user)}
              aria-label={`Chat with ${user.username}`}
            >
              <div className="avatar-container">
                <img
                  src={user.user_photo || '/default-avatar.jpg'}
                  alt={user.username}
                  className="user-avatar"
                  onError={(e) => { e.target.src = '/default-avatar.jpg'; }}
                />
                {user.status === 'online' && <span className="online-badge"></span>}
              </div>
              <div className="user-info">
                <h4>{user.username}</h4>
                <p className="user-id">ID: {user.unique_id}</p>
                <div className="status-text">{user.status || 'offline'}</div>
              </div>
            </button>
          ))
      )}

      {loading && page > 1 && searchTerm.length === 0 && (
        <div className="loading-more">Loading more users...</div>
      )}
    </div>
  );
};

export default UserList;