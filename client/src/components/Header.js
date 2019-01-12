import React, { Component } from 'react';
import {Link} from "react-router-dom";
class Header extends Component {

    render() {
        return (
            <header>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/admin">admin</Link>
                    </li>
                    <li>
                        <Link to="/login">login</Link>
                    </li>
                </ul>
            </header>
        )
    }

}

export default Header;