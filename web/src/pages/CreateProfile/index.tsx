import axios from "axios";
import { LeafletMouseEvent } from "leaflet";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Map, Marker, TileLayer } from "react-leaflet";
import { Link, useHistory } from "react-router-dom";
import logo from "../../assets/rockme-logo.svg";
import Dropzone from "../../components/Dropzone";
import api from "../../services/api";
import "./styles.css";

import { FiArrowLeft } from "react-icons/fi";
import { FaBeer } from "react-icons/fa";

interface Mood {
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
  const [moods, setMoods] = useState<Mood[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    whatsapp: "",
    spotify_uri: "",
  });

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedGender, setSelectedGender] = useState("0");
  const [selectedOrientation, setSelectedOrientation] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedMoods, setSelectedMoods] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const maxSelectedMoods = 3;
  let blockMoods = false;

  const history = useHistory();

  const genders = [
    "Mulher cis",
    "Mulher trans",
    "Homem cis",
    "Homem trans",
    "Não binário",
  ];
  const orientations = [
    "Heterossexual",
    "Homossexual",
    "Bissexual",
    "Assexuado",
    "Pansexual",
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get("moods").then((response) => {
      setMoods(response.data);
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

  function handleSelectGender(event: ChangeEvent<HTMLSelectElement>) {
    const gender = event.target.value;

    setSelectedGender(gender);
  }

  function handleSelectOrientation(event: ChangeEvent<HTMLSelectElement>) {
    const orientation = event.target.value;

    setSelectedOrientation(orientation);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectMood(id: number) {
    const alreadySelected = selectedMoods.findIndex((mood) => mood === id);
    if (alreadySelected >= 0) {
      const filteredMoods = selectedMoods.filter((mood) => mood !== id);
      setSelectedMoods(filteredMoods);
    } else {
      blockMoods = selectedMoods.length >= maxSelectedMoods;
      if (blockMoods) {
        return;
      }
      setSelectedMoods([...selectedMoods, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, nickname, whatsapp, spotify_uri } = formData;
    const gender = selectedGender;
    const orientation = selectedOrientation;
    const city = selectedCity;
    const uf = selectedUf;
    const lat = selectedPosition[0];
    const long = selectedPosition[1];
    const moods = selectedMoods;

    const data = new FormData();

    data.append("name", name);
    data.append("nickname", nickname);
    data.append("whatsapp", whatsapp);
    data.append("gender", gender);
    data.append("orientation", orientation);
    data.append("lat", String(lat));
    data.append("long", String(long));
    data.append("city", city);
    data.append("uf", uf);
    data.append("moods", moods.join(","));
    data.append("spotify_uri", spotify_uri);

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    await api.post("profiles", data);

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
                  onChange={handleSelectGender}
                  value={selectedGender}
                  name="gender"
                  id="gender"
                >
                  <option value="0">Selecione</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>

                <br />

                <label htmlFor="orientation">Orientação</label>
                <select
                  onChange={handleSelectOrientation}
                  value={selectedOrientation}
                  name="orientation"
                  id="orientation"
                >
                  <option value="0">Selecione</option>
                  {orientations.map((orientation) => (
                    <option key={orientation} value={orientation}>
                      {orientation}
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
            <h2>Quais estilos mais definem você?</h2>
            <span>
              Selecione até 3 estilos.{" "}
              <Link to="/">Não tem o que você curte?</Link>
            </span>
          </legend>
          <ul className="items-grid">
            {moods.map((mood) => (
              <li
                className={selectedMoods.includes(mood.id) ? "selected" : ""}
                key={mood.id}
                onClick={() => handleSelectMood(mood.id)}
              >
                <img src={mood.image_url} alt="Lalalas" />
                <span>{mood.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend>
            <h2>E qual a sua música favorita de todos os tempos?</h2>
            <span>
              Cole a URI dela no Spotify{" "}
              <Link to="/">Precisa de ajuda para encontrar?</Link>
            </span>
          </legend>
          <div className="field">
            <label htmlFor="spotify_uri">Spotify URI</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="spotify_uri"
              id="spotify_uri"
            />
          </div>
        </fieldset>

        <button type="submit">Finalizar perfil</button>
      </form>
      <div className="footer">
        <p>
          feito com muita <FaBeer /> durante a{" "}
          <Link to="https://nextlevelweek.com/" target="_blank">
            next level week 1.0
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreatePoint;
