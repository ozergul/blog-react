import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Posts from './Posts/Posts'
import AddPost from './Posts/AddPost'
import EditPost from './Posts/EditPost'

import DashBoard from './Dashboard/DashBoard'
import AdminLayout from "./AdminLayout";
import Terms from './Terms/Terms'

import Attachments from "./Attachments/Attahments";



class AdminRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <AdminLayout>
                        <Route exact path='/admin/posts/add' component={AddPost} />
                        <Route exact path='/admin/posts/' component={Posts} />
                        <Route exact path='/admin/posts/page/:pageId' component={Posts} />
                        <Route exact path='/admin/posts/edit/:postId' component={EditPost} />

                        <Route exact path='/admin/terms/' component={Terms} />
                        <Route exact path='/admin/terms/page/:pageId' component={Terms} />

                        <Route exact path='/admin/attachments/' component={Attachments} />
                        <Route exact path='/admin/attachments/page/:pageId' component={Attachments} />

                        <Route exact path='/admin/' component={DashBoard} />
                    </AdminLayout>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default AdminRouter;