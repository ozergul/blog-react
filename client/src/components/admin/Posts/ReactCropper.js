import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ReactCropper from "../../custom-cropper/js/cropper"
import 'cropperjs/dist/cropper.css';

import * as httpHelper from '../../../helpers/http-helper'


class ReactImageCropper extends Component {
    constructor() {
        super();
        this.state = {
            uploaded: false,
            location: null,
        }
    }

    removeImage = () => {
        this.props.removeImage(this.props.i);
      };

    _crop(){
        console.log("crop")
        //console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
    }

    componentDidMount() {}

    upload = () => {
        let fileToSend = {
            name: this.props.file.name,
            base64: this.refs.cropper.getCroppedCanvas().toDataURL()
        }
        const data = {
            fileToSend: fileToSend
        }
        httpHelper.post(`/attachments/image-upload`,{
            body: data,
        }).then(response => {
            if(response.data.success) {
                console.log(response.data)
                this.setState({
                    uploaded: true,
                    location: response.data.data.url
                })
            }
        })
    }

    render() {
        let {file, i} = this.props;
        let {uploaded} = this.state;

        return (
            <Col xs={4} className="mb-2">
            <div className="image-item">
                <div className="image-top">
                    <span className="image-name">{file.name}</span>
                    {!uploaded && 
                        <span className="btn btn-danger remove-image-button" onClick={this.removeImage}>x</span>
                    }
                </div>
            
                <ReactCropper
                    key={file.name}
                    ref='cropper'
                    src={file.preview}
                    style={{height: 300, width: '100%'}}
                    aspectRatio={"free"}
                    guides={false}
                    crop={this._crop} />
                    {!uploaded && 
                        <div className="upload-button-area">
                            <button
                                type="button"
                                className="btn btn-secondary upload-button"
                                onClick={this.upload}>
                            Upload</button>
                        </div>
                    }

                    {uploaded && 
                        <div className="upload-finish-area">

                            <div className="input-group uploaded-input">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="link-addon">Link</span>
                                </div>
                                <input 
                                    type="text" className="form-control" disabled
                                    placeholder="Image Link" aria-label="Image Link" defaultValue={this.state.location}
                                    aria-describedby="link-addon" />
                            </div>
                        </div>
                    }
            </div>
        </Col>
        )
    }
}

export default ReactImageCropper;