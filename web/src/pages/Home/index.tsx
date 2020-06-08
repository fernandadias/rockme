import React from "react";
import { Link } from "react-router-dom";
import { FaBeer } from "react-icons/fa";

import "./styles.css";
import logo from "../../assets/rockme-logo.svg";
import avatars from "../../assets/ilustra-home.png";

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <main>
          <header>
            <img src={logo} alt="Rock.Me" />
          </header>
          <h1>Let’s rock, baby.</h1>
          <p>O amor da sua vida pode estar a uma música de distância.</p>

          <Link to="/create-profile">
            <strong>Criar perfil</strong>
          </Link>
        </main>
        <div className="avatars">
          <img src={avatars} alt="Rock.Me avatars" />
        </div>
      </div>
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

export default Home;
