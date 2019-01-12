import React, { Component } from 'react';
import * as httpHelper from '../helpers/http-helper'

import moment from "moment"
import Layout from './Layout'

class PostDetail extends Component {

    constructor() {
        super()
        this.state = {
            post: {}
        }
        //this.getPost = this.getPost.bind(this)
    }

    componentDidMount() {
        let slug = this.props.match.params.slug
        this.getPost(slug)
    }
    

    getPost(slug) {
        const self = this;
        const data = {
            slug: slug
        }
        httpHelper.post('/posts/get', {
            body: data,
        })
        .then(response => {
            console.log(response.data)
            self.setState({ post: response.data})
        });
    }


    render() {
        return (
            <Layout>
                <div className="posts">
                {this.state.post &&
                    <div className="post">

                        <div className="info">
                            {moment(this.state.post.publish_date).fromNow()}
                        </div>

                        <h2>
                            {this.state.post.title}
                        </h2>

                        <div className="post-excerpt">
                            <div dangerouslySetInnerHTML={{__html: this.state.post.content}}></div>
                        </div>

                    </div>
                }
                </div>
            </Layout>
        );
    }
}

export default PostDetail;
