import { useAuthContext } from "../hooks/use.auth.context";
import { useEffect, useState } from "react";
import Navbar from "../ui/Navbar";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function Profile() {
  const { loading, error, dispatch, user } = useAuthContext();
  const [profiles, setProfiles] = useState([
    { id: '1', business_name: 'Business 1', description: 'Description 1', contact_email: 'contact1@example.com', products: [], linkedCard: null, facebook_url: '', instagram_url: '' },
    { id: '2', business_name: 'Business 2', description: 'Description 2', contact_email: 'contact2@example.com', products: [], linkedCard: null, facebook_url: '', instagram_url: '' },
  ]);
  const [selectedProfileId, setSelectedProfileId] = useState('1');
  const [formData, setFormData] = useState(profiles.find(p => p.id === selectedProfileId));
  const [availableCards] = useState(['Card 1', 'Card 2', 'Card 3']);
  const [activeTab, setActiveTab] = useState("general");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const access_token = JSON.parse(localStorage.getItem('access_token'));

  // Simulated analytics data (replace with real data from backend)
  const [analyticsData, setAnalyticsData] = useState({
    general: {
      views: [10, 20, 15, 25, 30, 35],
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    },
    products: [
      { name: 'Product A', views: 100 },
      { name: 'Product B', views: 150 },
    ],
    links: {
      facebook: 50,
      instagram: 75,
    },
  });

  useEffect(() => {
    const selectedProfile = profiles.find(p => p.id === selectedProfileId);
    setFormData(selectedProfile);
    // Fetch or update analytics data based on selectedProfileId
  }, [selectedProfileId, profiles]);

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { id: Date.now().toString(), name: '', description: '', price: '', image: '', link: '' }]
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  const createNewProfile = () => {
    const newProfile = {
      id: Date.now().toString(),
      business_name: '',
      description: '',
      contact_email: '',
      products: [],
      linkedCard: null,
      facebook_url: '',
      instagram_url: ''
    };
    setProfiles([...profiles, newProfile]);
    setSelectedProfileId(newProfile.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!access_token) {
        console.error("Missing access token");
        return dispatch({ type: "UPDATE_USER_FAILURE", payload: "Missing Authorization Token" });
      }

      const response = await fetch(`https://backend.flaap.me/api/business-profile/update/${selectedProfileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(formData),
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

      setProfiles(profiles.map(p => p.id === selectedProfileId ? formData : p));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      dispatch({ type: "UPDATE_USER_FAILURE", payload: error.message });
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "products", label: "Products" },
    { id: "links", label: "Links" },
  ];

  // Chart data for General section
  const generalChartData = {
    labels: analyticsData.general.labels,
    datasets: [
      {
        label: 'Profile Views',
        data: analyticsData.general.views,
        backgroundColor: user.user_colour || '#1c73ba',
      }
    ]
  };

  // Chart data for Links section
  const linksChartData = {
    labels: ['Facebook', 'Instagram'],
    datasets: [
      {
        label: 'Link Clicks',
        data: [analyticsData.links.facebook, analyticsData.links.instagram],
        backgroundColor: user.user_colour || '#1c73ba',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Analytics' }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Profile</label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>{profile.business_name || 'New Profile'}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={createNewProfile}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create New Profile
              </button>
            </div>
          </div>

          {/* Main Form */}
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Tabs */}
              <div className="border-b border-gray-200">
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
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Form Content */}
              <div className="mt-6">
                {activeTab === "general" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.business_name}
                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                        placeholder="Business Name"
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="Contact Email"
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description"
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={formData.linkedCard || ''}
                        onChange={(e) => setFormData({ ...formData, linkedCard: e.target.value })}
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                      >
                        <option value="">Select a card</option>
                        {availableCards.map(card => (
                          <option key={card} value={card}>{card}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "products" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Products</h3>
                    {formData.products.map((product, index) => (
                      <div key={product.id} className="mt-4 p-4 border rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Product ID</label>
                            <input
                              type="text"
                              value={product.id}
                              disabled
                              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => updateProduct(index, 'name', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                              type="text"
                              value={product.description}
                              onChange={(e) => updateProduct(index, 'description', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                              type="text"
                              value={product.price}
                              onChange={(e) => updateProduct(index, 'price', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                              type="text"
                              value={product.image}
                              onChange={(e) => updateProduct(index, 'image', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Link</label>
                            <input
                              type="text"
                              value={product.link}
                              onChange={(e) => updateProduct(index, 'link', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addProduct}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Add Product
                    </button>
                  </div>
                )}

                {activeTab === "links" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.facebook_url}
                        onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                        placeholder="Facebook"
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.instagram_url}
                        onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                        placeholder="Instagram"
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[${user.user_colour || '#1c73ba'}] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all text-base"
                style={{
                  backgroundColor: user.user_colour || "#1c73ba",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Loading..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General Analytics */}
            <div>
              <h3 className="text-lg font-medium mb-2">General</h3>
              {analyticsData.general.views.length > 0 ? (
                <Bar data={generalChartData} options={chartOptions} />
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
            {/* Products Analytics */}
            <div>
              <h3 className="text-lg font-medium mb-2">Products</h3>
              {analyticsData.products.length > 0 ? (
                <ul className="space-y-2">
                  {analyticsData.products.map((product, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{product.name}</span>
                      <span>{product.views} views</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
            {/* Links Analytics */}
            <div>
              <h3 className="text-lg font-medium mb-2">Links</h3>
              {analyticsData.links.facebook || analyticsData.links.instagram ? (
                <Bar data={linksChartData} options={chartOptions} />
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in text-sm">
          {error}
        </div>
      )}
      {updateSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in text-sm">
          Profile Updated Successfully!
        </div>
      )}
    </div>
  );
}