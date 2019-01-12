import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';

import ReactDropzone from 'react-dropzone';
import ReactImageCropper from "./ReactCropper"

import { withFormik } from 'formik';
import * as Yup from 'yup';

import * as functions from "../../../helpers/functions"
import * as httpHelper from '../../../helpers/http-helper'

import moment from "moment"


const formikEnhancer = withFormik({
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
    //   title: Yup.string()
    //     .min(2, 'Min 2 characters')
    //     .required('Required'),
    //     content: Yup.string()
    //     .min(2, 'Min 2 characters')
    //     .required('Required'),
    }),

    mapPropsToValues: props => ({ 
        id: props.postToEdit.id, 
        title: props.postToEdit.title, 
        content: props.postToEdit.content, 
        tags: props.postToEdit.tags,
        categories: props.postToEdit.categories,
        slug: props.postToEdit.slug,
        status: props.postToEdit.status,
        postType: props.postToEdit.postType,
        createdAt: props.postToEdit.createdAt,
        updatedAt: props.postToEdit.updatedAt,
        formType: props.postToEdit.formType,
    }),
    mapValuesToPayload: x => x,

    handleSubmit: (payload, bag) => {
        bag.setSubmitting(false);
        bag.props.onFormSubmit(payload);
    },
    displayName: 'PostForm',
});


class PostFormClass extends Component {

    constructor() {
        super();

        this.state = {
            allCategories: [],
            newCategory: "",
            files: [],
        }

        this.addNewCategory = this.addNewCategory.bind(this);
        this.removeImage = this.removeImage.bind(this);
    }

    handleTermInputChange = e =>  {
        let term = e.target.value;
        let slug = functions.toSeoUrl(term);
        this.props.setFieldValue("slug", slug);
    }

    getRelatedTags(search){
        return httpHelper.get(`/terms/search?type=tags&search=${search}`)
        .then(response => {
            let responseTerms = response.data.terms;
            let newTags = responseTerms.map(tag => ({ value: tag.term, label: tag.term }));
            return newTags
        });
    }

    componentDidMount() {
        this.getCategories(this.props.postToEdit.categories);
    }

    getCategories(selectedCategories) {
        httpHelper.get(`/terms/all?type=categories`)
        .then(response => {
            let responseTerms = response.data.terms;
            let newCategories = responseTerms.map(category => ({ 
                id: category.id, 
                term: category.term,
                selected: selectedCategories ? (selectedCategories.includes(category.id) ? true : false) : false
            }));
            this.setState({allCategories: newCategories});
        })
    }

    handleCategoryChecbox = (e) => {
        let checkedCategories = this.props.postToEdit.categories;
        let checked = e.target.checked;
        let value = parseInt(e.target.value);

        if(checked) {
            checkedCategories.push(value)
        } else {
            let index = checkedCategories.indexOf(value);
            if (index > -1) {
                checkedCategories.splice(index, 1);
            }
        }
        this.props.setFieldValue("categories", checkedCategories)

    }

    addNewCategory(event) {
        event.preventDefault();
        let newCategory = this.state.newCategory.trim();

        if(newCategory) {
            const data = {
                term: newCategory,
                type: "categories"
            }
            
            httpHelper.post('/terms/add', {
                body: data,
            })
            .then(response => {
               if(response.data.success === true) {
                    this.getCategories();
               }
            });
        }
    }


    onDrop =  (droppedFiles) => {
        
        let newFiles =  droppedFiles.map(file => ({
            name: file.name,
            preview:  URL.createObjectURL(file)
        }))

        this.setState({ 
            files: this.state.files.concat(newFiles)
        });

        console.log(this.state.files)
      
    }

    onCancelDrop = (e) => {
        console.log("onCancel", e)
    }

    componentWillUnmount() {
        // Make sure to revoke the data uris to avoid memory leaks
        this.state.files.forEach(file => URL.revokeObjectURL(file.preview))
    }

    removeImage = i => {
        this.setState({
            files: this.state.files.filter((_, a) => a !== i)
        });
    }

