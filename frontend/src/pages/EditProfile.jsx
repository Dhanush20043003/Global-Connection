import React, { useEffect, useState } from "react";
import api from "../api";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    about: "",
    skills: "",
    status: "",
    username: "", // Optional field for future use
  });

  const [profileId, setProfileId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const storedId = localStorage.getItem("profileId");
        console.log("Fetching profile for ID:", storedId);
        if (!storedId) throw new Error("Missing profile ID in localStorage");

        const { data } = await api.get(`/api/users/profile/${storedId}`);
        const profile = data.profile;

        if (!profile) throw new Error("No profile returned");

        setForm({
          name: profile.name || "",
          about: profile.about || "",
          skills: (profile.skills || []).join(", "),
          status: profile.userStatus || "",
          username: profile.Username || "", // Optional fallback
        });

        setProfileId(profile._id);
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message || err);
        alert("Failed to load profile. Please create one.");
        navigate("/onboarding");
      }
    })();
  }, []);

  const save = async () => {
  try {
    // 🔐 Normalize skills input
    const skillsArray = Array.isArray(form.skills)
      ? form.skills
      : form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    console.log("Final skills array:", skillsArray);

    const skillsPayload = { skills: skillsArray };
    const statusPayload = { newStatus: form.status };
    const usernamePayload = {
      Username: form.username?.trim() || `user_${Date.now()}`,
    };

    await Promise.all([
      api.post(`/api/users/profile/updateSkills/${profileId}`, skillsPayload),
      api.post(`/api/users/profile/update/status/${profileId}`, statusPayload),
      api.post(`/api/users/profile/updateUsername/${profileId}`, usernamePayload),
    ]);

    window.location.href = "/profile";
  } catch (err) {
    console.error("Save error:", err.response?.data || err.message || err);
    alert("Update failed");
  }
};

  return (
    <div>
      <h2>Edit Profile</h2>

      <Input placeholder="Name" 
      value={form.name} 
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea placeholder="About" 
      value={form.about}
      onChange={(e) => setForm({ ...form, about: e.target.value })}
       />

      <Input
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={(e) => setForm({ ...form, skills: e.target.value })}
      />

      <Input
        placeholder="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      />

      {/* Optional Username field */}
      <Input
        placeholder="Username (optional)"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <Button onClick={save}>Save</Button>
    </div>
  );
}
