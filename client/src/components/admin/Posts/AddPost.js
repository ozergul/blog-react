import React, { Component } from 'react';
import {Link} from "react-router-dom";
import * as httpHelper from '../../../helpers/http-helper';
import {PostForm} from "./PostForm";


class AddPost extends Component {
    constructor() {
        super();
        this.state = {
            postToEdit : {
                title: "",
                slug: "",
                content: "",
                tags: [],
                categories:[],
                status: 1,
                postType: "",
                createdAt: "",
                updatedAt: "",
                formType: "add" 
            }
        }
    }

    onFormSubmit = payload => {
        let {title, slug, content, tags, categories, status, postType} = payload;

        const data = {
            title: title,
            slug: slug,
            content: content,
            tags: tags,
            categories: categories,
            status: status,
            postType: postType,
            
        }

        httpHelper.post('/posts/add', {
            body: data,
        })
        .then(response => {
            if(response.data.success === true) {
                this.props.history.push("/admin/posts")
            }
        });

    };


    render() {
        return (
            <>
                <div className="d-flex w-100 align-items-center mb-3">
                    <h2>
                        Add new post
                    </h2>
                </div>
                <PostForm postToEdit={this.state.postToEdit} onFormSubmit={this.onFormSubmit}/>
            </>
        )
    }
}

export default AddPost;