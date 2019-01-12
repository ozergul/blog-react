import React, { Component } from 'react';
import {Link} from "react-router-dom";
import * as httpHelper from '../../../helpers/http-helper';
import {PostForm} from "./PostForm";


class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            ready: false,
            postToEdit : {
                id: "",
                title: "",
                slug: "",
                content: "",
                tags: [],
                categories:[],
                status: 1,
                postType: "",
                createdAt: "",
                updatedAt: "",
                formType: "edit" 
            },
        }

    }

    componentWillMount() {
        let postId = this.props.match.params.postId;
        this.getCurrentPost(postId);
    }

    getCurrentPost = (postId) => {
        httpHelper.get(`/posts/single/${postId}`)
        .then(response => {
            if(response.data.success === true) {
                this.setState(prevState => ({
                    postToEdit: {
                        ...prevState.postToEdit,
                        id: response.data.post.id,
                        title: response.data.post.title,
                        slug: response.data.post.slug,
                        content: response.data.post.content,
                        tags: response.data.post.tags,
                        categories: response.data.post.categories,
                        status: response.data.post.status,
                        postType: response.data.post.postType,
                        createdAt: response.data.post.createdAt,
                        updatedAt: response.data.post.updatedAt,
                    }
                }))
                this.setState({ready: true})
            } else {
                this.props.history.push("/admin/posts") /* maybe 404 */
            }

        });
    }

    onFormSubmit = payload => {
        let {id, title, slug, content, tags, categories, status, postType} = payload;

        const data = {
            id: id,
            title: title,
            slug: slug,
            content: content,
            tags: tags,
            categories: categories,
            status: status,
            postType: 1,
        }

        console.log(data)
        
        httpHelper.post('/posts/update', {
            body: data,
        })
        .then(response => {
            if(response.data.success === true) {
                console.log("response.data", response.data);
                this.props.history.push("/admin/posts")
            }
        });
    };

    render() {
        return (
            <>
                <div className="d-flex w-100 align-items-center mb-3">
                    <h2>
                        Edit post {this.state.postToEdit.id && <span className="badge badge-info">#{this.state.postToEdit.id}</span>}
                    </h2>
                </div>
                { this.state.ready && <PostForm postToEdit={this.state.postToEdit} onFormSubmit={this.onFormSubmit}/>}
                { !this.state.ready && <div>Loading edit...</div>}
            </>
        )
    }
}

export default EditPost;