import React, { Component } from "react";
import SideMenu from "./SideMenu";
import { ToastContainer} from "react-toastify";
import { Helmet } from "react-helmet";
import "../../assets/admin.scss";

class AdminLayout extends Component {

    render() {
        return (
            <div className="admin">

                <Helmet>
                    <title>Admin | Dashboard</title>
                    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
                </Helmet>

                <ToastContainer />
                <div className="admin-row">
                    <div className="admin-left">
                        <SideMenu/>
                    </div>
                    <div className="admin-right">
                    {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

}

export default AdminLayout;