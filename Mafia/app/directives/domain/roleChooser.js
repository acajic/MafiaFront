app.directive('roleChooser', function(residentsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            roleId: '=',
            roleSelected: '=',
            lockToEditMode: '=',
            editMode: '=',
            enableRoleSaving: '=',
            // disableWarning: '=',
            handleAlert: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/roleChooser.html',
        link: function(scope, element, attrs) {
            "use strict";

            if (scope.lockToEditMode)
                scope.editMode = true;


            // scope.infos = [];

            scope.$watch('[city, roleId]', function(values) {
                var city = values[0];
                if (!city)
                    return;

                initRoleLabel();
            }, true);

            function initRoleLabel() {
                scope.roleLabel = ((scope.city && scope.roleId) ? scope.city.rolesById[scope.roleId].role : {}).name || "Select a role";
            }

            scope.toggleMode = function() {
                if (!scope.lockToEditMode)
                    scope.editMode = !scope.editMode;
            };

            scope.optionSelected = function(selectedOption) {
                scope.roleId = selectedOption;
                if (!scope.disableWarning) {
                    if (scope.handleAlert) {
                        scope.handleAlert({alert : {msg: 'Only actions conducted while your true role is selected will be deemed valid.'}})
                    }
                }
                if (scope.roleSelected)
                    scope.roleSelected(selectedOption);
            };

            scope.saveRole = function() {
                if (!scope.roleId) {
                    if (scope.handleAlert) {
                        scope.handleAlert({alert: {msg: 'Select a role first'}});
                    }
                    return;
                }

                var saveRolePromise = residentsService.saveRoleForCityId(scope.city.id, scope.roleId);
                saveRolePromise.then(function(updatedResident) {
                    if (scope.handleAlert) {
                        scope.handleAlert({alert: {type: 'success', msg: 'You will be presented with this role the next time you log in to this game.'}});
                    }

                }, function(reason) {
                    if (scope.handleAlert) {
                        scope.handleAlert({alert: {type: 'danger', msg: 'Server error. Failed to save role.'}});
                    }

                });
            };

            /*
            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };
            */

        }
    };
});