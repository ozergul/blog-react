import React, { Component } from 'react';
import Posts from './Posts'
import Layout from './Layout'



class HomePage extends Component {

    render() {
        return (
            <Layout>
                <Posts {...this.props}/>
            </Layout>
        )
    }

}

export default HomePage;