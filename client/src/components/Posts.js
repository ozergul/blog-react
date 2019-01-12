import React, { Component } from 'react';
import * as httpHelper from '../helpers/http-helper'
import {Link} from "react-router-dom";

import moment from "moment";
import "../assets/blog.scss";

import hljs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/github.css'

class Posts extends Component {

    constructor() {
        super();
        this.state = {
          posts : [],
          postsCount: 0,
          pages: 0
        };

    }

    componentDidMount() {
        
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
        httpHelper.get(`/public/posts/all/${pageId}`)
        .then(response => {
            this.setState({ 
                posts: response.data.posts,
                postsCount: response.data.count,
                pages: Math.ceil(response.data.count/response.data.postPerPage)
            })
        });
    }


    render() {
        return (
            <div className="posts">
                <div className="centered">
                {
                    this.state.posts.map( (post, index) => 
                        <div key={index} className="post">

                            <div className="info">
                                {moment(post.createdAt).fromNow()}
                            </div>

                            <h2 className="title">
                                <Link to={ "/" + post.slug}>{post.title}</Link>
                            </h2>

                            <div className="post-excerpt styled-text">
                                <div dangerouslySetInnerHTML={{__html: post.content}}></div>
                            </div>
                        </div>
                    )
                }
                
                    <nav aria-label="Pagination">
                        <ul className="pagination">
                        {!isNaN(this.state.pages) && [...Array(this.state.pages)].map( (post, index) => 
                            <li className="page-item" key={index}>
                                <Link 
                                to={`/page/${(index + 1)}`}
                                className="page-link">{index + 1}</Link>
                            </li>
                        )}
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Posts;
