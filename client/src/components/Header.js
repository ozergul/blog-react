import React, { Component } from 'react';
import {Link} from "react-router-dom";
class Header extends Component {

    render() {
        return (
            <header>
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