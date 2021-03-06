import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from 'react';
import { LoginPage } from './App.js'
import { MainPage } from './MainPage.js'
import { ChallengePage } from "./challenge.js";
import { ShopPage } from "./shop.js";
import { ProfilePage } from "./profile.js";
import { MessagePage } from "./messages.js";

export default function Routes(){
      return(
    <BrowserRouter>
    <Switch> 
        <Route path='/' exact component={LoginPage}></Route>
        <Route path='/login' exact component={LoginPage}></Route>
        <Route path='/main' exact component={MainPage}></Route>
        <Route path='/challenge' exact component={ChallengePage}></Route>
        <Route path='/shop' exact component={ShopPage}></Route>
        <Route path='/profile' exact component={ProfilePage}></Route>
        <Route path='/messages' exact component={MessagePage}></Route>
        <Route path='/' render={() => <div>404</div>}></Route>
    </Switch>
    </BrowserRouter>
    )
  }


