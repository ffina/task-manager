import { useState, useRef, useEffect } from "react";
import { User, Mail, Lock, Camera, Save, X } from "lucide-react";
import { userService } from "../../services/user.service";
import { useToast } from "../../hooks/useToast";
import Toast from "../common/Toast";

export default function ProfileView({ onProfileUpdate }) {
  const { toasts, removeToast, success, error: showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      if (data.avatarPath) {
        setPreviewImage(
          `http://localhost:3001/${data.avatarPath.replace(/\\/g, "/")}`
        );
      }
    } catch (err) {
      showError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords if changing
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        showError("Please enter your current password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        showError("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 8) {
        showError("Password must be at least 8 characters");
        return;
      }
    }

    try {
      setSaving(true);
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const updatedProfile = await userService.updateProfile(
        updateData,
        avatarFile
      );

      setProfile(updatedProfile);
      success("Profile updated successfully!");

      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setAvatarFile(null);

      // Update preview with new avatar
      if (updatedProfile.avatarPath) {
        setPreviewImage(
          `http://localhost:3001/${updatedProfile.avatarPath.replace(
            /\\/g,
            "/"
          )}`
        );
      }

      // Notify parent to refresh user profile in header
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const removeAvatar = () => {
    setPreviewImage(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-blue-100 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Avatar Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {profile?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-600 mb-2">
                  Upload a new profile picture. Max size: 5MB
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF
                </p>
                {previewImage && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Remove Picture
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="my-8" />

          {/* Basic Information */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profile?.username || ""}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <hr className="my-8" />

          {/* Change Password */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h2>
            <p className="text-sm text-gray-600">
              Leave password fields empty if you don't want to change your
              password
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="New password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}
