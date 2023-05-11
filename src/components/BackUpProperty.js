import React, { useContext, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { PrimaryContext } from "../context/PrimaryContext";

export default function Property() {
  const { properties, facilities } = useContext(PrimaryContext);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const propertyStyle = (color) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: color,
    cursor: "pointer",
  });

  const imageStyle = {
    height: "300px",
    width: "100%",
    objectFit: "cover",
    marginBottom: "0px",
  };

  const facilityStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const facilityImageStyle = {
    height: "200px",
    width: "100%",
    objectFit: "cover",
    marginBottom: "0px",
  };

  const facilityNameStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    margin: "5px 0",
  };

  const facilityBookingLimitStyle = {
    fontSize: "14px",
    fontWeight: "normal",
    margin: "0",
  };

  const handlePropertyClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId
  );

  const filteredFacilities =
    selectedPropertyId !== null
      ? facilities.filter(
          (facility) => facility.property_id === selectedPropertyId
        )
      : [];

  return (
    <>
      <Slider {...settings}>
        {properties.map((property) => (
          <div
            key={property.id}
            style={propertyStyle(property.color)}
            onClick={() => handlePropertyClick(property.id)}
          >
            <img
              src={property.photoUrl}
              alt={property.name}
              style={imageStyle}
            />
            <h3 style={{ ...textStyle(property.color), fontWeight: "bold" }}>
              {property.name}
            </h3>
            <p style={{ ...textStyle(property.color), fontWeight: "normal" }}>
              {property.address}
            </p>
          </div>
        ))}
      </Slider>

      {selectedPropertyId !== null && (
        <Slider {...settings}>
          {filteredFacilities.map((facility) => (
            <div key={facility.id} style={facilityStyle}>
              <img
                src={facility.photoUrl}
                alt={facility.name}
                style={facilityImageStyle}
              />
              <h3 style={facilityNameStyle}>{facility.name}</h3>
              <p style={facilityBookingLimitStyle}>
                Booking Limit: {facility.booking_limit}
              </p>
            </div>
          ))}
        </Slider>
      )}
    </>
  );

  function textStyle(color) {
    return {
      fontSize: "14px",
      fontWeight: "normal",
      margin: "0",
      backgroundColor: color,
      padding: "5px",
    };
  }
}
