import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import bg from "../images/Leh1.jpg";
import logo from "../images/CarEth_white.png";
import { ConnectButton, Icon, Select, DatePicker, Input, Button } from "web3uikit";
import { useState } from "react";

const Home = () => {
  const [pickUpDate, setPickUpDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [location, setLocation] = useState("New York");
  const [cartype, setType] = useState("Electric");

  return (
    <>
      <div className="container" style={{ backgroundImage: `url(${bg})` }}>
        <div className="containerGradient">
        </div>
      <div className="topBanner">
      <div>
        <img className="logo" src={logo} alt="logo"></img>
      </div>
      <div className="tabs">
        <div className="selected">Available Cities</div>
        <div>Experiences</div>
        <div>Online Experiences</div>
      </div>
      <div className="lrContainers">
        <ConnectButton />
      </div>
    </div>
      <div className="tabContent">
        <div className="searchFields">
        <div className="inputs">
          Location
          <Select
              defaultOptionIndex={0}
              onChange={(data) => setLocation(data.label)}
              options={[
                {
                  id: "ny",
                  label: "New York"
                },
                {
                  id: "aus",
                  label: "Austin"
                },
                {
                  id: "nj",
                  label: "New Jersey"
                },
                {
                  id: "hyd",
                  label: "Hyderabad"
                },
              ]}
            />
        </div>
        <div className="vl" />
        <div className="inputs">
          Pickup Date
          <DatePicker
            id="pickUpDate"
            onChange={(event) => setPickUpDate(event.date)}
          />
        </div>
        <div className="vl" />
        <div className="inputs">
          Return Date
          <DatePicker
            id="returnDate"
            onChange={(event) => setReturnDate(event.date)}
          />
        </div>
        <div className="vl" />
        <div className="inputs">
          Type of Car
          <Select
              defaultOptionIndex={0}
              onChange={(data) => setType(data.label)}
              options={[
                {
                  id: "sedan",
                  label: "Sedan"
                },
                {
                  id: "SUV",
                  label: "SUV"
                },
                {
                  id: "compact",
                  label: "Compact"
                },
                {
                  id: "Electric",
                  label: "Electric"
                },
              ]}
            />
        </div>
        <Link to={"/rentals"} state={{
          location: location,
          pickUpDate: pickUpDate,
          returnDate: returnDate,
          cartype: cartype
        }}>
        <div className="searchButton">
        <Icon fill="#ffffff" size={24} svg="search" />
        </div> 
        </Link>
      </div>
    </div>
    <div className="randomLocation"> 
    <div className="title">Feel Adventurous</div>
      <div className="text">
        Let us decide and dicover new roads to drive.
      </div>
      <Button
        text="Explore the cars"
        onClick={()=> console.log(returnDate)}
        />
    </div>
    </div>
    </>
  );
};

export default Home;
