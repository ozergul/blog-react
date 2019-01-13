import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

class Header extends Component {

    render() {
        return (
            <header>

                <Helmet>
                <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="@ozergul1" />
                    <meta name="twitter:title" content="Özer Gül" />
                    <meta name="twitter:description" content="Yet another front-end developer, Istanbul." />
                    <meta name="twitter:creator" content="@ozergul1" />

                    <meta itemprop="name" content="Özer Gül" />
                    <meta itemprop="description" content="Yet another front-end developer, Istanbul." />
                </Helmet>

                <div className="centered">
                    <div className="logo">
                        <Link to="/">özer</Link>
                    </div>
                    <ul>
                        <li>
                            <Link to="/">me</Link>
                        </li>
                        <li>
                            <Link to="/admin">admin</Link>
                        </li>
                        <li>
                            <a href="https://github.com/ozergul" target="_blank" rel="noopener noreferrer">github</a>
                        </li>
                        <li>
                            <a href="https://twitter.com/ozergul1" target="_blank" rel="noopener noreferrer">twitter</a>
                        </li>
                    </ul>
                </div>
            </header>
        )
    }

}

export default Header;