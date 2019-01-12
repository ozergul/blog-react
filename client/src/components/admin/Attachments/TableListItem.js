import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import {Link} from "react-router-dom";
import moment from "moment"
import * as httpHelper from '../../../helpers/http-helper'
import LazyLoad from 'react-lazyload';
import { toast } from 'react-toastify';

class TableListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
        };
    }

    componentWillMount() {}

    deleteAttachmentOpener = () => {
        this.setState({ popoverOpen: !this.state.popoverOpen });
    }

    deleteAttachmentYes = () => {
        this.setState({ popoverOpen: false });
        let id = this.props.attachment.id;
        let key = this.props.attachment.key;

        const data = {
            id: id,
            key: key
        }

        httpHelper.post('/attachments/delete', {
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
           },
        })
        .then(response => {
            if( response.data.success === true) {
                toast("Attachment deleted");
                this.trItem.style.display = "none";
            } else {
                toast.error("Attachment was not deleted");
                this.setState({ popoverOpen: true });
            }
        });
    }



    deleteAttachmentNo = () => {
        this.setState({ popoverOpen: !this.state.popoverOpen });
    }


    render() {
        let { attachment } = this.props
        return (
            <tr ref={(item)=> this.trItem = item}>
                <td>{attachment.id}</td>
                <td>
                    <LazyLoad>
                        <div className="attachment-table-list-item-image" style={{backgroundImage: `url(${attachment.location})`}}></div>
                    </LazyLoad>
                </td>
                <td>{attachment.key}</td>
                <td>{moment(attachment.createdAt).fromNow()}</td>
                <td>
                    <span className="btn btn-outline-danger mr-2" onClick={() => this.deleteAttachmentOpener()} 
                        role="button" id={'Popover-' + attachment.id}>x</span>

                    <Popover 
                        placement="bottom" 
                        isOpen={this.state.popoverOpen} 
                        target={'Popover-' + attachment.id} 
                        toggle={this.deletePostOpener}>
                        
                        <PopoverHeader>Are you sure to delete?</PopoverHeader>
                        <PopoverBody>
                            Attachment will be deleted
                            <br />
                            <Button onClick={() => this.deleteAttachmentYes()} className="btn btn-danger ml-auto mr-1 mt-1">Yes</Button>
                            <Button onClick={() => this.deleteAttachmentNo()} className="btn btn-success ml-auto mt-1">No</Button>
                        </PopoverBody>
                    </Popover>
                </td>
            </tr>
        );
    }
}

export default TableListItem;