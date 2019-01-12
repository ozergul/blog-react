import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import {Link} from "react-router-dom";
import * as httpHelper from '../../../helpers/http-helper'
import { EditableLine } from 'editable-line';
import { urlBuilder } from '../../../helpers/url-builder';
import { toast } from 'react-toastify';

class TableListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
            term: "",
            slug: "",
            id: "",
            description: "",
            postsCount: ""
        };
    }

    componentWillMount() {
        this.setState({ 
            term: this.props.category.term,
            id: this.props.category.id,
            slug: this.props.category.slug,
            description: this.props.category.description,
            postsCount: this.props.category.postsCount
        })
    }

    /* description textarea */
    handleFocusDescriptionTextarea = () => {}
    handleCancelDescriptionTextarea = (oldValue) => { }

    handleFocusOutDescriptionTextareaEmpty = (oldValue) => { this.setState({ description: oldValue }) }

    handleFocusOutDescriptionTextarea = (text) => {
        const self = this;
        text = text.trim()

        const data = {
            id: this.state.id,
            description: text,
        }
        httpHelper.post('/terms/update-description', {
            body: data
        })
        .then(response => {
            if(response.data.success === true) {
                self.setState({ description: text })
            }
        });
    }

    
    /* term input */
    handleFocusTermInput = () =>  {}
    handleCancelTermInput = (oldValue) =>  {}

    handleFocusOutTermInputEmpty = (oldValue) =>  { this.setState({ term: oldValue })  }

    handleFocusOutTermInput = (text) =>  {
        const self = this;
        text = text.trim()

        const data = {
            id: this.state.id,
            term: text,
        }
        httpHelper.post('/terms/update-term', {
            body: data
        })
        .then(response => {
            console.log(response.data)
            if(response.data.success === true) {
                self.setState({ term: text });
                self.setState({ slug: response.data.slug });
            }
        });
    }

    /* slug input */
    handleFocusSlugInput = () => {}
    handleCancelSlugInput = (oldValue) => {}

    handleFocusOutSlugInputEmpty = (oldValue) => { this.setState({ term: oldValue })  }

    handleFocusOutSlugInput = (text) => {
        const self = this;
        text = text.trim()

        const data = {
            id: this.state.id,
            slug: text,
        }
        httpHelper.post('/terms/update-slug', {
            body: data
        })
        .then(response => {
            if(response.data.success === true) {
                self.setState({ slug: response.data.slug });
            }
        });
    }

    /* delete category */
    deleteCategoryOpener = () => {
        this.setState({ popoverOpen: !this.state.popoverOpen });
    }

    deleteCategoryYes = () => {
        this.setState({ popoverOpen: false });
        let id = this.props.category.id

        const data = {
            id: id
        }

        httpHelper.post('/terms/delete', {
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
           },
        })
        .then(response => {
            if( response.data.success === true) {
                toast("Term deleted");
                this.trItem.style.display = "none";
            } else {
                toast.error("Term was not deleted");
                this.setState({ popoverOpen: true });
            }
        });
    }

    deleteCategoryNo = () => {
        this.setState({ popoverOpen: !this.state.popoverOpen });
    }


    render() {
        return (
            <tr ref={(item)=> this.trItem = item}>
                <td>{this.props.category.id}</td>
                <td>
                    <div className="form-group">
                        <EditableLine
                            value={this.state.term}
                            escCancels={true}
                            className='form-control'
                            onFocus={this.handleFocusTermInput}
                            onFocusOut={this.handleFocusOutTermInput}
                            onFocusOutEmpty={this.handleFocusTermInputEmpty}
                            onCancel={this.handleCancelTermInput}
                            enterSaves={true}
                        />
                    </div>
                </td>
                <td>
                    <div className="form-group">
                        <EditableLine
                            value={this.state.slug}
                            escCancels={true}
                            className='form-control'
                            onFocus={this.handleFocusSlugInput}
                            onFocusOut={this.handleFocusOutSlugInput}
                            onFocusOutEmpty={this.handleFocusSlugInputEmpty}
                            onCancel={this.handleCancelSlugInput}
                            enterSaves={true}
                        />
                    </div>
                </td>
                <td>
                    <div className="form-group">
                        <EditableLine
                            type="textarea"
                            value={this.props.category.description}
                            escCancels={true}
                            className='form-control'
                            onFocus={this.handleFocusDescriptionTextarea}
                            onFocusOut={this.handleFocusOutDescriptionTextarea}
                            onFocusOutEmpty={this.handleFocusOutDescriptionTextareaEmpty}
                            onCancel={this.handleCancelDescriptionTextarea}
                            labelPlaceholder="<i>Click to add description<i/>"
                            enterSaves={false}
                            allowEmpty={true}
                        />
                    </div>
                </td>
                <td>
                    {this.state.postsCount}
                </td>
                <td>
                <Link className="btn btn-outline-secondary mr-2" to={ urlBuilder("category", this.state.slug) } target="_blank">See Category</Link>

                    <span 
                    className="btn btn-outline-danger" role="button" 
                    id={'Popover-' + this.props.id} onClick={this.deleteCategoryOpener}>x</span>


                    <Popover 
                        placement="bottom" 
                        isOpen={this.state.popoverOpen} 
                        target={'Popover-' + this.props.id} 
                        toggle={this.deleteCategoryOpener}>
                        
                        <PopoverHeader>Are you sure to delete?</PopoverHeader>
                        <PopoverBody>
                            Category will be deleted
                            <br />
                            <Button onClick={this.deleteCategoryYes} className="btn btn-danger ml-auto mr-1 mt-1">Yes</Button>
                            <Button onClick={this.deleteCategoryNo} className="btn btn-success ml-auto mt-1">No</Button>
                        </PopoverBody>
                    </Popover>

                </td>
            </tr>
        );
    }
}

export default TableListItem;