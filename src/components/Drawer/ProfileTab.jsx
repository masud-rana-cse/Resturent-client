import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { AxiosInstance } from "../../AxiosInstance/AxiosInstance";

export default function ProfileTab({ user, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const startEditing = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!user?.email) {
      toast.error("User email is missing");
      return;
    }

    try {
      setIsSaving(true);
      const res = await AxiosInstance.patch("/profile", {
        email: user.email,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated");
        onUserUpdate?.(res.data.user);
        setIsEditing(false);
      } else {
        toast.error(res.data.message || "Unable to update profile");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-2 md:space-y-4 "
    >
      <div className="space-y-2 md:space-y-4 rounded-2xl bg-gray-50 md:p-5">
        {isEditing ? (
          <>
            <Field
              icon={<FaUser />}
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Field
              icon={<FaPhone />}
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Field
              icon={<FaMapMarkerAlt />}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <Info
              icon={<FaEnvelope />}
              label="Email"
              value={user?.email || "-"}
            />
          </>
        ) : (
          <>
            <Info icon={<FaUser />} label="Name" value={user?.name || "-"} />
            <Info
              icon={<FaEnvelope />}
              label="Email"
              value={user?.email || "-"}
            />
            <Info icon={<FaPhone />} label="Phone" value={user?.phone || "-"} />
            <Info
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={user?.address || "-"}
            />
          </>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-2 gap-3 overflow-y-scroll">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 font-bold text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            <FaTimes />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            <FaSave />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={startEditing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 cursor-pointer"
        >
          <FaEdit />
          Edit Profile
        </button>
      )}
    </form>
  );
}

function Field({ icon, label, name, value, onChange }) {
  return (
    <label className="flex flex-col gap-2 border-b pb-3 last:border-none">
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl border border-gray-700 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-orange-400"
      />
    </label>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-none">
      <div className="flex items-center gap-3 text-gray-400">
        {icon}
        <span>{label}</span>
      </div>

      <strong className="text-sm text-gray-700">{value}</strong>
    </div>
  );
}
