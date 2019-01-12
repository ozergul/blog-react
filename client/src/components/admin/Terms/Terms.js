import React, { Component } from 'react';
import * as httpHelper from '../../../helpers/http-helper'
import TableListItem from "./TableListItem"
import { Container, Row, Col } from 'reactstrap';
import { AddTermForm } from "./AddTerm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";


class Terms extends Component {
    constructor() {
        super();
        this.state = {
            terms: [],
            termsCount: 0,
            termPerPage: 0,
            pages: 0,

            termType: "",

            termToAdd: {
                term: '',
                slug: '',
                description: '',
                type: '',
            },
        };
        this.getAllTerms = this.getAllTerms.bind(this)
    }

    strings = {
        "categories" : {
            TITLE: "Categories",
            TERM_TYPE: "category",
            ADD_NEW_TITLE: "Add new category",
            TERM_INPUT_PLACEHOLDER: "Category term",
            SLUG_INPUT_PLACEHOLDER: "Category slug",
            DESCRIPTION_INPUT_PLACEHOLDER: "Category description",
        },
        "tags" : {
            TITLE: "Tags",
            TERM_TYPE: "tag",
            ADD_NEW_TITLE: "Add new tag",
            TERM_INPUT_PLACEHOLDER: "Tag term",
            SLUG_INPUT_PLACEHOLDER: "Tag slug",
            DESCRIPTION_INPUT_PLACEHOLDER: "Tag description",
        }
    }

    async componentWillMount() {
        let pageId = this.props.match.params.pageId;
        const urlParams = new URLSearchParams(this.props.location.search);
        let termType = urlParams.get("type");

        this.setState({termType: termType})
        this.setState(prevState => ({
            termToAdd: {
                ...prevState.termToAdd,
                type: termType
            }
        }))
       
        await this.getAllTerms(pageId, termType);
    }

    
    componentWillReceiveProps(nextProps, nextState) {
        let pageId = nextProps.match.params.pageId
        const urlParams = new URLSearchParams(nextProps.location.search);
        let termType = urlParams.get("type");

        this.setState({termType: termType})
        this.setState(prevState => ({
            termToAdd: {
                ...prevState.termToAdd,
                type: termType
            }
        }))
        this.getAllTerms(pageId, termType)
    }

    async getAllTerms(pageId, termType) {
        pageId = parseInt(pageId);
        if(isNaN(pageId)) pageId = 1
        const self = this;

        const data = {
            termType: termType
        }

        self.setState({
            terms: [],
            termsCount: 0,
            termPerPage: 0,
            pages: 0
        })

        await httpHelper.get(`/terms/all/${pageId}?type=${termType}`, {
            body: data
        })
        .then(response => {
            self.setState({
                terms: response.data.terms,
                termsCount: response.data.termsCount,
                termPerPage: response.data.termPerPage,
                pages: Math.ceil(response.data.termsCount/response.data.termPerPage)
            })
        })
    }

    onTermAdd = payload => {
        //this.getAllTerms();
        window.location.reload()
    };

    render() {
        const strings = this.strings[this.state.termType];
        return (
                <>
                <Container fluid>

                    <Helmet>
                        <title>Admin | {strings.TITLE}</title>
                    </Helmet>

                    <div className="d-flex w-100 align-items-center mb-3">
                        <h2>
                            {strings.TITLE}
                        </h2>
                    </div>
                    
                    <Row>
                        <Col xs="4">
                            <AddTermForm  strings={this.strings[this.state.termType]} onTermAdd={this.onTermAdd} termToAdd={this.state.termToAdd} />
                        </Col>

                        <Col xs="8">
                            <h4>Terms <span className="badge badge-success ml-auto">Total  {strings.TERM_TYPE} count: {this.state.termsCount}</span></h4>
                            <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th width="3%" scope="col">#</th>
                                    <th width="23%" scope="col">Term</th>
                                    <th width="23%" scope="col">Slug</th>
                                    <th width="23%" scope="col">Description</th>
                                    <th width="3%" scope="col">Count</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.terms && this.state.terms.map( (term, index) => 
                                    <TableListItem key={index} category={term} id={index} />)
                                }

                                
                            </tbody>
                            </table>

                            {!this.state.terms &&
                                    <div className="alert alert-info">There is no term. You can add term from left side.</div>
                            }

                            <nav aria-label="Pagination">
                                <ul className="pagination">
                                {!isNaN(this.state.pages) && [...Array(this.state.pages)].map( (post, index) => 
                                    <li className="page-item" key={index}>
                                        <Link 
                                        to={`/admin/terms/page/${(index + 1)}?type=${this.state.termType}`}
                                        className="page-link">{index + 1}</Link>
                                    </li>
                                )}
                                </ul>
                            </nav>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default Terms;