import React, { Component } from 'react';
import * as httpHelper from '../helpers/http-helper'

import moment from "moment";
import Layout from "./Layout";

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";


class PostDetail extends Component {

    constructor() {
        super()
        this.state = {
            post: {},
            pageLoading: true,
            safeContent: ""
        }
        //this.getPost = this.getPost.bind(this)
    }

    async componentWillMount() {
        let slug = this.props.match.params.slug
        await this.getPost(slug);
    }
    

    getPost(slug) {
        const self = this;
        httpHelper.get(`/public/posts/single/${slug}`)
        .then(response => {
            self.setState({
                post: response.data.post,
                safeContent: response.data.post.content.replace(/(<([^>]+)>)/ig, '').substring(0, 120),
                pageLoading: false,
            });
            Prism.highlightAll();
            console.log(this.state.post);

        });
    }


    render() {
        return (
            <Layout>
                {
                    this.state.post &&
                    <Helmet>
                    <title>{`${this.state.post.title} | özer`}</title>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:description" content={`${this.state.post.content}`} />
                    <meta name="twitter:title" content={`${this.state.post.title}`} />
                    <meta name="twitter:site" contenst="@ozergul1" />
                    <meta name="twitter:creator" content="@ozergul1" />
                    </Helmet>
                }

                <div className="posts">
                    <div className="centered">
                    {this.state.post &&
                        <div className="post">

                            <div className="info">
                                {moment(this.state.post.publish_date).fromNow()}
                            </div>

                            <h2 className="title">
                                {this.state.post.title}
                            </h2>

                            <div className="post-content styled-text">
                                <div dangerouslySetInnerHTML={{__html: this.state.post.content}}></div>
                            </div>

                            {this.state.post.tags &&
                                <div className="post-tags">
                                    {this.state.post.tags.map((tag, index) => 
                                        <Link to={`/tag/${(tag.slug)}`} className="tag-link">{tag.term}</Link>
                                    )}
                                </div> 
                            }
                        </div>
                    }
                    </div>
                </div>
            </Layout>
        );
    }
}

export default PostDetail;
