import "./NewProperties.css";

import React, { useContext, useRef, useState } from "react";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { PrimaryContext } from "../context/PrimaryContext";
import EditProperties from "./EditProperties";

export default function NewProperties() {
  const { addProperties } = useContext(PrimaryContext);
  const [imageUpload, setImageUpload] = useState(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [color, setColor] = useState("#F9D5E5");
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUpload === null) return;
    const imageRef = ref(storage, `properties/${imageUpload.name}`);
    try {
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);
      const newProperty = {
        name,
        address,
        color,
        photoUrl: url,
      };

      addProperties(newProperty);
      setName("");
      setAddress("");
      setColor("#F9D5E5");
      setImageUpload(null);
      setPreviewUrl(null);
      fileInputRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table style={{ margin: "auto" }}>
          <tbody>
            <tr>
              <td>
                <label htmlFor="name">Name:</label>
              </td>
              <td>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="address">Address:</label>
              </td>
              <td>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  cols={5}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="photoUrl">Photo:</label>
              </td>
              <td>
                <input
                  type="file"
                  id="photoUrl"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="color">Color:</label>
              </td>
              <td>
                <input
                  type="color"
                  id="color"
                  value={`${color}`}
                  onChange={(e) => setColor(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit">Create Property</button>
              </td>
            </tr>
            {previewUrl && (
              <tr>
                <td colSpan="2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </form>
      <EditProperties />
    </div>
  );
}
