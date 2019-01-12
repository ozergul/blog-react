/* jshint expr: true */

import React, { Component } from 'react';

import { withFormik } from 'formik';
import * as Yup from 'yup';

import * as functions from "../../../helpers/functions"
import * as httpHelper from '../../../helpers/http-helper'

const formikEnhancer = withFormik({
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      term: Yup.string()
        .min(2, 'Min 2 characters')
        .required('Required'),
      slug: Yup.string()
        .min(2, 'Min 2 characters')
        .required('Required'),
    }),

    mapPropsToValues: props => ({ 
        term: props.termToAdd.term, 
        slug: props.termToAdd.slug, 
        description: props.termToAdd.description, 
        type: props.termToAdd.type, 
    }),
    mapValuesToPayload: x => x,

    handleSubmit: (payload, bag) => {
        bag.setSubmitting(false);

        let {term, description, type} = payload;

        const data = {
            term: term,
            description: description,
            type: type
        }

        console.log(data)
        
        httpHelper.post('/terms/add', {
            body: data,
        })
        .then(response => {
            if(response.data.success === true) {
                bag.props.onTermAdd({sent: true});
            }
        });
    },
    displayName: 'AddTerm',
});


class AddTerm extends Component {
    handleTermInputChange(e) {
        let term = e.target.value;
        let slug = functions.toSeoUrl(term);
        this.props.setFieldValue("slug", slug);
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
            strings
        } = this.props;

        return (
        <form onSubmit={handleSubmit}>
            <h4>{strings.ADD_NEW_TITLE}</h4>

            {/* TERM INPUT */}
            <div className="form-group">
                <label htmlFor="term">Term</label>
                <input
                    type="text"
                    id="term"
                    placeholder={strings.TERM_INPUT_PLACEHOLDER}
                    value={values.term}
                    onChange={e => {
                        handleChange(e)
                        this.handleTermInputChange(e)
                    }}
                    onBlur={handleBlur}
                    className={
                        errors.term && touched.term ? 'form-control is-invalid' : 'form-control'
                    }
                />
            </div>

            {errors.term &&
                touched.term &&<div className="alert alert-danger">{errors.term}</div>}



            {/* SLUG INPUT */}
            <div className="form-group">
                <label htmlFor="slug">Slug</label>
                <input
                    type="text"
                    id="slug"
                    placeholder={strings.SLUG_INPUT_PLACEHOLDER}
                    value={values.slug}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                        errors.slug && touched.slug ? 'form-control is-invalid' : 'form-control'
                    }
                    readOnly
                />
            </div>

            {errors.slug &&
                touched.slug && <div className="alert alert-danger">{errors.slug}</div>}

            {/* DESCRIPTION TEXTAREA */}
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    placeholder={strings.DESCRIPTION_INPUT_PLACEHOLDER}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                    errors.description && touched.description ? 'form-control is-invalid' : 'form-control'
                }></textarea>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}>Add</button>
        </form>
        );
    }
}

export const AddTermForm = formikEnhancer(AddTerm);