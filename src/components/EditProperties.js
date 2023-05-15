import "./EditProperties.css";

import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function EditProperties() {
  const { properties, updateProperties } = useContext(PrimaryContext);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editColor, setEditColor] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    console.log(imageUpload);
  }, [imageUpload]);
  const handleEditClick = (property) => {
    // console.log(property);
    setEditName("");
    setEditAddress("");
    setEditColor("");
    setPreviewPhoto("");
    setEditing(property.id);
  };

  const handleCancelClick = () => {
    setEditName("");
    setEditAddress("");
    setEditColor("");
    setPreviewPhoto("");
    setEditing(null);
  };

  const handleSaveClick = async (id) => {
    if (imageUpload !== null) {
      const imageRef = ref(storage, `properties/${imageUpload.name}`);
      try {
        await uploadBytes(imageRef, imageUpload);
        const url = await getDownloadURL(imageRef);
        const updateProperty = {
          name: editName,
          address: editAddress,
          color: editColor,
          photoUrl: url,
        };

        updateProperties(id, updateProperty);
        setEditing(null);
      } catch (error) {
        console.log(error);
      }
    } else {
      const updateProperty = {
        name: editName,
        address: editAddress,
        color: editColor,
        photoUrl: "",
      };

      updateProperties(id, updateProperty);
      setEditing(null);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUpload(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewPhoto(previewUrl);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Filter by name or address"
      />
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Photo</th>
            <th>Color</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties
            .filter(
              (property) =>
                property.name.toLowerCase().includes(filter.toLowerCase()) ||
                property.address.toLowerCase().includes(filter.toLowerCase())
            )
            .map((property) => (
              <tr key={property.id}>
                <td>
                  {editing === property.id ? (
                    <input
                      type="text"
                      value={editName}
                      placeholder={property.name}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    property.name
                  )}
                </td>
                <td>
                  {editing === property.id ? (
                    <input
                      type="text"
                      value={editAddress}
                      placeholder={property.address}
                      onChange={(e) => setEditAddress(e.target.value)}
                    />
                  ) : (
                    property.address
                  )}
                </td>
                <td>
                  {editing === property.id ? (
                    <>
                      <input type="file" onChange={handlePhotoChange} />
                      {previewPhoto && (
                        <img
                          src={previewPhoto}
                          alt="Preview"
                          style={{ width: "100px", maxHeight: "80px" }}
                        />
                      )}
                    </>
                  ) : (
                    <img
                      src={property.photoUrl}
                      alt="Property"
                      style={{ width: "100px", maxHeight: "80px" }}
                    />
                  )}
                </td>

                <td>
                  {editing === property.id ? (
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: property.color,
                      }}
                    ></div>
                  )}
                </td>
                <td>
                  {editing === property.id ? (
                    <>
                      <button onClick={handleCancelClick}>Cancel</button>
                      <button
                        onClick={() => {
                          handleSaveClick(property.id);
                        }}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleEditClick(property)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
