<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title></title>
    <%@include file="app/js/pre.html" %>
    <%@include file="head.local.html" %>
    <%@include file="comp.html" %>
    <%@include file="app/js/comp.html" %>

    <%@include file="fw.html" %>
    <%@include file="app/js/app.html" %>

    <!-- <script type="text/javascript" src="js/cache/min/app.js"></script> -->
</head>

<body ng-app="xdApp" layout="column" ng-controller="xdController">
    <md-toolbar md-whiteframe="8" layout="row" class="md-toolbar-tools">
        <img src="img/logo.png" width="50px" height="50px" />
        <div style="font-size:20px;font-weight:bold;color:white;">&nbsp;&nbsp;|&nbsp; {{appName}}</div>
        <md-button class="menu md-icon-button" ng-click="toggleMenu()" aria-label="Show Menu" ng-if="loginSuccess">
            <md-icon md-svg-icon="menu"></md-icon>
        </md-button>
        <span flex></span>
        <div layout="row" ng-if="loginSuccess">
            <md-button class="fa fa-user" ng-click="changePassword()"><span class="tool_button">{{user.fullName || user.name}}</span></md-button>
            <md-button class="fa fa-sign-out" ng-click="logout()"><span class="tool_button">退出</span></md-button>
        </div>
    </md-toolbar>
    <div flex layout="row">
        <md-sidenav md-whiteframe="8" class="md-whiteframe-4dp" md-component-id="left" md-is-locked-open="menuOpen && loginSuccess">
            <md-content role="navigation">
                <ul class="side-menu">
                    <li ng-repeat="section in menu.sections" class="parent-list-item" ng-if="loginSuccess">
                        <p class="menu-heading" ng-if="section.type === 'heading'">
                            {{section.name}}
                        </p>
                        <menu-link section="section" ng-if="section.type === 'link'"></menu-link>
                        <menu-toggle section="section" ng-if="section.type === 'toggle'"></menu-toggle>
                    </li>
                </ul>
            </md-content>
        </md-sidenav>
        <md-content flex ui-view id="content" layout="column" style="padding:10px;">
        </md-content>
    </div>
</body>

</html>
