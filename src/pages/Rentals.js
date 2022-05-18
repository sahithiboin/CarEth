import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import logo from "../images/CarEth_black.png";
import { ConnectButton, Icon, Button, useNotification } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import User from "../components/User";

const Rentals = () => {
  const { state: searchFilters } = useLocation();
  const [highLight, setHighLight] = useState();
  const { Moralis, account } = useMoralis();
  const [rentalsList, setRentalsList] = useState();
  const [coOrdinates, setCoOrdinates] = useState([]);
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const handleSuccess= () => {
    dispatch({
      type: "success",
      message: `Nice! You can pick up the car from ${searchFilters.location}!!`,
      title: "Booking Succesful",
      position: "topl",
    });
  };

  const handleError= (msg) => {
    dispatch({
      type: "error",
      message: `${msg}`,
      title: "Booking failed",
      position: "topl",
    });
  };

  const handleNoAccount= () => {
    dispatch({
      type: "error",
      message: `You need to connect to your wallet to book a car rental`,
      title: "Not Connected",
      position: "topL",
    });
  };

  useEffect(() => {
    async function fetchRentalsList() {
      const Rentals = Moralis.Object.extend("Rentals");
      const query = new Moralis.Query(Rentals);
      query.equalTo("city", searchFilters.location);
      query.equalTo("cartype", searchFilters.cartype);
    
      const result = await query.find();

      let cords = [];
      result.forEach((e) => {
        cords.push({ lat: e.attributes.lat, lng: e.attributes.long });
      });

      setCoOrdinates(cords);

      setRentalsList(result);


    }
    fetchRentalsList();

  }, [searchFilters]);

  
  const bookRental = async function(start, end, id, dayPrice) {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
        arr.push(new Date(dt).toISOString().slice(0, 10));
      }

      let options = {
        contractAddress: "0x0712BFcf499cB258217bed8AE1D378695e0d6F37",
        functionName: "addDatesBooked",
        abi: [
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "string[]",
                "name": "newBookings",
                "type": "string[]"
              }
            ],
            "name": "addDatesBooked",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          }
        ],
        params: {
          id: id,
          newBookings: arr,
        },
        msgValue: Moralis.Units.ETH(dayPrice * 0.01 * arr.length),
      }
      console.log(arr);

      await contractProcessor.fetch({
        params: options,
        onSuccess: () => {
          handleSuccess();
        },
        onError: (error) => {
          handleError(error.data.message)
        }
      });
  }

  return (
    <>
     <div className="topBanner">
       <div>
         <Link to="/">
           <img className="logo" src={logo} alt="logo"></img>
         </Link>
        </div>
        <div className="searchReminder">
          <div className="filter">{searchFilters.location}</div>
          <div className="vl" />
          <div className="filter">
          {`
           ${searchFilters.pickUpDate.toLocaleString("default", {
             month: "short",
           })} 
           ${searchFilters.pickUpDate.toLocaleString("default", {
             day: "2-digit",
           })} 
           - 
           ${searchFilters.returnDate.toLocaleString("default", {
             month: "short",
           })} 
           ${searchFilters.returnDate.toLocaleString("default", {
             day: "2-digit",
           })}
          `}
          </div>
          <div className="vl" />
          <div className="filter">{searchFilters.cartype} Car Type</div>
          <div className="searchFiltersIcon">
            <Icon fill="#ffffff" size={20} svg="search" />
          </div>
        </div>
        <div className="lrContainers">
          {account && 
          <User account = {account} />
          }
         <ConnectButton />
        </div>
     </div>

     <hr className="line" />
     <div className="rentalsContent">
       <div className="rentalsContentL">
         Available For Your Location
         {rentalsList &&
         rentalsList.map((e, i) => {
          var x = e.attributes.pricePerday;
          var y = x/100;
           return (
             <>
                <hr className="line2" />
                <div className={highLight == i ? "rentalDivH" : "rentalDiv"}>
                  <img className="rentalImg" src={e.attributes.imgUrl}></img>
                  <div className="rentalInfo">
                    <div className="rentalTitle">{e.attributes.name}</div>
                    <div className="rentalDesc">
                      {e.attributes.unoDescription}
                    </div>
                    <div className="rentalDesc">
                      {e.attributes.dosDescription}
                    </div>
                    <div className="bottomButton">
                      <Button
                      onClick={() => {
                        if(account){
                        bookRental(
                          searchFilters.pickUpDate,
                          searchFilters.returnDate,
                          e.attributes.uid_decimal.value.$numberDecimal,
                          Number(e.attributes.pricePerday_decimal.value.$numberDecimal)
                        )}else{ 
                            handleNoAccount()
                        }
                      }
                      }
                      text="Pickup This Car"/>
                      <div className="price">
                        <Icon fill="#808080" size={10} svg="eth" />{" "} 
                        {y} / Day
                      </div>
                    </div>
                  </div>
                </div>
             </>
           );
          })}
       </div>
       <div className="rentalsContentR">
         <RentalsMap locations={coOrdinates} setHighLight={setHighLight} />
       </div>
     </div>
    </>
  );
};

export default Rentals;