import React, { Component } from 'react';
import {Link} from "react-router-dom";
class SideMenu extends Component {

    render() {
        return (
            <div className="side-menu-list">
                <div className="inside">

                    <div className="side-header">
                        Admin
                        <a className="badge badge-light">BLOG</a>
                    </div>

                    <Link className="item" to="/admin">Dashboard</Link>
                    <Link className="item" to="/admin/posts">Posts</Link>
                    <Link className="item" to="/admin/terms/?type=categories">Categories</Link>
                    <Link className="item" to="/admin/terms/?type=tags">Tags</Link>
                    <Link className="item" to="/admin/comments">Comments <span className="badge badge-pill badge-success">1</span> </Link>
                    <Link className="item" to="/admin/attachments">Attachments</Link>
                    <Link className="item" to="/admin/settings">Settings</Link>
                </div>
            </div>
        )
    }
}

export default SideMenu;