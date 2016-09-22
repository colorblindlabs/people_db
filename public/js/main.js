/* global angular */
(function() {
    console.clear();

    'use strict';

    var app = angular.module('MyApp', [
        'formly',
        'formlyBootstrap',
        'ngAnimate',
        'ngMessages',
        'ui.bootstrap',
        'ngLoadingSpinner'
    ], function config(formlyConfigProvider) {
        var unique = 1;
        formlyConfigProvider.setType({
            name: 'repeatSection',
            templateUrl: 'repeatSection.html',
            controller: function($scope) {
                $scope.formOptions = {
                    formState: $scope.formState
                };
                $scope.addNew = addNew;
                $scope.copyFields = copyFields;

                function copyFields(fields) {
                    fields = angular.copy(fields);
                    addRandomIds(fields);
                    return fields;
                }

                function addNew() {
                    $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                    var repeatsection = $scope.model[$scope.options.key];
                    var lastSection = repeatsection[repeatsection.length - 1];
                    var newsection = {};
                    if (lastSection) {
                        newsection = angular.copy(lastSection);
                    }
                    repeatsection.push(newsection);
                }

                function addRandomIds(fields) {
                    unique++;
                    angular.forEach(fields, function(field, index) {
                        if (field.fieldGroup) {
                            addRandomIds(field.fieldGroup);
                            return; // fieldGroups don't need an ID
                        }

                        if (field.templateOptions && field.templateOptions.fields) {
                            addRandomIds(field.templateOptions.fields);
                        }

                        field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
                    });
                }

                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                }
            }
        });
    });

    app.run(function(formlyConfig, formlyValidationMessages) {
        // NOTE: This next line is highly recommended. Otherwise Chrome's autocomplete will appear over your options!
        formlyConfig.extras.removeChromeAutoComplete = true;

        formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';

        formlyValidationMessages.addStringMessage('required', 'This field is required');
    });

    app.config(function(formlyConfigProvider) {

        formlyConfigProvider.setWrapper({
            name: 'validation',
            types: ['input'],
            templateUrl: 'error-messages.html'
        });

        formlyConfigProvider.setWrapper({
            name: 'panel',
            templateUrl: 'panel.html'
        });

    });

    // Capitalize input field directive
    app.directive('capitalizeFirst', function(uppercaseFilter, $parse) {
        return {
            require: 'ngModel',
            scope: {
                ngModel: "="
            },
            link: function(scope, element, attrs, modelCtrl) {
                scope.$watch("ngModel", function() {
                    scope.ngModel = scope.ngModel.replace(/^(.)|\s(.)/g, function(v) {
                        return v.toUpperCase();
                    });
                });
            }
        };
    });

    // MAIN CONTROLLER
    app.controller('MainCtrl', function MainCtrl($scope, formlyVersion, $http, $uibModal) {
        // Getting user list
        $http.get('/users').success(function(users) {
            $scope.users = users;
        })

        var vm = this;
        // function assignment
        vm.onSubmit = onSubmit;
        vm.onReset = onReset;

        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };

        vm.model = {
            email: [],
            phone: []
        };

        vm.options = {};

        vm.fields = [{
            key: 'fullname',
            type: 'input',
            ngModelElAttrs: {
                'capitalize-first': 'capitalize-first'
            },
            templateOptions: {
                required: true,
                type: 'text',
                label: 'Full Name'
            }
        }, {
            key: 'address',
            type: 'textarea',
            ngModelElAttrs: {
                'capitalize-first': 'capitalize-first'
            },
            templateOptions: {
                required: true,
                type: 'text',
                label: 'Address',
                rows: 3
            }
        }, {
            key: 'city',
            type: 'input',
            ngModelElAttrs: {
                'capitalize-first': 'capitalize-first'
            },
            templateOptions: {
                required: true,
                type: 'text',
                label: 'City'
            }
        }, {
            className: 'section-label',
            template: '<div><strong>Email</strong></div>'
        }, {
            type: 'repeatSection',
            key: 'email',
            templateOptions: {
                btnText: '[+ Add email]',
                fields: [{
                    key: 'address',
                    type: 'input',
                    templateOptions: {
                        type: 'email',
                        required: true
                    }
                }]
            }
        }, {
            className: 'section-label',
            template: '<div><strong>Phone</strong></div>'
        }, {
            type: 'repeatSection',
            key: 'phone',
            templateOptions: {
                btnText: '[+ Add phone]',
                fields: [{
                    className: 'row',
                    fieldGroup: [{
                        key: "type",
                        type: "select",
                        className: 'col-xs-5',
                        templateOptions: {
                            valueProp: "name",
                            options: [{
                                name: "Mobile"
                            }, {
                                name: "Land Line"
                            }, {
                                name: "Fax"
                            }],
                            required: true
                        }
                    }, {
                        key: 'number',
                        type: 'input',
                        className: 'col-xs-7',
                        templateOptions: {
                            type: 'phone',
                            required: true
                        }
                    }]
                }]
            }
        }];

        // function definition
        function onSubmit() {
            console.clear();
            if (vm.form.$valid) {
                vm.options.updateInitialValue();

                // Send to server
                var res = $http.post('/users', vm.model);
                res.success(function(data) {
                    $scope.users = data;
                    vm.model = {};
                });
                res.error(function(err) {
                    console.log(err);
                })
            }
        }

        function onReset() {
            console.clear();
            vm.options.resetModel();
        }

        // Edit user
        $scope.edit = function(model, id) {
            console.clear();
            var result = $uibModal.open({
                templateUrl: 'modalTemplate.html',
                controller: 'UserModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    formData: function() {
                        return {
                            model: model,
                            fields: [{
                                key: 'fullname',
                                type: 'input',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'Full Name'
                                }
                            }, {
                                key: 'address',
                                type: 'textarea',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'Address',
                                    rows: 3
                                }
                            }, {
                                key: 'city',
                                type: 'input',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'City'
                                }
                            }, {
                                className: 'section-label',
                                template: '<div><strong>Email</strong></div>'
                            }, {
                                type: 'repeatSection',
                                key: 'email',
                                templateOptions: {
                                    btnText: '[+ Add email]',
                                    fields: [{
                                        key: 'address',
                                        type: 'input',
                                        templateOptions: {
                                            type: 'email',
                                            required: true
                                        }
                                    }]
                                }
                            }, {
                                className: 'section-label',
                                template: '<div><strong>Phone</strong></div>'
                            }, {
                                type: 'repeatSection',
                                key: 'phone',
                                templateOptions: {
                                    btnText: '[+ Add phone]',
                                    fields: [{
                                        className: 'row',
                                        fieldGroup: [{
                                            key: "type",
                                            type: "select",
                                            className: 'col-xs-4',
                                            templateOptions: {
                                                valueProp: "name",
                                                options: [{
                                                    name: "Mobile"
                                                }, {
                                                    name: "Land Line"
                                                }, {
                                                    name: "Fax"
                                                }],
                                                required: true
                                            }
                                        }, {
                                            key: 'number',
                                            type: 'input',
                                            className: 'col-xs-8',
                                            templateOptions: {
                                                type: 'phone',
                                                required: true
                                            }
                                        }]
                                    }]
                                }
                            }]
                        }
                    }
                }
            }).result;
        }

        // Deleting user
        $scope.delete = function(id) {
            var res = $http.delete('/users/' + id);
            res.success(function(data) {
                $scope.users = data;
            });
            res.error(function(err) {
                console.log(err);
            })
        }

        // Add office data
        $scope.addOff = function(id) {
            console.clear();
            var result = $uibModal.open({
                templateUrl: 'modalTemplate.html',
                controller: 'OfficeModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    formData: function() {
                        return {
                            userid: id,
                            model: {},
                            fields: [{
                                key: 'name',
                                type: 'input',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'Office / Company Name'
                                }
                            }, {
                                key: 'address',
                                type: 'textarea',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'Address',
                                    rows: 3
                                }
                            }, {
                                key: 'city',
                                type: 'input',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'City'
                                }
                            }, {
                                className: 'section-label',
                                template: '<div><strong>Email</strong></div>'
                            }, {
                                type: 'repeatSection',
                                key: 'email',
                                templateOptions: {
                                    btnText: '[+ Add email]',
                                    fields: [{
                                        key: 'address',
                                        type: 'input',
                                        templateOptions: {
                                            type: 'email'
                                        }
                                    }]
                                }
                            }, {
                                className: 'section-label',
                                template: '<div><strong>Phone</strong></div>'
                            }, {
                                type: 'repeatSection',
                                key: 'phone',
                                templateOptions: {
                                    btnText: '[+ Add phone]',
                                    fields: [{
                                        className: 'row',
                                        fieldGroup: [{
                                            key: "type",
                                            type: "select",
                                            className: 'col-xs-4',
                                            templateOptions: {
                                                valueProp: "name",
                                                options: [{
                                                    name: "Mobile"
                                                }, {
                                                    name: "Land Line"
                                                }, {
                                                    name: "Fax"
                                                }]
                                            }
                                        }, {
                                            key: 'number',
                                            type: 'input',
                                            className: 'col-xs-8',
                                            templateOptions: {
                                                type: 'phone'
                                            }
                                        }]
                                    }]
                                }
                            }, {
                                key: 'url',
                                type: 'input',
                                templateOptions: {
                                    type: 'text',
                                    label: 'URL'
                                }
                            }]
                        }
                    }
                }
            }).result;
        }

        // Deleting office
        $scope.deleteOff = function(userId, officeId) {
            var res = $http.delete('/offices/' + userId + '/' + officeId);
            res.success(function(data) {
                $scope.users = data;
            });
            res.error(function(err) {
                console.log(err);
            })
        }

        // Add family data
        $scope.addFam = function(id) {
            console.clear();
            var result = $uibModal.open({
                templateUrl: 'modalTemplate.html',
                controller: 'FamilyModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    formData: function() {
                        return {
                            userid: id,
                            model: {},
                            fields: [{
                                key: 'fullname',
                                type: 'input',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'Full Name'
                                }
                            }, {
                                key: 'address',
                                type: 'textarea',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'Address',
                                    rows: 3
                                }
                            }, {
                                key: 'city',
                                type: 'input',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'City'
                                }
                            }, {
                                className: 'section-label',
                                template: '<div><strong>Email</strong></div>'
                            }, {
                                type: 'repeatSection',
                                key: 'email',
                                templateOptions: {
                                    btnText: '[+ Add email]',
                                    fields: [{
                                        key: 'address',
                                        type: 'input',
                                        templateOptions: {
                                            type: 'email'
                                        }
                                    }]
                                }
                            }, {
                                className: 'section-label',
                                template: '<div><strong>Phone</strong></div>'
                            }, {
                                type: 'repeatSection',
                                key: 'phone',
                                templateOptions: {
                                    btnText: '[+ Add phone]',
                                    fields: [{
                                        className: 'row',
                                        fieldGroup: [{
                                            key: "type",
                                            type: "select",
                                            className: 'col-xs-4',
                                            templateOptions: {
                                                valueProp: "name",
                                                options: [{
                                                    name: "Mobile"
                                                }, {
                                                    name: "Land Line"
                                                }, {
                                                    name: "Fax"
                                                }]
                                            }
                                        }, {
                                            key: 'number',
                                            type: 'input',
                                            className: 'col-xs-8',
                                            templateOptions: {
                                                type: 'phone'
                                            }
                                        }]
                                    }]
                                }
                            }]
                        }
                    }
                }
            }).result;
        }

        // Deleting family
        $scope.deleteFam = function(userId, familyId) {
            var res = $http.delete('/families/' + userId + '/' + familyId);
            res.success(function(data) {
                $scope.users = data;
            });
            res.error(function(err) {
                console.log(err);
            })
        }


    });

    // User Modal controllers
    app.controller('UserModalCtrl', function($scope, $uibModalInstance, formData, $http) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // variable assignment
        vm.formData = formData;
        vm.originalFields = angular.copy(vm.formData.fields);

        // function definition
        function ok() {
            console.log(vm.formData.model);

            // Save new data
            var res = $http.put('/users/' + vm.formData.model._id, vm.formData.model);
            res.success(function(data) {
                $scope.users = data;
            });
            res.error(function(err) {
                console.log(err);
            })

            $uibModalInstance.close(vm.formData.model);
        }

        function cancel() {
            vm.formData.options.resetModel()
            $uibModalInstance.dismiss('cancel');
        };
    });

    // Office Modal controllers
    app.controller('OfficeModalCtrl', function($scope, $uibModalInstance, formData, $http) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // variable assignment
        vm.formData = formData;
        vm.originalFields = angular.copy(vm.formData.fields);
        $scope.users = [];
        
        // function definition
        function ok() {
            vm.formData.model.userid = formData.userid;

            // Send to server
            var res = $http.post('/offices/', vm.formData.model);
            res.success(function(data) {
                $scope.users = data;
            });
            res.error(function(err) {
                console.log(err);
            })

            $uibModalInstance.close(vm.formData.model);
        }

        function cancel() {
            vm.formData.options.resetModel()
            $uibModalInstance.dismiss('cancel');
        };
    });

    // Family Modal controllers
    app.controller('FamilyModalCtrl', function($scope, $uibModalInstance, formData, $http) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // variable assignment
        vm.formData = formData;
        vm.originalFields = angular.copy(vm.formData.fields);

        // function definition
        function ok() {
            vm.formData.model.userid = formData.userid;

            // Send to server
            var res = $http.post('/families/', vm.formData.model);
            res.success(function(data) {
                $scope.users = data;
            });
            res.error(function(err) {
                console.log(err);
            })

            $uibModalInstance.close(vm.formData.model);
        }

        function cancel() {
            vm.formData.options.resetModel()
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
