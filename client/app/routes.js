workApp.config(function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/access/login");

    $stateProvider
        .state('access', {
            url: "/access",
            template: '<div ui-view=""></div>'
        })

        .state('access.login', {
            url: "/login",
            templateUrl: "/client/views/auth/login.html",
            data: {
                pageTitle: 'Login System'
            }
        })
        .state('access.register', {
            url: "/register",
            templateUrl: "/client/views/auth/register.html",
            data: {
                pageTitle: 'Register account'
            }
        })
        .state('access.password_reset', {
            url: "/password_reset",
            templateUrl: "/client/views/auth/password_reset.html",
            data: {
                pageTitle: 'Reset password'
            }
        })
        .state('app', {
            url: "/app",
            templateUrl: "/client/views/app.html",
        })
        // Dashboard
        .state('app.dashboard', {
            url: "/dashboard",
            templateUrl: "/client/views/dashboard.html",
            data: {
                pageTitle: 'Dashboard'
            },
            controller: "DashboardController",
        })
        .state('app.team', {
            url: "/team",
            templateUrl: "/client/views/teams/dashboard.html",
            data: {
                pageTitle: 'Team'
            }
        })
        .state('app.project', {
            url: "/project",
            templateUrl: "/client/views/projects/dashboard.html",
            data: {
                pageTitle: 'Project'
            }
        })
        .state('app.project_detail', {
            url: "/project-detail/:id",
            templateUrl: "/client/views/projects/task.html",
            data: {
                pageTitle: 'Tasks'
            }
        })
        .state('app.chat', {
            url: "/chat",
            templateUrl: "/client/views/chats/chat.html",
            data: {
                pageTitle: 'Join Chat'
            }
        })
        .state('app.user', {
            url: "/user",
            template: "<div ui-view class='fade-in-up'></div>",
        })
        .state('app.user.all', {
            url: "/all",
            controller:'UserCtrl',
            templateUrl: "/client/views/user/all.html",
        })
        .state('app.user.add', {
            url: "/add",
            controller:'UserCtrl',
            templateUrl: "/client/views/user/add.html",
        })
    // AngularJS plugins
    .state('app.upload_demo', {
        url: "/upload-demo",
        templateUrl: "/client/views/upload-demo/demo.html",
        data: {
            pageTitle: 'AngularJS File Upload'
        }
    })

    // User Profile
    .state("app.profile", {
        url: "/profile",
        templateUrl: "/client/views/profile/main.html",
        data: {
            pageTitle: 'User Profile'
        },
        controller: "UserProfileController"
    })

    // User Profile Dashboard
    .state("app.profile.dashboard", {
        url: "/dashboard",
        templateUrl: "/client/views/profile/dashboard.html",
        data: {
            pageTitle: 'User Profile'
        }
    })

    // User Profile Account
    .state("app.profile.account", {
        url: "/account",
        templateUrl: "/client/views/profile/account.html",
        data: {
            pageTitle: 'User Account'
        }
    })

});
