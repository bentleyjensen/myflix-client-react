import React from "react";
import axios from "axios";

import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

export class UserView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            birthdate: '',
            password1: '',
            password2: '',
            favorites: '',

            errGetUser: '',
            errUpdateUser: '',
            errDeleteUser: '',
            errUsername: '',
            errPassword1: '',
            errPassword2: '',
            errEmail: '',
            errBirthdate: '',
            errSubmit: '',
        }
    }

    render() {
        const favorites = this.state.favorites;
        const user = this.state;

        if (Object.keys(user).length === 0) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <h2><i className="bi bi-chevron-left" onClick={() => this.props.onBackClick()}></i> Profile</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h3>Loading...</h3>
                        </Col>
                    </Row>
                </Container>
            );
        }

        return (
            <Container>
                <Row>
                    <Col>
                        <h2><span onClick={() => window.history.back()}><i className="bi bi-chevron-left"></i></span> Profile</h2>
                        {this.state.errGetUser && <p className="text-danger">{this.state.errGetUser}</p>}
                        {this.state.errUpdateUser && <p className="text-danger">{this.state.errUpdateUser}</p>}
                        {this.state.errDeleteUser && <p className="text-danger">{this.state.errDeleteUser}</p>}
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Container>
                            <Form>
                                <Form.Group as={Row} className="my-2">
                                    <Form.Label as={Col}>Username:</Form.Label>
                                    <Col>
                                        <Form.Control type="text" value={user.username} onChange={(event) => { this.setState({username: event.target.value}); this.checkUsername(event.target.value); }} />
                                    </Col>
                                </Form.Group>
                                {!!this.state.errUsername && <Row><Form.Text as={Col} id="username-error" className="text-danger text-right">{this.state.errUsername}</Form.Text></Row>}
                                <Form.Group as={Row} className="my-2">
                                    <Form.Label as={Col}>Email Address:</Form.Label>
                                    <Col>
                                        <Form.Control type="email" value={user.email} onChange={(event) => {this.setState({email: event.target.value}); this.checkEmail(event.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                {!!this.state.errEmail && <Row><Form.Text as={Col} id="email-error" className="text-danger text-right">{this.state.errEmail}</Form.Text></Row>}
                                <Form.Group as={Row} className="my-2">
                                    <Form.Label as={Col}>Birthdate (yyyy-mm-dd):</Form.Label>
                                    <Col>
                                        <Form.Control type="text" value={user.birthdate} onChange={(event) => {this.setState({birthdate: event.target.value}); this.checkBirthdate(event.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                {!!this.state.errBirthdate && <Row><Form.Text as={Col} id="birthdate-error" className="text-danger text-right">{this.state.errBirthdate}</Form.Text></Row>}
                                <Form.Group as={Row} className="my-2">
                                    <Form.Label as={Col}>New Password:</Form.Label>
                                    <Col>
                                        <Form.Control type="password" value={user.password1} onChange={(event) => {this.setState({password1: event.target.value}); this.checkPassword1(event.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                {!!this.state.errPassword1 && <Row><Form.Text as={Col} id="password1-error" className="text-danger text-right">{this.state.errPassword1}</Form.Text></Row>}
                                <Form.Group as={Row} className="my-2">
                                    <Form.Label as={Col}>Confirm New Password:</Form.Label>
                                    <Col>
                                        <Form.Control type="password" value={user.password2} onChange={(event) => {this.setState({password2: event.target.value}); this.checkPassword2(event.target.value)}}/>
                                    </Col>
                                </Form.Group>
                                {!!this.state.errPassword2 && <Row><Form.Text as={Col} id="password2-error" className="text-danger text-right">{this.state.errPassword2}</Form.Text></Row>}
                                <Row>
                                    <Col className='text-right'>
                                        <Button type="submit" className="mt-3 float-right" onClick={(e) => this.handleSubmit(e)}>Update</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    {!!this.state.errSubmit && <Form.Text as={Col} id="submit-error" className="text-danger text-right"><p>{this.state.errSubmit}</p></Form.Text>}
                                </Row>
                            </Form>
                        </Container>
                    </Col>
                    <Col md={5} className="my-2">
                        <Button variant="danger" onClick={() => {this.deleteUser()}}>Delete User</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Your Favorite Movies</h2>
                    </Col>
                </Row>
                <Row>
                    {(!favorites || favorites.length === 0) && <p>You don't have any favorites yet!</p>}
                    {(favorites && favorites.length > 0) && favorites.map(m => {
                        return (
                            <Col md={4} key={m._id} className="my-3">
                                <MovieCard key={m._id} movie={m}>
                                    <Button variant="danger" onClick={() => {debugger; console.log('foo');this.props.onRemoveFavorite(m)}}>Remove</Button>
                                </MovieCard>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        )
    }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        axios.get(`${process.env.API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            this.setState({
                username: res.data.username,
                email: res.data.email,
                birthdate: res.data.birthdate.split('T')[0],
                favorites: res.data.favorites,
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    updateUser(user) {
        const token = localStorage.getItem('token');

        const updateOpts = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }

        axios.put(`${process.env.API_URL}/user`, user, updateOpts)
        .then((response) => {
            this.setState({
                errSubmit: 'Updated successfully'
            })
            this.props.onUserUpdated({
                username: response.data.username,
                email: response.data.email,
                birthdate: response.data.birthdate,
                favorites: response.data.favorites,
            });
            
        })
        .catch((err) => {
            console.log(err);
            if (err.response.data) {
                this.setState({
                    errSubmit: err.response.data
                })
            } else {
                this.setState({
                    errSubmit: err.message
                })
            }
        })
    }

    deleteUser() {
        const token = localStorage.getItem('token');
        axios.delete(`${process.env.API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            localStorage.clear();
            this.props.onUserUpdated({
                username: '',
                email: '',
                birthdate: '',
                favorites: '',
            });
            window.open('/', '_self');
        }).catch((err) => {
            this.setState({
                errSubmit: 'Could not delete user'
            })
            console.log(err);
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { username,
            email,
            birthdate,
            password1,
            password2,
            } = this.state;

        const validUsername = this.checkUsername(username);
        const validEmail = this.checkEmail(email);
        const validBirthdate = this.checkBirthdate(birthdate);
        const validPassword1 = this.checkPassword1(password1, false);
        const validPassword2 = this.checkPassword2(password2, false);
        const useNewPassword = validPassword1 && validPassword2;

        const updatedUser = {
            username: username,
            email: email,
            birthdate: birthdate,
        }

        let validPassword = () => {
            // Password is valid if we're missing either
            if (!password1 || !password2) {
                return true;
            }
            // Password is valid if both checks pass, which means we have both
            if (useNewPassword) {
                return true;
            }
            // Otherwise, return false
            return false;
        };

        if (useNewPassword) {
            updatedUser.password = password1;
        }

        if (validUsername && validEmail && validBirthdate && validPassword()) {
            this.updateUser(updatedUser)
        } else {
            console.log('Did not update user:')
            console.log('validUsername:   ', validUsername)
            console.log('validEmail:      ', validEmail)
            console.log('validBirthdate:  ', validBirthdate)
            console.log('validPassword(): ', validPassword())
        }
    }

    checkUsername(username) {
        const isValid = !!username.match(/^[a-zA-Z0-9\-_]{8,}$/);

        if (isValid) {
            this.setState({errUsername: ''})
        } else {
            this.setState({ errUsername: 'Username must be 8 characters, and can only have underscore, dash, letters, or numbers'})
        }

        return isValid;
    }

    checkEmail(email) {
        const emailRegex = /[a-zA-Z0-9_\.\+]+@[a-zA-Z0-9\.]+\.[a-zA-Z]+/;
        const isValid = !!email.match(emailRegex);

        if (isValid) {
            this.setState({
                errEmail: ''
            });
        } else {
            this.setState({
                errEmail: 'Email appears invalid'
            });
        }

        return isValid;
    }
    
    checkPassword1(password1, showErr = true) {
        const hasUp = password1.match(/[a-z]/);
        const hasLow = password1.match(/[A-Z]/);
        const hasSym = password1.match(/[\W]/);
        const hasNum = password1.match(/[0-9]/);
        const isLong = password1.length >= 8;

        const isValid = (hasUp && hasLow && hasSym && hasNum && isLong);

        if (isValid) {
            this.setState({errPassword1: ''})
        } else if (showErr) {
            this.setState({errPassword1: 'Password must be 8 characters, and have an upper and lowercase letter, a number, and a symbol'});
        }
        return isValid;
    }
    
    checkPassword2(password2, showErr = true) {
        const isValid = password2 === this.state.password1;

        if (isValid) {
            this.setState({ errPassword2: '' })
        } else if (showErr) {
            this.setState({ errPassword2: 'Passwords do not match' });
        }


        return password2 === this.state.password1;
    }

    checkBirthdate(birthdate) {
        const dateRegex = /^(19|20)\d\d\-(1[012]|0[1-9])\-(30|31|0[1-9]|[12]\d)$/;
        const isValid = !!birthdate.match(dateRegex);

        if (isValid) {
            this.setState({ errBirthdate: '' })
        } else {
            this.setState({ errBirthdate: 'Date must in the the format YYYY-MM-DD' });
        }

        return isValid;
    }
    
}
