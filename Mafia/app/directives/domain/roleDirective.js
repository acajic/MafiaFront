app.directive('role', function($compile, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            resident : '=',
            actionResults: '=',
            actionResultsByType: '=',
            isLoading: '=',
            isLoadingActionResults: '=',
            tabActive: '=',
            dayNumberMin: '=',
            dayNumberMax: '=',
            hasEarlierActionResults: '=',
            loadEarlierActionResults: '=',
            hasMoreRecentActionResults: '=',
            loadMoreRecentActionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/role.html',
        compile: function ( element, attrs ) {
            var time = (new Date()).getTime();
            console.log('Compile: ' + time);

            var roleDirectivesByRoleId = {};
            var citizenDirective = element.find( "citizen" );
            roleDirectivesByRoleId[ROLE_ID_CITIZEN] = citizenDirective;
            var doctorDirective = element.find( "doctor" );
            roleDirectivesByRoleId[ROLE_ID_DOCTOR] = doctorDirective;
            var detectiveDirective = element.find( "detective" );
            roleDirectivesByRoleId[ROLE_ID_DETECTIVE] = detectiveDirective;
            var mobDirective = element.find( "mob" );
            roleDirectivesByRoleId[ROLE_ID_MOB] = mobDirective;
            var tellerDirective = element.find( "teller" );
            roleDirectivesByRoleId[ROLE_ID_TELLER] = tellerDirective;
            var sheriffDirective = element.find( "sheriff" );
            roleDirectivesByRoleId[ROLE_ID_SHERIFF] = sheriffDirective;
            var terroristDirective = element.find( "terrorist" );
            roleDirectivesByRoleId[ROLE_ID_TERRORIST] = terroristDirective;
            var journalistDirective = element.find( "journalist" );
            roleDirectivesByRoleId[ROLE_ID_JOURNALIST] = journalistDirective;
            var fugitiveDirective = element.find( "fugitive" );
            roleDirectivesByRoleId[ROLE_ID_FUGITIVE] = fugitiveDirective;
            var elderDirective = element.find( "elder" );
            roleDirectivesByRoleId[ROLE_ID_ELDER] = elderDirective;
            var necromancerDirective = element.find( "necromancer" );
            roleDirectivesByRoleId[ROLE_ID_NECROMANCER] = necromancerDirective;
            var zombieDirective = element.find( "zombie" );
            roleDirectivesByRoleId[ROLE_ID_ZOMBIE] = zombieDirective;


            for (var roleId in roleDirectivesByRoleId) {
                if (!roleId || !roleDirectivesByRoleId.hasOwnProperty(roleId))
                    continue;

                var roleDirective = roleDirectivesByRoleId[roleId];
                roleDirective.remove();
            }



            return {
                pre: function (scope, element, attrs) {
                    var time = (new Date()).getTime();
                    console.log('Pre-Link: ' + time);

                },
                post: function (scope, element, attrs) {
                    var time = (new Date()).getTime();
                    console.log('Post-Link: ' + time);

                    scope.roleIds = rolesService.roleIds;

                    var roleDiv = element.find('#role');


                    if (!scope.resident || !scope.resident.role) {
                        var citizenDirective = roleDirectivesByRoleId[ROLE_ID_CITIZEN];
                        var transcludeCitizenDirective = $compile( citizenDirective );
                        transcludeCitizenDirective(scope, function( citizenDirectiveClone ) {
                            roleDiv.append( citizenDirectiveClone );
                            roleDirectivesByRoleId[ROLE_ID_CITIZEN] = null;
                        });

                    }

                    scope.$watch('resident.role', function (role) {
                        var roleId;
                        if (role && role.id) {
                            roleId = role.id;
                        } else {
                            roleId = ROLE_ID_CITIZEN;
                        }

                        if (roleDirectivesByRoleId[roleId]) {
                            var roleDirective = roleDirectivesByRoleId[roleId];
                            var transcludeRoleDirective = $compile( roleDirective );
                            transcludeRoleDirective(scope, function( roleDirectiveClone ) {
                                roleDiv.append( roleDirectiveClone );
                                roleDirectivesByRoleId[roleId] = null;
                            });
                        }

                    });

                }
            };

        }
    };
});