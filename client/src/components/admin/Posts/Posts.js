import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as httpHelper from '../../../helpers/http-helper'
import { FiPlusCircle } from "react-icons/fi";
import TableListItem from "./TableListItem";
import { Helmet } from "react-helmet";
class Posts extends Component {
    constructor() {
        super();
        this.state = {
          posts : [],
          postsCount: 0,
          postPerPage: 0,
          pages: 0,
        };

    }

    async componentWillMount() {
        let pageId = this.props.match.params.pageId;
        if(!pageId) pageId = 1;
        await this.getAllPosts(pageId);
    }

    async componentWillReceiveProps(nextProps) {
        let pageId = nextProps.match.params.pageId;
        if(!pageId) pageId = 1;
        await this.getAllPosts(pageId);
    }

    getAllPosts = async (pageId) => {
        httpHelper.get(`/posts/all/${pageId}`)
        .then(response => {
            this.setState({
                posts: response.data.posts,
                postsCount: response.data.count,
                postPerPage: response.data.postPerPage,
                pages: Math.ceil(response.data.count/response.data.postPerPage)
            })
        });
    }



    render() {
        return (
            <>

                <Helmet>
                    <title>Admin | Posts</title>
                </Helmet>

                <div className="d-flex w-100 align-items-center">
                    <h2>
                        Posts
                    </h2>
                    <Link to="/admin/posts/add" className="btn btn-primary ml-auto"><FiPlusCircle/> Add Post</Link>
                </div>
                <>
                    <h4>
                        Posts <span className="badge badge-success ml-auto">Total post count: {this.state.postsCount}</span>
                    </h4>
                    <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th width="3%" scope="col">#</th>
                            <th width="40%" scope="col">Title </th>
                            <th width="10%" scope="col">Date Published</th>
                            <th width="10%" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.posts.map( (post, index) => 
                            <TableListItem key={index} post={post} id={index}/>
                            )
                        }
                    </tbody>
                    </table>


                    {!this.state.posts &&
                        <div class="alert alert-info">There is no post.</div>
                    }

                    <nav aria-label="Pagination">
                        <ul className="pagination">
                        {!isNaN(this.state.pages) && [...Array(this.state.pages)].map( (post, index) => 
                            <li className="page-item" key={index}>
                                <Link 
                                to={`/admin/posts/page/${(index + 1)}`}
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

export default Posts;