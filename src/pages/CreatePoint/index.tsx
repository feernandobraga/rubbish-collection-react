import React, { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import axios from "axios";

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

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
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

      <form>
        <h1>
          Register <br /> Collection Point
        </h1>

        <fieldset>
          <legend>
            <h2>Info</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Company name</label>
            <input type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Click on the map to select the address</span>
          </legend>

          <Map center={[-37.7443007, 145.0155988]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-37.7443007, 145.0155988]}></Marker>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">State</label>
              <select name="state" id="uf" value={selectedUf} onChange={handleSelectUf}>
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
              <select name="city" id="city">
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
              <li key={item.id}>
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
