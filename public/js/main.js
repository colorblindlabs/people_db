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

        vm.model = {};

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
            className: 'section-label',
            template: '<div><strong>Email *</strong></div>'
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
            template: '<div><strong>Phone *</strong></div>'
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
        }, {
            key: 'address',
            type: 'textarea',
            ngModelElAttrs: {
                'capitalize-first': 'capitalize-first'
            },
            templateOptions: {
                required: true,
                type: 'text',
                label: 'Address'
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
        }];

        // function definition
        function onSubmit() {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();

                // Send to server
                var res = $http.post('/users', vm.model);
                res.success(function(data) {
                    console.log(data);
                    $scope.users = data;
                    vm.model = {};
                });
                res.error(function(err) {
                    console.log(err);
                })
            }
        }

        function onReset() {
            vm.options.resetModel();
        }

        // Edit user
        $scope.edit = function(model, id) {
            var result = $uibModal.open({
                templateUrl: 'modalTemplate.html',
                controller: 'ModalCtrl',
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
                                key: 'personal.email',
                                type: 'input',
                                templateOptions: {
                                    label: 'Primary Email',
                                    type: 'email',
                                    required: true
                                }
                            }, {
                                className: 'row',
                                fieldGroup: [{
                                    key: 'personal.phone.number',
                                    type: 'input',
                                    className: 'col-xs-8',
                                    templateOptions: {
                                        label: 'Primary Phone Number',
                                        type: 'phone',
                                        required: true
                                    }
                                }, {
                                    key: "personal.phone.type",
                                    type: "select",
                                    className: 'col-xs-4',
                                    templateOptions: {
                                        label: "Phone Type",
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
                                }]
                            }, {
                                key: 'personal.address',
                                type: 'textarea',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'Address'
                                }
                            }, {
                                key: 'personal.city',
                                type: 'input',
                                ngModelElAttrs: {
                                    'capitalize-first': 'capitalize-first'
                                },
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'City'
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
    });

    // Modal controllers
    app.controller('ModalCtrl', function($scope, $uibModalInstance, formData, $http) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // variable assignment
        vm.formData = formData;
        vm.originalFields = angular.copy(vm.formData.fields);

        // function definition
        function ok() {
            console.log('Going to send:', vm.formData.model);
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

})();