    render() {
        const {
            values,
            errors,
            touched,
            handleChange,
            isSubmitting,
            handleBlur,
            handleSubmit,
            setFieldValue,
        } = this.props;

        return (
        <form onSubmit={handleSubmit}>
            <Container fluid={true}>
                <Row>
                    <Col xs="8">

                        {/* TITLE INPUT */}
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Post title"
                                value={values.title}
                                onChange={e => {
                                    handleChange(e)
                                    this.handleTermInputChange(e)
                                }}
                                onBlur={handleBlur}
                                className={
                                    errors.title && touched.title ? 'form-control is-invalid' : 'form-control'
                                }
                            />
                            {values.slug && 
                            <span className="badge badge-info">Slug:</span>} {values.slug}
                        </div>
                        
                        {errors.title &&
                            touched.title &&<div className="alert alert-danger">{errors.title}</div>}


                        {/* STATUS CHECKBOX
                        <div className="custom-control custom-checkbox">    
                            <input
                                type="checkbox"
                                id="status"
                                value={values.status}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="custom-control-input"
                            />
                            <label className="custom-control-label" htmlFor="status">{this.state.statusString[values.status]}</label>
                        </div> */}



                        {/* CONTENT TEXTAREA */}
                        <div className="form-group">
                            <label htmlFor="content">Description</label>
                            <textarea
                                id="content"
                                rows={15}
                                placeholder="Post content"
                                value={values.content}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={
                                errors.content && touched.content ? 'form-control is-invalid' : 'form-control'
                            }></textarea>
                        </div>



                        {/* TAGS INPUT */}
                        <div className="form-group">
                            <label htmlFor="tags">Tags</label>

                            <AsyncCreatableSelect
                                isMulti
                                isClearable
                                id="tags"
                                onChange={option => setFieldValue("tags", option)}
                                onBlur={handleBlur}
                                loadOptions={this.getRelatedTags}
                                value={values.tags}
                                cacheOptions
                            />
                        </div>
                    </Col>

                    <Col xs={4}>

                        {/* CATEGORIES AREA */}
                        <div className="form-group new-category-add-in-post">
                            <label htmlFor="categories">Categories</label>
                            
                            <div className="categories-list">
                                {this.state.allCategories.map( (category, index) => 
                                    <div key={index} value={category.id}>
                                        <div className="custom-control custom-checkbox">
                                            <input
                                                value={category.id}
                                                defaultChecked={category.selected}
                                                type="checkbox"
                                                className="custom-control-input"
                                                onChange={this.handleCategoryChecbox}
                                                id={`id-${category.id}`}/>
                                                
                                            <label className="custom-control-label" htmlFor={`id-${category.id}`}>{category.term}</label>
                                        </div>
                                    </div>)
                                }

                                {!this.state.allCategories && <div> Loading categories... </div> }
                            </div>

                            <div className="form-group">
                                <label htmlFor="newCategory">Add new category</label>
                                <div className="d-flex align-items-center">
                                <input 
                                    id="newCategory"
                                    className="form-control"
                                    name="newCategory"
                                    onChange={(e)=> this.setState({newCategory: e.target.value})}
                                    />
                                    <a className="btn btn-success ml-2" onClick={this.addNewCategory}>Add</a>
                                </div>
                            </div>

                            {/* SAVE/EDIT TIMES */}
                            {values.formType === "edit" && 
                            <div className="form-group">
                                <div>
                                    <span className="badge">Created at:</span> {moment(values.createdAt).fromNow()}
                                </div>
                                <div>
                                    <span className="badge">Updated at:</span> {moment(values.updatedAt).fromNow()}
                                </div>
                               
                            </div>}
                        </div>
                    </Col>



                    <Col xs={12}>
                        <ReactDropzone
                        accept="image/*"
                        onDrop={this.onDrop}
                        onFileDialogCancel={this.onCancel}
                        >
                        {({getRootProps, getInputProps}) => (
                            <div {...getRootProps()}>
                            <input {...getInputProps()} />
                                <p>Drop files here, or click to select files</p>
                            </div>
                        )}
                        </ReactDropzone>
                        <Row>

                        {this.state.files.length > 0 &&
                            <>
                                {this.state.files.map((file,i) => (
                                    <ReactImageCropper file={file} key={i} i={i} removeImage={this.removeImage}/>
                                ))}
                            </>
                            }
                        </Row>
                    </Col>

                    <Col xs={12}>
                        <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isSubmitting}>Save Post</button>
                    </Col>

                </Row>
                
                
                
                
                

            </Container>
        </form>
        );
    }
}

export const PostForm = formikEnhancer(PostFormClass);