import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import "./User.css";

export default function User() {
  const { users, addUser } = useContext(PrimaryContext);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      setNewUser({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="user-form">
        <div>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            id="first_name"
            value={newUser.first_name}
            onChange={(e) =>
              setNewUser({ ...newUser, first_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            id="last_name"
            value={newUser.last_name}
            onChange={(e) =>
              setNewUser({ ...newUser, last_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            id="phone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            id="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="my-button">
          Add User
        </button>
      </form>

      <table className="my-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{`${user.first_name} ${user.last_name}`}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
