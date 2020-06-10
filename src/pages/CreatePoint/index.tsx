import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import axios from "axios";
import { LeafletMouseEvent } from "leaflet";

import "./styles.css";
import logo from "../../assets/logo.svg";

/* 
    Every time we create an state for an array or object, we need to define the type of it through interface
*/
interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  /*  USING STATES TO STORE/HANDLE DATA WITHIN THE COMPONENT
      the state is a deconstructed function that takes two parameters:
      1. the name of the variable that will store the data we want (items)
      2. the function that we use to change the the value of the state (setItem)
  */
  const [items, setItem] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // useEffect is a function that takes two params: A function to execute and the value that will trigger this function whenever
  // the value change. If we leave the value empty [], the function will only execute once (when the component loads).
  useEffect(() => {
    api.get("items").then((response) => {
      setItem(response.data); //setItem is used to change the state of items
    });
  }, []);

  //useEffect for retrieving the UFs from the API and updating the state ufs
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"
      )
      .then((response) => {
        const ufInititals = response.data.map((uf) => uf.sigla);
        setUfs(ufInititals);
      });
  }, []);

  // in this case, we want this to be called every time the user select a state so in the second argument I have passed
  // selectedUf. Hence, every time the value of selectedUf changes, the function will be executed (axios.get)
  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  // function called when the page loads (and only once) that will get the user current position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
      console.log(latitude, longitude);
    });
  }, []);

  // this function is called when the user selects a new UF. It then stores the value in a variable called uf and after that
  // I set the SelectedUf state through the setSelectedUf() method. Since the useEffect is monitoring that variable, it then triggers
  // a new API call
  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  // function called from the <Map /> that gets the user click and updates the state/value of SelectedPosition
  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  // function called every time the user type something in the input fields
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  // function called when the user clicks in a <li> with the items related to the waste type
  function handleSelectItem(id: number) {
    // findIndex returns -1 if it doesn't find the item in the array or any value >= 0 if it does find it
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      // if the value is >= 0, it means that the item was found in the array, so it means the user has already selected the item
      // and now he/she wants to remove it. To remove, we use the .filter() function
      // filtered items will have EVERYTHING already in the selectedItems apart from the filtered id
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const state = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      state,
      city,
      latitude,
      longitude,
      items,
    };

    await api.post("points", data);

    alert("foi");
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="ECO-llection" />
        <Link to="/">
          <FiArrowLeft />
          Back
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Register <br /> Collection Point
        </h1>

        <fieldset>
          <legend>
            <h2>Info</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Company name</label>
            <input type="text" name="name" id="name" onChange={handleInputChange} />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={handleInputChange} />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Click on the map to select the address</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition}></Marker>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">State</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                <option value="0">Select a state</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Waste Types</h2>
            <span>Select one or more waste types</span>
          </legend>

          <ul className="items-grid">
            {/* 
                Here I'm using the function map that will loop through the array items and for each item it will return
                the <li> element. The variable items is where I store my state coming from the API
            */}
            {items.map((item) => (
              // This is tricky. To get the itemId to be passed to the handleSelectItem, we need first to call
              // an arrow function
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Create collection point</button>
      </form>
    </div>
  );
};

export default CreatePoint;
