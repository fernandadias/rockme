import axios from "axios";
import { LeafletMouseEvent } from "leaflet";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { Link, useHistory } from "react-router-dom";
import logo from "../../assets/rockme-logo.svg";
import Dropzone from "../../components/Dropzone";
import api from "../../services/api";
import "./styles.css";
import { FaBeer, FaHeart } from "react-icons/fa";

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
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

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

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const lat = selectedPosition[0];
    const long = selectedPosition[1];
    const items = selectedItems;

    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("lat", String(lat));
    data.append("long", String(long));
    data.append("uf", uf);
    data.append("items", items.join(","));

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    await api.post("points", data);

    history.push("/");
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Perfil</h1>
        <h2>Oi, como quer se apresentar?</h2>

        <div className="field-group">
          <fieldset>
            <div className="field-group">
              <div className="field">
                <Dropzone onFileUploaded={setSelectedFile} />
              </div>
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input
                  onChange={handleInputChange}
                  type="text"
                  name="name"
                  id="name"
                />

                <br />

                <label htmlFor="nickname">Apelido</label>
                <input
                  onChange={handleInputChange}
                  type="text"
                  name="nickname"
                  id="nickname"
                />

                <br />

                <label htmlFor="whatsapp">Whats</label>
                <input
                  onChange={handleInputChange}
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                />

                <br />

                <label htmlFor="gender">Identidade de gênero</label>
                <select
                  onChange={handleSelectCity}
                  value={selectedCity}
                  name="gender"
                  id="gender"
                >
                  <option value="0">Selecione</option>
                  {cities.map((city) => (
                    <option key={city} value="{city}">
                      {city}
                    </option>
                  ))}
                </select>

                <br />

                <label htmlFor="orientation">Orientação</label>
                <select
                  onChange={handleSelectCity}
                  value={selectedCity}
                  name="orientation"
                  id="orientation"
                >
                  <option value="0">Selecione</option>
                  {cities.map((city) => (
                    <option key={city} value="{city}">
                      {city}
                    </option>
                  ))}
                </select>

                <br />
              </div>
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend>
            <h2>E onde é melhor para te encontrar?</h2>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (uf)</label>
              <select
                value={selectedUf}
                onChange={handleSelectUf}
                name="uf"
                id="uf"
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="uf">Estado (uf)</label>
              <select
                onChange={handleSelectCity}
                value={selectedCity}
                name="city"
                id="city"
              >
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city} value="{city}">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Quais estilos mais definem você?</h2>
            <span>
              Selecione até 3 estilos.{" "}
              <Link to="/">Não tem o que você curte?</Link>
            </span>
          </legend>
          <ul className="items-grid">
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li
              className="selected"
              key="1"
              onClick={() => handleSelectItem(1)}
            >
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>
            <li className="" key="1" onClick={() => handleSelectItem(1)}>
              <img
                src="http://192.168.1.12:3333/uploads/80s.svg"
                alt="Lalalas"
              />
              <span>rock</span>
            </li>

            {items.map((item) => (
              <li
                className={selectedItems.includes(item.id) ? "selected" : ""}
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
              >
                <img src={item.image_url} alt="Lalalas" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Finalizar perfil</button>
      </form>
      <div className="footer">
        <p>
          feito pela{" "}
          <Link to="https://github.com/fernandadias/" target="_blank">
            nanda
          </Link>{" "}
          com muita <FaBeer /> e <FaHeart /> durante a{" "}
          <Link to="https://nextlevelweek.com/" target="_blank">
            next level week 1.0
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreatePoint;
