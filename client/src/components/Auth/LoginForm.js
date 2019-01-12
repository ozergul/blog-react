import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input, Button, Alert } from 'reactstrap';

import * as httpHelper from '../../helpers/http-helper'
import * as tokenHelper from '../../helpers/token-helper'

class LoginForm extends Component {

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            message: "",
            email: "",
            password: ""
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            email: this.state.email,
            password: this.state.password
        }

        httpHelper.post('/user/login', {
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
           },
        })
        .then(response => {
            this.setState({ message: response.data.message})

            if(response.data.success === true) {
                tokenHelper.setToken(response.data.token)
                this.props.history.push("/admin");
            } else {
                tokenHelper.clearToken()
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit} className="login-form">
                <InputGroup size="lg">
                    <InputGroupAddon addonType="prepend">Email</InputGroupAddon>
                    <Input name="email" value={this.state.email} onChange={this.handleInputChange} />
                </InputGroup>

                <InputGroup size="lg">
                    <InputGroupAddon addonType="prepend">Password</InputGroupAddon>
                    <Input name="password" value={this.state.password} onChange={this.handleInputChange} />
                </InputGroup>
                
                <Button color="primary" size="lg">LOGIN</Button>

                {
                    this.state.message && 
                    <Alert color="primary">
                    {this.state.message}
                    </Alert>
                }
            </form>
        );
    }
}

export default LoginForm;
