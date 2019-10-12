import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import ProductHome from "./home";
import ProductDetail from "./detail";
import ProductAddUpdate from "./add-update";

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path="/product" exact component={ProductHome} />
        <Route path="/product/detail" exact component={ProductDetail} />
        <Route path="/product/addupdate" exact component={ProductAddUpdate} />
        <Redirect to="/product" />
      </Switch>
    );
  }
}
