import React, { Component } from 'react';
import Posts from './Posts'
import Layout from './Layout';
import Helmet from "react-helmet";



class HomePage extends Component {

    render() {
        return (
            <Layout>
                <Helmet>
                    <title>blog | özer</title>
                </Helmet>

                <Posts {...this.props}/>
            </Layout>
        )
    }

}

export default HomePage;