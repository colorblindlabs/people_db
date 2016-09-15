/* global angular */
(function() {

    'use strict';

    var app = angular.module('formlyExample', [
        'formly',
        'formlyBootstrap',
        'ngAnimate',
        'ngMessages',
        'ui.bootstrap'
    ]);

    app.run(function(formlyConfig, formlyValidationMessages) {
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

    app.controller('MainCtrl', function MainCtrl($scope, formlyVersion, $http, $uibModal) {
        // Getting user list
        $http.get('/users').success(function(users) {
            $scope.users = users;
        })


        var vm = this;
        // funcation assignment
        vm.onSubmit = onSubmit;
        vm.onReset = onReset;

        vm.options = {};

        vm.model = {};

        vm.fields = [{
            key: 'fullname',
            type: 'input',
            templateOptions: {
                required: true,
                type: 'text',
                label: 'Full Name'
            }
        }, {
            key: 'personal',
            wrapper: 'panel',
            templateOptions: {
                label: 'Personal'
            },
            fieldGroup: [{
                key: 'email',
                type: 'input',
                templateOptions: {
                    label: 'Email',
                    type: 'email',
                    required: true
                }
            }, {
                key: 'phone',
                fieldGroup: [{
                    key: 'number',
                    type: 'input',
                    templateOptions: {
                        label: 'Phone Number',
                        type: 'phone',
                        required: true
                    }
                }, {
                    key: 'type',
                    type: 'input',
                    templateOptions: {
                        label: 'Phone Type',
                        type: 'text'
                    }
                }]
            }, {
                key: 'address',
                type: 'input',
                templateOptions: {
                    required: true,
                    type: 'text',
                    label: 'Address'
                }
            }, {
                key: 'address2',
                type: 'input',
                templateOptions: {
                    type: 'text'
                }
            }, {
                key: 'city',
                type: 'input',
                templateOptions: {
                    required: true,
                    type: 'text',
                    label: 'City'
                }
            }]
        }, {
            key: 'office',
            wrapper: 'panel',
            templateOptions: {
                label: 'Office'
            },
            fieldGroup: [{
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'Name',
                    type: 'text',
                    required: false
                }
            }, {
                key: 'email',
                type: 'input',
                templateOptions: {
                    label: 'Email',
                    type: 'email',
                    required: true
                }
            }, {
                key: 'phone',
                fieldGroup: [{
                    key: 'number',
                    type: 'input',
                    templateOptions: {
                        label: 'Phone Number',
                        type: 'phone',
                        required: true
                    }
                }, {
                    key: 'type',
                    type: 'input',
                    templateOptions: {
                        label: 'Phone Type',
                        type: 'text'
                    }
                }]
            }, {
                key: 'address',
                type: 'input',
                templateOptions: {
                    required: true,
                    type: 'text',
                    label: 'Address'
                }
            }, {
                key: 'address2',
                type: 'input',
                templateOptions: {
                    type: 'text'
                }
            }, {
                key: 'city',
                type: 'input',
                templateOptions: {
                    required: true,
                    type: 'text',
                    label: 'City'
                }
            }]
        }];

        // function definition
        function onSubmit() {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                console.log("GOING TO SEND:", vm.model);
                // Send to server
                var res = $http.post('/users', vm.model);
                res.success(function(data) {
                    console.log(data);
                    $scope.users = data;
                    onReset();
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
                templateUrl: 'editModal.html',
                controller: 'EditModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    formData: function() {
                        return {
                            model: model,
                            fields: [{
                                key: 'fullname',
                                type: 'input',
                                templateOptions: {
                                    required: true,
                                    type: 'text',
                                    label: 'Full Name'
                                }
                            }, {
                                key: 'personal',
                                wrapper: 'panel',
                                templateOptions: {
                                    label: 'Personal'
                                },
                                fieldGroup: [{
                                    key: 'email',
                                    type: 'input',
                                    templateOptions: {
                                        label: 'Email',
                                        type: 'email',
                                        required: true
                                    }
                                }, {
                                    key: 'phone',
                                    fieldGroup: [{
                                        key: 'number',
                                        type: 'input',
                                        templateOptions: {
                                            label: 'Phone Number',
                                            type: 'phone',
                                            required: true
                                        }
                                    }, {
                                        key: 'type',
                                        type: 'input',
                                        templateOptions: {
                                            label: 'Phone Type',
                                            type: 'text'
                                        }
                                    }]
                                }, {
                                    key: 'address',
                                    type: 'input',
                                    templateOptions: {
                                        required: true,
                                        type: 'text',
                                        label: 'Address'
                                    }
                                }, {
                                    key: 'address2',
                                    type: 'input',
                                    templateOptions: {
                                        type: 'text'
                                    }
                                }, {
                                    key: 'city',
                                    type: 'input',
                                    templateOptions: {
                                        required: true,
                                        type: 'text',
                                        label: 'City'
                                    }
                                }]
                            }, {
                                key: 'office',
                                wrapper: 'panel',
                                templateOptions: {
                                    label: 'Office'
                                },
                                fieldGroup: [{
                                    key: 'name',
                                    type: 'input',
                                    templateOptions: {
                                        label: 'Name',
                                        type: 'text',
                                        required: false
                                    }
                                }, {
                                    key: 'email',
                                    type: 'input',
                                    templateOptions: {
                                        label: 'Email',
                                        type: 'email',
                                        required: true
                                    }
                                }, {
                                    key: 'phone',
                                    fieldGroup: [{
                                        key: 'number',
                                        type: 'input',
                                        templateOptions: {
                                            label: 'Phone Number',
                                            type: 'phone',
                                            required: true
                                        }
                                    }, {
                                        key: 'type',
                                        type: 'input',
                                        templateOptions: {
                                            label: 'Phone Type',
                                            type: 'text'
                                        }
                                    }]
                                }, {
                                    key: 'address',
                                    type: 'input',
                                    templateOptions: {
                                        required: true,
                                        type: 'text',
                                        label: 'Address'
                                    }
                                }, {
                                    key: 'address2',
                                    type: 'input',
                                    templateOptions: {
                                        type: 'text'
                                    }
                                }, {
                                    key: 'city',
                                    type: 'input',
                                    templateOptions: {
                                        required: true,
                                        type: 'text',
                                        label: 'City'
                                    }
                                }]
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
    app.controller('EditModalCtrl', function($scope, $uibModalInstance, formData, $http) {
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

})();
