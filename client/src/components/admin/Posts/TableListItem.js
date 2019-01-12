import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import {Link} from "react-router-dom";
import moment from "moment"
import * as httpHelper from '../../../helpers/http-helper'
import { FiEdit } from "react-icons/fi";
import { urlBuilder } from "../../../helpers/url-builder";
import { toast } from 'react-toastify';


class TableListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
            postTitle: "",
            id: "",
            postSlug: ""
        };
    }

    componentWillMount() {
        this.setState({ 
            id: this.props.post.id,
            postTitle: this.props.post.title,
            postSlug: this.props.post.slug,
        })
    }

    handleFocusPostTitleInput = () => {}
    handleCancelPostTitleInput = (oldValue) =>  {}

    handleFocusOutPostTitleInputEmpty = (oldValue) =>  {this.setState({ postTitle: oldValue })}
    handleFocusOutPostTitleInput = (text) =>  {
        const self = this;
        text = text.trim()

        const data = {
            id: this.state.id,
            title: text,
        }
        httpHelper.post('/posts/update-title', {
            body: data
        })
        .then(response => {
            if(response.data.success === true) {
                self.setState({ postSlug: response.data.slug })
            }
        });

    }

    deletePostOpener() {
        this.setState({ popoverOpen: !this.state.popoverOpen });
    }

    deletePostYes() {
        this.setState({ popoverOpen: false });
        let id = this.props.post.id

        const data = {
            id: id
        }

        httpHelper.post('/posts/delete', {
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
           },
        })
        .then(response => {
            if( response.data.success === true) {
                toast("Post deleted");
                this.trItem.style.display = "none"
            } else {
                toast.error("Post was not deleted");
            }
        });
    }



    deletePostNo() {
        this.setState({ popoverOpen: !this.state.popoverOpen });
    }


    
    render() {
        return (
            <tr key={this.props.index} ref={(item) => this.trItem = item}>
            
                <td scope="row">{this.props.post.id}</td>
                <td>
                    {/* <EditableLine
                        value={this.state.postTitle}
                        escCancels={true}
                        onFocus={this.handleFocusPostTitleInput}
                        onFocusOut={this.handleFocusOutPostTitleInput}
                        onFocusOutEmpty={this.handleFocusOutPostTitleInputEmpty}
                        onCancel={this.handleCancelPostTitleInput}
                        enterSaves={true}
                        labelStyle={{"fontWeight": "bold", "cursor": "pointer"}}
                    />
                    <div className="w-100"></div>
                    <span className="small">Slug: {this.state.postSlug}</span>
                    
                    { this.props.post.status === 0 &&
                        <span className="ml-1 badge badge-info">Draft</span>
                    } */}

                    { this.props.post.status === 0 && <span className="badge badge-info mr-1">Draft</span> }
                    <Link className="admin-table-bold-link" to={"/admin/posts/edit/" + this.state.id} role="button">{this.state.postTitle}</Link>
                    <div className="w-100"></div>
                    <span className="small">Slug: {this.state.postSlug}</span>
                </td>
                <td>{moment(this.props.post.createdAt).fromNow()}</td>
                <td>
                    <Link 
                    className="btn btn-outline-success mr-2" to={"/admin/posts/edit/" + this.state.id} role="button"><FiEdit/></Link>
                    <Link className="btn btn-outline-secondary mr-2" to={ urlBuilder("post", this.state.postSlug) } target="_blank">See Post</Link>

                    <span className="btn btn-outline-danger mr-2" onClick={() => this.deletePostOpener()} 
                    role="button" id={'Popover-' + this.props.id}>x</span>
                    

                    <Popover 
                        placement="bottom" 
                        isOpen={this.state.popoverOpen} 
                        target={'Popover-' + this.props.id} 
                        toggle={this.deletePostOpener}>
                        
                        <PopoverHeader>Are you sure to delete?</PopoverHeader>
                        <PopoverBody>
                            Post will be deleted
                            <br />
                            <Button onClick={() => this.deletePostYes()} className="btn btn-danger ml-auto mr-1 mt-1">Yes</Button>
                            <Button onClick={() => this.deletePostNo()} className="btn btn-success ml-auto mt-1">No</Button>
                        </PopoverBody>
                    </Popover>

                </td>
            </tr>
        );
    }
}

export default TableListItem;