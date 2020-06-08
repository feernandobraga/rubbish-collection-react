import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";

import "./styles.css";
import logo from "../../assets/logo.svg";

const CreatePoint = () => {
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
              <select name="state" id="uf">
                <option value="0">Select a state</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <select name="city" id="city">
                <option value="0">Select a city</option>
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
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="test" />
              <span>Cooking Oil</span>
            </li>

            <li className="selected">
              <img src="http://localhost:3333/uploads/oleo.svg" alt="test" />
              <span>Cooking Oil</span>
            </li>

            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="test" />
              <span>Cooking Oil</span>
            </li>

            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="test" />
              <span>Cooking Oil</span>
            </li>

            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="test" />
              <span>Cooking Oil</span>
            </li>

            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="test" />
              <span>Cooking Oil</span>
            </li>
          </ul>
        </fieldset>
        <button type="submit">Create collection point</button>
      </form>
    </div>
  );
};

export default CreatePoint;
