import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as httpHelper from '../../../helpers/http-helper'
import { FiPlusCircle } from "react-icons/fi";
import TableListItem from "./TableListItem";
import { Helmet } from "react-helmet";

class Attachments extends Component {
    constructor() {
        super();
        this.state = {
          attachments : [],
          attachmentCount: 0,
          attachmentsPerPage: 0,
          pages: 0,
        };

    }

    async componentWillMount() {
        let pageId = this.props.match.params.pageId;
        if(!pageId) pageId = 1;
        await this.getAllAttachments(pageId);
    }

    async componentWillReceiveProps(nextProps) {
        let pageId = nextProps.match.params.pageId;
        if(!pageId) pageId = 1;
        await this.getAllAttachments(pageId);
    }

    getAllAttachments= async (pageId) => {
        const self = this;
        httpHelper.get(`/attachments/all/${pageId}`)
        .then(response => {
            this.setState({
                attachments: response.data.attachments,
                attachmentsCount: response.data.count,
                attachmentsPerPage: response.data.attachmentsPerPage,
                pages: Math.ceil(response.data.count/response.data.attachmentsPerPage)
            })

            console.log(response.data)
        });
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Admin | Attachments</title>
                </Helmet>

                <div className="d-flex w-100 align-items-center">
                    <h2>
                        Attachments
                    </h2>
                    <Link to="/admin/attachments/add" className="btn btn-primary ml-auto"><FiPlusCircle/> Add Attachment</Link>
                </div>
                <>
                    <h4>
                    Attachments <span className="badge badge-success ml-auto">Total attachment count: {this.state.attachmentsCount}</span>
                    </h4>
                    <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th width="3%" scope="col">#</th>
                            <th width="5%" scope="col">Preview </th>
                            <th width="30%" scope="col">Key </th>
                            <th width="30%" scope="col">Created at </th>
                            <th width="10%" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.attachments.map( (attachment, index) => 
                            <TableListItem key={index} attachment={attachment} id={index}/>
                            )
                        }
                    </tbody>
                    </table>


                    {!this.state.attachments &&
                        <div class="alert alert-info">There is no attachments.</div>
                    }

                    <nav aria-label="Pagination">
                        <ul className="pagination">
                        {!isNaN(this.state.pages) && [...Array(this.state.pages)].map( (attachment, index) => 
                            <li className="page-item" key={index}>
                                <Link 
                                to={`/admin/attachments/page/${(index + 1)}`}
                                className="page-link">{index + 1}</Link>
                            </li>
                        )}
                        </ul>
                    </nav>
                </>
            </>
        )
    }
}

export default Attachments;